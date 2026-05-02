import { textValue, type FormError, type PagesContext } from "./_formValidation";

type TurnstileVerification = {
  success?: boolean;
  "error-codes"?: string[];
};

type TurnstileEnv = PagesContext["env"];

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function validateTurnstile(request: Request, formData: FormData, env: TurnstileEnv) {
  if (canBypassTurnstile(request, env)) {
    return { ok: true as const, bypassed: true };
  }

  const token = textValue(formData, "cf-turnstile-response");
  if (!token) {
    return turnstileFailure("turnstile-missing");
  }

  const secret = env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is not configured; rejecting form submission.");
    return turnstileFailure("turnstile-unconfigured");
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  const remoteIp = request.headers.get("CF-Connecting-IP");

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    let verification: TurnstileVerification | undefined;

    try {
      verification = (await response.json()) as TurnstileVerification;
    } catch {
      verification = undefined;
    }

    if (!response.ok) {
      console.warn(
        `Turnstile Siteverify returned ${response.status}.`,
        verification?.["error-codes"] ?? [],
      );
      return turnstileFailure(response.status >= 500 ? "turnstile-unavailable" : "turnstile-invalid");
    }

    if (!verification?.success) {
      console.warn("Turnstile rejected form submission.", verification?.["error-codes"] ?? []);
      return turnstileFailure("turnstile-invalid");
    }
  } catch (error) {
    console.error("Turnstile Siteverify request failed.", error);
    return turnstileFailure("turnstile-unavailable");
  }

  return { ok: true as const };
}

function canBypassTurnstile(request: Request, env: TurnstileEnv) {
  return env.BYPASS_TURNSTILE_IN_DEV === "true" && isLocalRequest(request);
}

function isLocalRequest(request: Request) {
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

function turnstileFailure(error: FormError) {
  return { ok: false as const, error };
}
