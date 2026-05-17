import { formFailure, readFormData, type PagesContext } from "../_formValidation";
import {
  ACTIVE_CAMPAIGN_SLUG,
  createSessionCookie,
  findSubmission,
  getMagicLinkSecret,
  getRequiredDb,
  nowIso,
  publicSubmissionState,
  secretHash,
} from "../_submissionShared";

type MagicLinkRow = {
  email_hash: string;
  expires_at: string;
  used_at: string | null;
};

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

  const token = String(parsed.formData.get("token") ?? "").trim();
  if (!token) {
    return formFailure(request, "/submit/access", "invalid-token", 401);
  }

  const tokenHash = await secretHash(secret, token);
  const magicLink = await db
    .prepare("SELECT email_hash, expires_at, used_at FROM magic_links WHERE token_hash = ?")
    .bind(tokenHash)
    .first<MagicLinkRow>();

  if (!magicLink || magicLink.used_at) {
    return formFailure(request, "/submit/access", "invalid-token", 401);
  }

  if (Date.parse(magicLink.expires_at) <= Date.now()) {
    return formFailure(request, "/submit/access", "expired-token", 401);
  }

  const submission = await findSubmission(db, ACTIVE_CAMPAIGN_SLUG, magicLink.email_hash);
  if (!submission) {
    return formFailure(request, "/submit/access", "invalid-token", 401);
  }

  const usedAt = nowIso();
  const tokenUpdate = await db
    .prepare("UPDATE magic_links SET used_at = ? WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?")
    .bind(usedAt, tokenHash, usedAt)
    .run();

  if (tokenUpdate.meta?.changes !== 1) {
    return formFailure(request, "/submit/access", "invalid-token", 401);
  }

  const cookie = await createSessionCookie(request, secret, {
    campaignSlug: ACTIVE_CAMPAIGN_SLUG,
    emailHash: submission.email_hash,
  });

  return new Response(
    JSON.stringify({
      ok: true,
      email: submission.email,
      submission: publicSubmissionState(submission),
    }),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Set-Cookie": cookie,
      },
    },
  );
}
