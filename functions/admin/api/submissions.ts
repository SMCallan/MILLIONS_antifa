import type { PagesContext } from "../../api/_formValidation";
import { nowIso } from "../../api/_submissionShared";

const REVIEW_STATUSES = ["new", "reviewed", "shortlisted", "rejected", "contacted"] as const;
const LIST_LIMIT = 250;

type ReviewStatus = (typeof REVIEW_STATUSES)[number];

type AdminSubmissionRow = {
  id: string;
  campaign_slug: string;
  email: string;
  title: string | null;
  portfolio_url: string | null;
  preview_link: string | null;
  status: string;
  file_count: number;
  total_bytes: number;
  created_at: string;
  updated_at: string;
};

const SELECT_FIELDS = `id, campaign_slug, email, title, portfolio_url, preview_link,
  status, file_count, total_bytes, created_at, updated_at`;

export async function onRequestGet({ env }: PagesContext) {
  if (!env.SUBMISSIONS_DB) {
    return json({ ok: false, error: "database-unconfigured" }, 503);
  }

  try {
    const { results } = await env.SUBMISSIONS_DB
      .prepare(
        `SELECT ${SELECT_FIELDS}
         FROM submissions
         WHERE title IS NOT NULL
            OR portfolio_url IS NOT NULL
            OR preview_link IS NOT NULL
            OR file_count > 0
            OR status IN ('active', 'new', 'reviewed', 'shortlisted', 'rejected', 'contacted')
         ORDER BY updated_at DESC
         LIMIT ?`,
      )
      .bind(LIST_LIMIT)
      .all<AdminSubmissionRow>();

    return json(
      {
        ok: true,
        submissions: results.map(adminSubmissionState),
      },
      200,
    );
  } catch (error) {
    console.error("Admin submission list failed.", error);
    return json({ ok: false, error: "database-error" }, 500);
  }
}

export async function onRequestPost({ request, env }: PagesContext) {
  if (!env.SUBMISSIONS_DB) {
    return json({ ok: false, error: "database-unconfigured" }, 503);
  }

  const update = await readStatusUpdate(request);
  if (!update || !isValidSubmissionId(update.id) || !isReviewStatus(update.status)) {
    return json({ ok: false, error: "invalid" }, 400);
  }

  try {
    await env.SUBMISSIONS_DB
      .prepare("UPDATE submissions SET status = ?, updated_at = ? WHERE id = ?")
      .bind(update.status, nowIso(), update.id)
      .run();

    const row = await env.SUBMISSIONS_DB
      .prepare(`SELECT ${SELECT_FIELDS} FROM submissions WHERE id = ?`)
      .bind(update.id)
      .first<AdminSubmissionRow>();

    if (!row) {
      return json({ ok: false, error: "not-found" }, 404);
    }

    return json({ ok: true, submission: adminSubmissionState(row) }, 200);
  } catch (error) {
    console.error("Admin submission status update failed.", error);
    return json({ ok: false, error: "database-error" }, 500);
  }
}

async function readStatusUpdate(request: Request) {
  const contentType = request.headers.get("Content-Type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as Record<string, unknown>;
      return {
        id: typeof body.id === "string" ? body.id.trim() : "",
        status: typeof body.status === "string" ? body.status.trim() : "",
      };
    }

    const formData = await request.formData();
    return {
      id: String(formData.get("id") ?? "").trim(),
      status: String(formData.get("status") ?? "").trim(),
    };
  } catch {
    return null;
  }
}

function adminSubmissionState(row: AdminSubmissionRow) {
  return {
    id: row.id,
    campaignSlug: row.campaign_slug,
    title: row.title ?? "",
    email: row.email,
    portfolioUrl: row.portfolio_url ?? "",
    previewLink: row.preview_link ?? "",
    fileCount: Number(row.file_count ?? 0),
    totalBytes: Number(row.total_bytes ?? 0),
    status: displayStatus(row.status),
    submittedAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function displayStatus(status: string) {
  return status === "active" ? "new" : status;
}

function isReviewStatus(value: string): value is ReviewStatus {
  return REVIEW_STATUSES.includes(value as ReviewStatus);
}

function isValidSubmissionId(value: string) {
  return value.length > 0 && value.length <= 128 && /^[a-z0-9_-]+$/i.test(value);
}

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
