# MILLIONS Antifa

Astro, React, Tailwind, shadcn/ui, Framer Motion, and Three.js site for the Anti-Fascist Art Exhibition / MILLIONS project.

## Local Development

```bash
npm install
npm run dev
```

## Typography

The site sets everything in [Archivo](https://fonts.google.com/specimen/Archivo)
(SIL Open Font License), self-hosted from `@fontsource-variable/archivo`.

Serve it from our own origin — **do not switch to the Google Fonts CDN.**
Hotlinking `fonts.googleapis.com` sends every visitor's IP to Google, which a
Munich court ruled a GDPR violation in 2022. This site's audience is largely in
the EU, so that is a live risk rather than a theoretical one.

We import the `wdth` build, which carries two axes:

- weight `100-900`, so `font-black` renders a drawn 900 instead of a synthetic one
- width `62%-125%`, so the `font-stretch: condensed` on headings actually applies

Both were previously inert: the old stack was Helvetica Neue / Arial Narrow, which
has no 900 and no width axis, and neither font exists on Android or Linux — those
visitors fell through to a generic sans and lost the design entirely.

Only the upright build is imported; the site uses no italics. Fontsource splits
the font by `unicode-range`, so all seven languages load from the single ~90 KB
Latin file — Catalan `l·l`, French `œ`, German `ß`, Swedish `å` and Spanish `¿`
are all inside it, and the Latin-Extended and Vietnamese files are never fetched.
`Layout.astro` preloads the Latin file because the display type is the largest
thing above the fold.

## Home Page Animation

`src/components/HomeAnimation.tsx` picks between two encodes at runtime and falls
back to the poster for reduced-motion and data-saver visitors:

- `public/media/millions-home-desktop-720.mp4` — 1280x720
- `public/media/millions-home-mobile.mp4` — 640x360, served under 768px
- `public/media/millions-home-poster.jpg` — 960x540 poster and fallback still

Full-resolution masters stay out of the repo (gitignored at the root). Cloudflare
Pages rejects any single asset over 25 MiB, so the ~56 MB 1080p master cannot be
served directly.

This footage is unusually expensive to encode — every pixel of the frame is in
motion, so a plain CRF 21 encode comes out *larger* than the source. A light
temporal denoise first strips the grain that otherwise eats the bitrate. To cut
new encodes from a new master:

```bash
ffmpeg -i "final 1.mp4" -an -vf "hqdn3d=3:2:6:6,scale=1280:720:flags=lanczos" -c:v libx264 -preset slow -crf 32 -profile:v high -level 4.0 -pix_fmt yuv420p -movflags +faststart public/media/millions-home-desktop-720.mp4
```

```bash
ffmpeg -i "final 1.mp4" -an -vf "hqdn3d=3:2:6:6,scale=640:360:flags=lanczos" -c:v libx264 -preset slow -crf 32 -profile:v high -level 3.1 -pix_fmt yuv420p -movflags +faststart public/media/millions-home-mobile.mp4
```

Then refresh the poster from a frame where the medallion is on screen:

```bash
ffmpeg -i public/media/millions-home-desktop-720.mp4 -vf "select='eq(n\,240)',scale=960:540:flags=lanczos" -frames:v 1 -q:v 5 public/media/millions-home-poster.jpg
```

## Pages and Content

Copy lives in `src/i18n/`. English (`en.ts`) is the source of truth and the
canonical shape; the other six locales are deep-partial overrides merged over it.

**Objects merge key by key, but arrays are replaced wholesale.** So a locale that
overrides one entry of an array replaces the entire array for that language. If
you add an item to an English array, add it to all seven files or those visitors
silently keep the old list. This is how the concept page once served four
sections in English and five everywhere else.

Structural data sits beside the copy in `src/data/site.ts`, keyed so the
dictionaries supply the words and the data file supplies everything else:

- `primaryNav` / `moreInfoNav` / `footerNav` — `key` indexes `nav` in the
  dictionaries, `href` is the canonical path, localised at render time.
- `tourDates` — the route. `date` and `venue` are optional; a stop without
  them renders as TBC.
- `linkGroups` — the links page. Destinations live here once rather than seven
  times, so fixing a URL is one edit. External destinations were verified live
  in August 2026.

### Donate

The Donate nav entry points straight at the Chuffed crowdfunding project
(`donateUrl` in `src/data/site.ts`). There is no `/donate` page. `localizePath`
returns absolute URLs untouched, which is what lets a nav entry leave the site
without picking up a locale prefix.

The `donate` block remains in the dictionaries although nothing renders it. It
is kept so restoring a donate page is a matter of re-adding the route rather
than rewriting seven translations.

### Collaborators

`/collaborators` renders `src/data/collaborators.ts`. Each entry takes a name,
optional role, roughly 100 words of bio, an optional image under
`public/collaborators/`, and an optional link. A profile with no image gets
initials; one with no link renders as text rather than a dead anchor. An empty
list renders the empty state.

Bios are deliberately outside the dictionaries: they are published as the
collaborator wrote them, in their own language.

### Host

The host page has no form. It lists what a proposal should contain and reveals
the contact address behind a Turnstile challenge.

The address is **not** in the markup. `POST /api/contact-email` returns it only
after verifying the Turnstile token server-side, and the page injects it into
the DOM at runtime, so address harvesters reading the HTML find nothing.

**Set `CONTACT_EMAIL` in the Pages project.** This repository is public, so the
fallback literal in `functions/api/contact-email.ts` is visible here. The
fallback exists only so the page works before the variable is configured.

## Cloudflare Pages

This project is configured for Cloudflare Pages as a static Astro build with Pages Functions for form posts.

Cloudflare Pages settings:

- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`
- Project name suggestion: `millions-antifa`

The form routes are implemented as Pages Functions:

- `POST /api/contact-email`
- `POST /api/submission/request-link`
- `POST /api/submission/verify-token`
- `GET /api/submission/current`
- `POST /api/submission/save`
- `GET /admin/api/submissions`
- `POST /admin/api/submissions`
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

### Protected Submission Review

The minimal reviewer interface lives at `/admin/submissions`. It lists D1 submission metadata for reviewers:

- title
- email
- portfolio link
- preview link
- file count
- total preview size
- review status
- submitted and updated timestamps

Reviewers can update the status to `new`, `reviewed`, `shortlisted`, `rejected`, or `contacted`.

Before production use, protect `/admin/*` with Cloudflare Access. The metadata API is intentionally under `/admin/api/submissions` so the same Access policy covers the page and the Pages Function endpoint. Do not expose `/admin/*` publicly.

Recommended Cloudflare Access setup:

1. In Cloudflare Zero Trust, create a **Self-hosted** Access application.
2. Set the application domain/path to the production Pages hostname plus `/admin/*`.
3. Add allow policies for named reviewer emails, an identity provider group, or a short-lived one-time PIN policy for approved reviewers.
4. Confirm both `/admin/submissions` and `/admin/api/submissions` are blocked in a private browser before login.
5. Repeat the policy for any Pages preview hostname that should be used for review testing.

The current app intentionally does not include password auth. If the admin API is ever moved outside `/admin/*`, add runtime Cloudflare Access JWT validation in the Pages Function before returning D1 data. Use Cloudflare Access's signed JWT from the `Cf-Access-Jwt-Assertion` header or `CF_Authorization` cookie, verify it against the Access team JWKS endpoint, and check the expected audience tag before listing or updating submissions.

The reviewer page does not expose private R2 object keys or public file URLs. If preview file downloads are added later, keep the endpoint under `/admin/*`, require Cloudflare Access, and generate short-lived links scoped to a single submission/file instead of making the R2 bucket public.

Status changes currently update the submission's `updated_at` value. If production review needs separate artist-edit and reviewer-action timestamps, add a D1 migration for `status_updated_at` and update `POST /admin/api/submissions` to write that field instead.

Required Cloudflare bindings and variables:

- `SUBMISSIONS`: private R2 bucket binding for preview files.
- `SUBMISSIONS_DB`: D1 database binding for campaigns, submissions, and magic links.
- `MAGIC_LINK_SECRET`: random secret used to hash magic-link tokens and sign submission session cookies.
- `PUBLIC_SITE_URL`: production site URL used when building magic links.
- `PUBLIC_TURNSTILE_SITE_KEY`: public Turnstile site key used by static form widgets.
- `TURNSTILE_SECRET_KEY`: private Turnstile secret used by Pages Functions.
- `CONTACT_EMAIL`: address returned by `POST /api/contact-email` after a Turnstile challenge, used by the host page. Set this so the address is not committed to a public repository; the endpoint falls back to a literal if it is unset.

Optional future email settings:

- `EMAIL_PROVIDER_API_KEY`: reserved for a future email provider adapter.
- `SUBMISSION_NOTIFICATION_EMAIL`: reserved for future reviewer notifications.

No email vendor is implemented yet. In local development, missing email provider settings cause the magic link to be logged only for local requests. Production fails closed if no adapter can send the link, so artists are not told that an email was sent when none was delivered.

Before production use, implement the adapter in `functions/api/_email.ts` with a transactional email provider. Keep it vendor-neutral in the rest of the app:

1. Store provider secrets in Cloudflare Pages environment variables, never in the repository.
2. Send the magic-link URL in the email body to the normalized recipient address only.
3. Return `{ ok: true }` from `sendMagicLinkEmail` only after the provider accepts the message.
4. Log provider errors without logging the full magic-link token in production.
5. Keep notification emails metadata-only; do not attach R2 files.

After creating the D1 database and adding the `SUBMISSIONS_DB` binding in Wrangler/Pages settings, apply all D1 migrations before production use:

```bash
npx wrangler d1 migrations apply <your-submissions-d1-database-name> --remote
```

For local Pages Function testing with a configured local D1 binding, apply the migrations to the local D1 database and bind D1/R2/dev variables:

```bash
npx wrangler d1 migrations apply <your-submissions-d1-database-name> --local
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

- `PUBLIC_TURNSTILE_SITE_KEY`: public Turnstile site key used by the artwork submission widget and the host page contact gate.
- `TURNSTILE_SECRET_KEY`: private Turnstile secret key used by `POST /api/submission/request-link`, `POST /api/submission/save`, and `POST /api/contact-email` to call Cloudflare Siteverify.

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
npm audit
npm run preview:pages
npm run deploy:pages
```
