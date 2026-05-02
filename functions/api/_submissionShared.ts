import type { D1Database, PagesContext } from "./_formValidation";

export const ACTIVE_CAMPAIGN_SLUG = "open-call";
export const MAGIC_LINK_TTL_SECONDS = 30 * 60;
export const SESSION_COOKIE_NAME = "submission_session";
export const SESSION_TTL_SECONDS = 2 * 60 * 60;
export const MAGIC_LINK_RATE_LIMIT_SECONDS = 2 * 60;

type SubmissionSession = {
  campaignSlug: string;
  emailHash: string;
  exp: number;
};

export type SubmissionRow = {
  id: string;
  campaign_slug: string;
  email: string;
  email_hash: string;
  title: string | null;
  description: string | null;
  portfolio_url: string | null;
  preview_link: string | null;
  full_resolution_link_optional: string | null;
  status: string;
  file_count: number;
  total_bytes: number;
  r2_prefix: string | null;
  created_at: string;
  updated_at: string;
  last_magic_link_sent_at: string | null;
};

const textEncoder = new TextEncoder();

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getRequiredDb(env: PagesContext["env"]) {
  return env.SUBMISSIONS_DB;
}

export function getMagicLinkSecret(env: PagesContext["env"]) {
  return env.MAGIC_LINK_SECRET?.trim() || "";
}

export function nowIso() {
  return new Date().toISOString();
}

export function secondsFromNow(seconds: number) {
  return new Date(Date.now() + seconds * 1000).toISOString();
}

export function isWithinSeconds(isoDate: string | null | undefined, seconds: number) {
  if (!isoDate) return false;
  const timestamp = Date.parse(isoDate);
  return Number.isFinite(timestamp) && Date.now() - timestamp < seconds * 1000;
}

export function randomToken(byteLength = 32) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

export async function secretHash(secret: string, value: string) {
  const signature = await hmacSha256(secret, value);
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function createSessionCookie(
  request: Request,
  secret: string,
  session: Omit<SubmissionSession, "exp">,
) {
  const payload: SubmissionSession = {
    ...session,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encodedPayload = base64Url(textEncoder.encode(JSON.stringify(payload)));
  const signature = base64Url(new Uint8Array(await hmacSha256(secret, encodedPayload)));
  const secure = isLocalRequest(request) ? "" : "; Secure";

  return `${SESSION_COOKIE_NAME}=${encodedPayload}.${signature}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; SameSite=Lax${secure}`;
}

export async function readSubmissionSession(request: Request, secret: string) {
  const cookie = parseCookie(request.headers.get("Cookie") ?? "")[SESSION_COOKIE_NAME];
  if (!cookie) {
    return null;
  }

  const [encodedPayload, signature] = cookie.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = base64Url(new Uint8Array(await hmacSha256(secret, encodedPayload)));
  if (!timingSafeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64UrlToText(encodedPayload)) as SubmissionSession;
    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    if (!payload.emailHash || !payload.campaignSlug) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function findSubmission(db: D1Database, campaignSlug: string, emailHash: string) {
  return db
    .prepare(
      `SELECT id, campaign_slug, email, email_hash, title, description, portfolio_url, preview_link,
        full_resolution_link_optional, status, file_count, total_bytes, r2_prefix, created_at,
        updated_at, last_magic_link_sent_at
       FROM submissions
       WHERE campaign_slug = ? AND email_hash = ?`,
    )
    .bind(campaignSlug, emailHash)
    .first<SubmissionRow>();
}

export function publicSubmissionState(row: SubmissionRow | null) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    campaignSlug: row.campaign_slug,
    title: row.title ?? "",
    description: row.description ?? "",
    portfolioUrl: row.portfolio_url ?? "",
    previewLink: row.preview_link ?? "",
    fullResolutionLinkOptional: row.full_resolution_link_optional ?? "",
    status: row.status,
    fileCount: row.file_count,
    totalBytes: row.total_bytes,
    updatedAt: row.updated_at,
  };
}

export function isLocalRequest(request: Request) {
  const hostname = new URL(request.url).hostname;
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname === "::1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".localhost")
  );
}

function parseCookie(cookieHeader: string) {
  const cookies: Record<string, string> = {};
  for (const part of cookieHeader.split(";")) {
    const [name, ...valueParts] = part.trim().split("=");
    if (!name || valueParts.length === 0) continue;
    cookies[name] = valueParts.join("=");
  }
  return cookies;
}

async function hmacSha256(secret: string, value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", key, textEncoder.encode(value));
}

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64UrlToText(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new TextDecoder().decode(bytes);
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let index = 0; index < a.length; index += 1) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return result === 0;
}
