// Shared types and helpers for the Pages Functions.
//
// This was a much larger module supporting the artwork submission flow: R2 and
// D1 bindings, upload validation, redirect helpers. That flow was removed, and
// what remains is only what the Turnstile-gated contact endpoint needs.

export type PagesContext = {
  request: Request;
  env: {
    BYPASS_TURNSTILE_IN_DEV?: string;
    CONTACT_EMAIL?: string;
    PUBLIC_SITE_URL?: string;
    TURNSTILE_SECRET_KEY?: string;
  };
};

export type FormError =
  | "turnstile-invalid"
  | "turnstile-missing"
  | "turnstile-unavailable"
  | "turnstile-unconfigured";

/** Read a trimmed string field, or "" when absent or not a string. */
export function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}
