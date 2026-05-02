# MILLIONS Antifa

Astro, React, Tailwind, shadcn/ui, Framer Motion, and Three.js site for the Anti-Fascist Art Exhibition / MILLIONS project.

## Local Development

```bash
npm install
npm run dev
```

## Cloudflare Pages

This project is configured for Cloudflare Pages as a static Astro build with Pages Functions for form posts.

Cloudflare Pages settings:

- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`
- Project name suggestion: `millions-antifa`

The form routes are implemented as Pages Functions:

- `POST /api/booking`
- `POST /api/submission/request-link`
- `POST /api/submission/verify-token`
- `GET /api/submission/current`
- `POST /api/submission/save`
- `POST /api/artwork` remains as a closed legacy route that redirects to the verified-link flow.

### Artwork Preview Upload Policy

The public artwork form accepts review/preview material only. It must not be used for final production or master files.

Accepted public upload formats:

- JPG/JPEG
- PNG
- WebP
- PDF
- MP3, M4A, or WAV audio previews

Current limits:

- Maximum files per submission: 5
- Maximum individual file size: 20MB
- Maximum total upload size: 75MB

Do not accept PSD, TIFF, ZIP, EXE, arbitrary binary files, huge layered documents, print-ready masters, audio masters, or video masters through the public form. Video previews should preferably be shared as links such as Vimeo, YouTube, Google Drive, Dropbox, or WeTransfer. Selected or shortlisted artists can be contacted later for high-resolution, print-ready, layered, audio-master, or video-master originals through a more controlled process.

Keeping the public upload ceiling at 75MB leaves headroom below Cloudflare's 100MB Free/Pro request body limit and keeps storage costs predictable.

### R2 Storage

For live submission storage, add an R2 binding named `SUBMISSIONS` to the Pages project. A suitable bucket name is `millions-antifa-submissions`.

Without that binding, valid form posts redirect with `?storage=unconfigured` and are not stored. This keeps preview deploys from failing while the storage binding is being set up.

The R2 bucket should remain private. Store uploaded files and metadata references only; do not email file attachments from form handlers. If notification email is added later, send metadata and private object references for reviewers instead of attachments.

Configure lifecycle deletion in Cloudflare R2 so preview submissions are automatically expired according to the project's retention policy.

### Verified Artwork Submission Flow

Artwork submissions use a lightweight verified-email flow, not full user accounts:

- Artists request a secure email magic link from `/submit`.
- The link opens `/submit/access?token=...`.
- `POST /api/submission/verify-token` exchanges a valid link for a short-lived HttpOnly submission session cookie.
- The artist can create or update one active submission for the open-call campaign.
- `POST /api/submission/save` stores metadata in D1 and private preview files in R2.
- Resubmitting with new preview files replaces the previous active preview set after validation.
- Final, master, layered, high-resolution, audio-master, or video-master files are requested later outside the public upload flow.

The legacy anonymous artwork upload endpoint `POST /api/artwork` is closed and redirects artists to the verified-link flow.

Required Cloudflare bindings and variables:

- `SUBMISSIONS`: private R2 bucket binding for preview files.
- `SUBMISSIONS_DB`: D1 database binding for campaigns, submissions, and magic links.
- `MAGIC_LINK_SECRET`: random secret used to hash magic-link tokens and sign submission session cookies.
- `PUBLIC_SITE_URL`: production site URL used when building magic links.
- `PUBLIC_TURNSTILE_SITE_KEY`: public Turnstile site key used by static form widgets.
- `TURNSTILE_SECRET_KEY`: private Turnstile secret used by Pages Functions.

Optional future email settings:

- `EMAIL_PROVIDER_API_KEY`: reserved for a future email provider adapter.
- `SUBMISSION_NOTIFICATION_EMAIL`: reserved for future reviewer notifications.

No email vendor is implemented yet. In local development, missing email provider settings cause the magic link to be logged only for local requests. Production must configure an email provider adapter before public use; production logs must not expose magic-link tokens.

After creating the D1 database and adding the `SUBMISSIONS_DB` binding in Wrangler/Pages settings, apply D1 migrations before production use:

```bash
npx wrangler d1 migrations apply millions-antifa-submissions --remote
```

For local Pages Function testing with a configured local D1 binding, apply the migration to the local D1 database and bind D1/R2/dev variables:

```bash
npx wrangler d1 execute SUBMISSIONS_DB --local --file migrations/0001_verified_submissions.sql
npm run preview:pages -- --d1 SUBMISSIONS_DB --r2 SUBMISSIONS --binding MAGIC_LINK_SECRET=dev-secret --binding BYPASS_TURNSTILE_IN_DEV=true
```

Use a strong generated `MAGIC_LINK_SECRET` in Cloudflare Pages. Do not commit `.dev.vars`, production secrets, D1 ids, R2 credentials, Turnstile secrets, or email provider keys.

### Turnstile Form Protection

Public form posts are protected with Cloudflare Turnstile. Client-side widgets are useful for UX, but server-side validation in the Pages Functions is required and must remain enabled.

To configure Turnstile:

1. In the Cloudflare dashboard, open **Turnstile** and create a new widget.
2. Add the production domain and any preview domains that should render the challenge.
3. Copy the widget site key and secret key.
4. In Cloudflare Pages project settings, set `PUBLIC_TURNSTILE_SITE_KEY` as an environment variable for the builds that render the public site. This key is public and is embedded in the static Astro HTML.
5. In Cloudflare Pages project settings, set `TURNSTILE_SECRET_KEY` as a secret/environment variable for Pages Functions. This value is private and must not be committed.
6. Rebuild/redeploy after changing `PUBLIC_TURNSTILE_SITE_KEY`, because it is read during the static Astro build.

Required variables:

- `PUBLIC_TURNSTILE_SITE_KEY`: public Turnstile site key used by the artwork and booking form widgets.
- `TURNSTILE_SECRET_KEY`: private Turnstile secret key used by `POST /api/submission/request-link`, `POST /api/submission/save`, and `POST /api/booking` to call Cloudflare Siteverify.

Development-only bypass:

- `BYPASS_TURNSTILE_IN_DEV=true` can be used only for local Pages Function testing.
- The bypass is accepted only for local request hosts such as `localhost` or `127.0.0.1`.
- Do not set `BYPASS_TURNSTILE_IN_DEV` in Cloudflare Pages production or preview environments.

Example local bypass command:

```bash
npm run preview:pages -- --binding BYPASS_TURNSTILE_IN_DEV=true
```

Example local test with a real Turnstile secret:

```bash
npm run preview:pages -- --binding TURNSTILE_SECRET_KEY=<your-local-secret>
```

If `TURNSTILE_SECRET_KEY` is missing outside the explicit local bypass path, form submissions fail closed and nothing is stored.

## Useful Commands

```bash
npm run check
npm run build
npm run preview:pages
npm run deploy:pages
```
