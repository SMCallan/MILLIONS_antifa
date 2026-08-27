import type { PagesContext } from "./_formValidation";
import { validateTurnstile } from "./_turnstile";

// Returns the project contact address, but only to a caller that has passed a
// Turnstile challenge. The address is deliberately absent from the static
// build so ordinary address-harvesting crawlers never see it.
//
// Set CONTACT_EMAIL in the Pages project to keep the address out of this
// (public) repository as well. The fallback exists so the page still works
// before that variable is configured.
const FALLBACK_CONTACT_EMAIL = "millionwordssaf@gmail.com";

export async function onRequestPost({ request, env }: PagesContext) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, error: "bad-request" }, 400);
  }

  const turnstile = await validateTurnstile(request, formData, env);
  if (!turnstile.ok) {
    return json({ ok: false, error: turnstile.error }, 403);
  }

  const email = (env.CONTACT_EMAIL ?? "").trim() || FALLBACK_CONTACT_EMAIL;
  return json({ ok: true, email });
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      // The address should never be cached by a shared cache on the way back.
      "Cache-Control": "no-store",
    },
  });
}
