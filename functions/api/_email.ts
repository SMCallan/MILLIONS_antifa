import { isLocalRequest, type SubmissionRow } from "./_submissionShared";
import type { PagesContext } from "./_formValidation";

type MagicLinkEmail = {
  email: string;
  link: string;
  submission: SubmissionRow | null;
};

export async function sendMagicLinkEmail(
  request: Request,
  env: PagesContext["env"],
  { email, link, submission }: MagicLinkEmail,
) {
  if (!env.EMAIL_PROVIDER_API_KEY) {
    if (isLocalRequest(request)) {
      console.info(
        `Development magic link for ${email}: ${link} (${submission ? "existing" : "new"} submission)`,
      );
    } else {
      console.error("EMAIL_PROVIDER_API_KEY is not configured; magic link email was not sent.");
    }
    return { sent: false, reason: "provider-unconfigured" as const };
  }

  console.error("EMAIL_PROVIDER_API_KEY is configured, but no email provider adapter is implemented yet.");
  return { sent: false, reason: "provider-unimplemented" as const };
}
