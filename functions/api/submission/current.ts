import { formFailure, type PagesContext } from "../_formValidation";
import {
  findSubmission,
  getMagicLinkSecret,
  getRequiredDb,
  publicSubmissionState,
  readSubmissionSession,
} from "../_submissionShared";

export async function onRequestGet({ request, env }: PagesContext) {
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

  const submission = await findSubmission(db, session.campaignSlug, session.emailHash);
  if (!submission) {
    return formFailure(request, "/submit/access", "session-invalid", 401);
  }

  return new Response(
    JSON.stringify({
      ok: true,
      email: submission.email,
      submission: publicSubmissionState(submission),
    }),
    { headers: { "Content-Type": "application/json; charset=utf-8" } },
  );
}
