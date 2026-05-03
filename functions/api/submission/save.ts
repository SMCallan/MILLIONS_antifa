import {
  cleanFileName,
  formFailure,
  isValidHttpUrl,
  readFormData,
  redirectWith,
  uploadFiles,
  validateArtworkUploads,
  validateTextFields,
  type PagesContext,
  type R2Bucket,
} from "../_formValidation";
import {
  ACTIVE_CAMPAIGN_SLUG,
  findSubmission,
  getMagicLinkSecret,
  getRequiredDb,
  nowIso,
  publicSubmissionState,
  readSubmissionSession,
} from "../_submissionShared";
import { validateTurnstile } from "../_turnstile";

const SAVE_FIELDS = [
  { key: "title", required: true, maxLength: 160 },
  { key: "description", required: true, maxLength: 4000 },
  { key: "portfolio_url", maxLength: 2048, validate: isValidHttpUrl, invalidError: "invalid-url" },
  { key: "preview_link", maxLength: 2048, validate: isValidHttpUrl, invalidError: "invalid-url" },
  {
    key: "full_resolution_link_optional",
    maxLength: 2048,
    validate: isValidHttpUrl,
    invalidError: "invalid-url",
  },
] as const;

export async function onRequestPost({ request, env }: PagesContext) {
  const parsed = await readFormData(request, "/submit/access");
  if (parsed.response) {
    return parsed.response;
  }

  const db = getRequiredDb(env);
  if (!db) {
    return formFailure(request, "/submit/access", "database-unconfigured", 503);
  }

  const secret = getMagicLinkSecret(env);
  if (!secret) {
    return formFailure(request, "/submit/access", "magic-link-unconfigured", 503);
  }

  const session = await readSubmissionSession(request, secret);
  if (!session) {
    return formFailure(request, "/submit/access", "session-invalid", 401);
  }

  const { formData } = parsed;
  const turnstile = await validateTurnstile(request, formData, env);
  if (!turnstile.ok) {
    return formFailure(request, "/submit/access", turnstile.error);
  }

  const fieldResult = validateTextFields(formData, SAVE_FIELDS);
  if (fieldResult.error) {
    return formFailure(request, "/submit/access", fieldResult.error);
  }

  const uploads = uploadFiles(formData, "previewFiles");
  const uploadValidation = validateArtworkUploads(uploads);
  if (uploadValidation.error) {
    return formFailure(request, "/submit/access", uploadValidation.error);
  }

  const existing = await findSubmission(db, session.campaignSlug, session.emailHash);
  if (!existing) {
    return formFailure(request, "/submit/access", "session-invalid", 401);
  }

  const hasExistingFiles = existing.file_count > 0;
  const hasPreviewMaterial =
    uploads.length > 0 ||
    hasExistingFiles ||
    Boolean(fieldResult.values.preview_link) ||
    Boolean(fieldResult.values.portfolio_url);

  if (!hasPreviewMaterial) {
    return formFailure(request, "/submit/access", "missing-preview");
  }

  if (uploads.length > 0 && !env.SUBMISSIONS) {
    return formFailure(request, "/submit/access", "storage-error", 503);
  }

  const submissionId = existing.id;
  const timestamp = nowIso();
  let nextPrefix = existing.r2_prefix;
  let nextFileCount = existing.file_count;
  let nextTotalBytes = existing.total_bytes;
  let uploadedPrefix: string | null = null;

  if (uploads.length > 0 && env.SUBMISSIONS) {
    uploadedPrefix = `submissions/${ACTIVE_CAMPAIGN_SLUG}/${submissionId}/preview/${crypto.randomUUID()}/`;

    try {
      for (const [index, file] of uploads.entries()) {
        const storedName = `${String(index + 1).padStart(2, "0")}-${cleanFileName(file.name)}`;
        await env.SUBMISSIONS.put(`${uploadedPrefix}${storedName}`, await file.arrayBuffer(), {
          httpMetadata: { contentType: file.type || "application/octet-stream" },
        });
      }
    } catch (error) {
      console.error("Preview upload failed.", error);
      await deleteR2Prefix(env.SUBMISSIONS, uploadedPrefix);
      return formFailure(request, "/submit/access", "storage-error", 500);
    }

    nextPrefix = uploadedPrefix;
    nextFileCount = uploads.length;
    nextTotalBytes = uploadValidation.totalSize;
  }

  try {
    await db
      .prepare(
        `INSERT INTO submissions (
          id, campaign_slug, email, email_hash, title, description, portfolio_url, preview_link,
          full_resolution_link_optional, status, file_count, total_bytes, r2_prefix, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?, ?, ?)
        ON CONFLICT(campaign_slug, email_hash) DO UPDATE SET
          title = excluded.title,
          description = excluded.description,
          portfolio_url = excluded.portfolio_url,
          preview_link = excluded.preview_link,
          full_resolution_link_optional = excluded.full_resolution_link_optional,
          status = 'new',
          file_count = excluded.file_count,
          total_bytes = excluded.total_bytes,
          r2_prefix = excluded.r2_prefix,
          created_at = CASE
            WHEN submissions.title IS NULL
              AND submissions.description IS NULL
              AND submissions.file_count = 0
              AND submissions.preview_link IS NULL
              AND submissions.portfolio_url IS NULL
            THEN excluded.updated_at
            ELSE submissions.created_at
          END,
          updated_at = excluded.updated_at`,
      )
      .bind(
        submissionId,
        session.campaignSlug,
        existing.email,
        session.emailHash,
        fieldResult.values.title,
        fieldResult.values.description,
        fieldResult.values.portfolio_url,
        fieldResult.values.preview_link,
        fieldResult.values.full_resolution_link_optional,
        nextFileCount,
        nextTotalBytes,
        nextPrefix,
        existing.created_at,
        timestamp,
      )
      .run();
  } catch (error) {
    console.error("Submission metadata update failed.", error);
    if (uploadedPrefix && env.SUBMISSIONS) {
      await deleteR2Prefix(env.SUBMISSIONS, uploadedPrefix);
    }
    return formFailure(request, "/submit/access", "storage-error", 500);
  }

  if (uploadedPrefix && existing?.r2_prefix && existing.r2_prefix !== uploadedPrefix && env.SUBMISSIONS) {
    try {
      await deleteR2Prefix(env.SUBMISSIONS, existing.r2_prefix);
    } catch (error) {
      console.error("Old preview cleanup failed.", error);
    }
  }

  const submission = await findSubmission(db, session.campaignSlug, session.emailHash);
  return saveSuccess(request, submission);
}

async function deleteR2Prefix(bucket: R2Bucket, prefix: string) {
  let cursor: string | undefined;

  do {
    const listed = await bucket.list({ prefix, cursor });
    const keys = listed.objects.map((object) => object.key);
    if (keys.length > 0) {
      await bucket.delete(keys);
    }
    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor);
}

function saveSuccess(request: Request, submission: Awaited<ReturnType<typeof findSubmission>>) {
  if (request.headers.get("Accept")?.includes("application/json")) {
    return new Response(JSON.stringify({ ok: true, submission: publicSubmissionState(submission) }), {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  return redirectWith("/submit/access", { saved: "1" });
}
