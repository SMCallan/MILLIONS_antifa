import { formFailure, type PagesContext } from "./_formValidation";

export async function onRequestPost({ request }: PagesContext) {
  return formFailure(request, "/submit", "verified-link-required", 403);
}
