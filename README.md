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

This project is configured for Cloudflare Pages as a static Astro build with a single Pages Function.

Cloudflare Pages settings:

- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`
- Project name suggestion: `millions-antifa`

The only Pages Function is the contact endpoint:

- `POST /api/contact-email` — returns the contact address after verifying a Turnstile token. See the Host section above.

There are no D1 or R2 bindings. The artwork submission flow that used them was
removed; if the database and bucket still exist in the Cloudflare account they
are no longer read by anything here.

### Environment variables

Set these in the Pages project settings:

- `CONTACT_EMAIL`: the address `POST /api/contact-email` returns after a
  successful Turnstile challenge. Set it so the address is not committed to this
  public repository — the endpoint falls back to a literal if it is unset.
- `PUBLIC_TURNSTILE_SITE_KEY`: public Turnstile site key. Read during the static
  build, so a change needs a rebuild.
- `TURNSTILE_SECRET_KEY`: private Turnstile secret, used by the Pages Function.
  Never commit this.
- `PUBLIC_SITE_URL`: production site URL.

### Turnstile Form Protection

The contact gate is protected with Cloudflare Turnstile. Client-side widgets are useful for UX, but server-side validation in the Pages Functions is required and must remain enabled.

To configure Turnstile:

1. In the Cloudflare dashboard, open **Turnstile** and create a new widget.
2. Add the production domain and any preview domains that should render the challenge.
3. Copy the widget site key and secret key.
4. In Cloudflare Pages project settings, set `PUBLIC_TURNSTILE_SITE_KEY` as an environment variable for the builds that render the public site. This key is public and is embedded in the static Astro HTML.
5. In Cloudflare Pages project settings, set `TURNSTILE_SECRET_KEY` as a secret/environment variable for Pages Functions. This value is private and must not be committed.
6. Rebuild/redeploy after changing `PUBLIC_TURNSTILE_SITE_KEY`, because it is read during the static Astro build.

Required variables:

- `PUBLIC_TURNSTILE_SITE_KEY`: public Turnstile site key used by the contact gate on the host and contribute pages.
- `TURNSTILE_SECRET_KEY`: private Turnstile secret key used by `POST /api/contact-email` to call Cloudflare Siteverify.

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

If `TURNSTILE_SECRET_KEY` is missing outside the explicit local bypass path, the contact endpoint fails closed and the address is not returned.

## Useful Commands

```bash
npm run check
npm run build
npm audit
npm run preview:pages
npm run deploy:pages
```
