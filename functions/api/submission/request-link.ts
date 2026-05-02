import { sendMagicLinkEmail } from "../_email";
import { formFailure, isValidEmail, readFormData, redirectWith, type PagesContext } from "../_formValidation";
import {
  ACTIVE_CAMPAIGN_SLUG,
  MAGIC_LINK_RATE_LIMIT_SECONDS,
  MAGIC_LINK_TTL_SECONDS,
  findSubmission,
  getMagicLinkSecret,
  getRequiredDb,
  isWithinSeconds,
  normalizeEmail,
  nowIso,
  randomToken,
  secondsFromNow,
  secretHash,
} from "../_submissionShared";
import { validateTurnstile } from "../_turnstile";

export async function onRequestPost({ request, env }: PagesContext) {
  const parsed = await readFormData(request, "/submit");
  if (parsed.response) {
    return parsed.response;
  }

  const { formData } = parsed;
  const turnstile = await validateTurnstile(request, formData, env);
  if (!turnstile.ok) {
    return formFailure(request, "/submit", turnstile.error);
  }

  const email = normalizeEmail(String(formData.get("email") ?? ""));
  if (!isValidEmail(email)) {
    return formFailure(request, "/submit", "invalid-email");
  }

  const db = getRequiredDb(env);
  if (!db) {
    return formFailure(request, "/submit", "database-unconfigured", 503);
  }

  const secret = getMagicLinkSecret(env);
  if (!secret) {
    return formFailure(request, "/submit", "magic-link-unconfigured", 503);
  }

  const emailHash = await secretHash(secret, email);
  let submission: Awaited<ReturnType<typeof findSubmission>> = null;
  let token = "";

  try {
    const latestLink = await db
      .prepare("SELECT created_at FROM magic_links WHERE email_hash = ? ORDER BY created_at DESC LIMIT 1")
      .bind(emailHash)
      .first<{ created_at: string }>();

    if (isWithinSeconds(latestLink?.created_at, MAGIC_LINK_RATE_LIMIT_SECONDS)) {
      return requestLinkSuccess(request);
    }

    const timestamp = nowIso();
    const submissionId = crypto.randomUUID();

    await db
      .prepare(
        `INSERT OR IGNORE INTO campaigns (id, slug, name, status)
         VALUES ('campaign_open_call_2026', ?, 'Anti-Fascist Art Exhibition Open Call', 'open')`,
      )
      .bind(ACTIVE_CAMPAIGN_SLUG)
      .run();

    await db
      .prepare(
        `INSERT INTO submissions (
          id, campaign_slug, email, email_hash, status, created_at, updated_at, last_magic_link_sent_at
         )
         VALUES (?, ?, ?, ?, 'draft', ?, ?, ?)
         ON CONFLICT(campaign_slug, email_hash) DO UPDATE SET
          email = excluded.email,
          last_magic_link_sent_at = excluded.last_magic_link_sent_at`,
      )
      .bind(submissionId, ACTIVE_CAMPAIGN_SLUG, email, emailHash, timestamp, timestamp, timestamp)
      .run();

    token = randomToken();
    const tokenHash = await secretHash(secret, token);
    await db
      .prepare(
        `INSERT INTO magic_links (id, email_hash, token_hash, expires_at, created_at)
         VALUES (?, ?, ?, ?, ?)`,
      )
      .bind(crypto.randomUUID(), emailHash, tokenHash, secondsFromNow(MAGIC_LINK_TTL_SECONDS), timestamp)
      .run();

    submission = await findSubmission(db, ACTIVE_CAMPAIGN_SLUG, emailHash);
  } catch (error) {
    console.error("Magic link request database operation failed.", error);
    return formFailure(request, "/submit", "database-unconfigured", 500);
  }

  await sendMagicLinkEmail(request, env, {
    email,
    link: magicLinkUrl(request, env, token),
    submission,
  });

  return requestLinkSuccess(request);
}

function magicLinkUrl(request: Request, env: PagesContext["env"], token: string) {
  const baseUrl = env.PUBLIC_SITE_URL?.trim() || new URL(request.url).origin;
  const url = new URL("/submit/access", baseUrl);
  url.searchParams.set("token", token);
  return url.toString();
}

function requestLinkSuccess(request: Request) {
  if (request.headers.get("Accept")?.includes("application/json")) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  return redirectWith("/submit", { link: "sent" });
}
