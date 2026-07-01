# Launch checklist — template redesign + multilingual site

This list covers what the team should review before pushing the redesigned,
multilingual site to production. Items are grouped by priority.

Context: the site was restructured to match the new template (flag language
switcher, logo-left / title-right hero, "Tour dates" + "More information" nav)
and given functional i18n for 7 languages (en, ca, es, de, sv, nl, fr). The
existing R2 / D1 / Turnstile / magic-link submission flow was kept intact.

---

## 1. Blockers — do before launch

- [ ] **Native review of all translations.** The 6 non-English locale files are
      machine-assisted and must be proofread by native speakers before launch —
      the political/historical wording matters for an anti-fascist exhibition.
      Files: `src/i18n/ca.ts`, `es.ts`, `de.ts`, `sv.ts`, `nl.ts`, `fr.ts`.
      English source of truth: `src/i18n/en.ts`. Anything a translator leaves
      out automatically falls back to English (by design).
- [ ] **Confirm the production domain.** It is currently set to
      `https://www.millionwords.net` in `astro.config.mjs` (`site`) — this drives
      the `canonical` and `hreflang` tags. Cross-check against
      `wrangler.jsonc` (`PUBLIC_SITE_URL` = `millions-antifa.pages.dev`) and
      `src/data/site.ts` (`url`). Make all three agree with the real domain.
- [ ] **Cloudflare bindings & secrets are set for the deploy environment**
      (per `README.md`): `SUBMISSIONS` (R2), `SUBMISSIONS_DB` (D1),
      `MAGIC_LINK_SECRET`, `PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`.
      Apply D1 migrations (`wrangler d1 migrations apply ... --remote`).
- [ ] **Protect `/admin/*` with Cloudflare Access** before going live (per
      `README.md`). The reviewer page and its API must not be public.
- [ ] **Implement the magic-link email adapter** in `functions/api/_email.ts`
      (currently a stub — production fails closed and no link is sent). Contribution
      links won't reach artists until this is done.

## 2. Content to finalise

- [ ] **Real contact email.** `src/data/site.ts` `email` is still
      `bookings@example.org` (placeholder). Used by the Donate page mailto and
      as the project contact.
- [ ] **Donate: add the real payment link.** The page currently shows a
      "coming soon" notice + a mailto fallback. Wire up the payment provider and
      update `donate.ctaButton` / remove `donate.ctaPending` in `src/i18n/en.ts`
      (and translations).
- [ ] **Gallery: replace placeholder tiles** in
      `src/components/pages/Gallery.astro` with real works once confirmed.
      (Note: contributions submitted via the secure link are reviewed privately
      and are NOT auto-published here.)
- [ ] **Links: add real URLs.** `links.groups[].items` in the locale files are
      descriptive placeholders with no destinations yet. Add `href`s and render
      them as real links in `src/components/pages/Links.astro`.
- [ ] **Draft copy review.** Concept, Donate, Gallery, Links, and the two
      Conditions pages (Contribute / Host) contain drafted copy — have the
      project team confirm wording, especially the legal/rights/consent and
      retention language on the Conditions pages.
- [ ] **Verify tour data** in `src/data/site.ts` (`tourDates`,
      `artistCommissions`) — dates, venues, collaborators, spellings.
- [ ] **Logo / moving graphic.** The template calls for a "moving graphic
      (Robert Ford)". The hero currently uses the static `million-words-logo.png`.
      Swap in an animated asset if desired (the hero already supports it via the
      `logo` prop / left panel).

## 3. Decisions for the team

- [ ] **Should the functional pages be localized?** `/submit`, `/booking`,
      `/submit/access`, `/admin` are intentionally English-only to avoid
      disturbing the working forms and their many validation/status states. From
      those pages the language flags send non-English visitors to that locale's
      home (`/es/`, `/ca/`, …) rather than a missing translated form. If full
      localization is wanted, the form field labels + `data-form-status` messages
      + the `functions/` redirect targets all need translating. Strings for the
      form labels already exist in the locale files (`host.fields`, `contribute.*`).

## 4. SEO / infra polish

- [ ] **Add a sitemap** (`@astrojs/sitemap`) once the domain is final — it will
      pick up the localized routes and the `hreflang` alternates already emitted.
- [ ] **Add an Open Graph / social share image.** Only `favicon.svg` exists today;
      `og:image` is not set in `src/layouts/Layout.astro`.
- [ ] **Verify `canonical` + `hreflang`** render with the correct absolute domain
      after the domain is confirmed (localized pages emit a full alternate set +
      `x-default`; English-only pages are self-canonical with no alternates).

## 5. QA before push

- [ ] Click through all 7 languages on every marketing page; confirm the switch
      keeps you on the same page and the chrome + content are translated.
- [ ] Keyboard-test the "More information" dropdown (open/close, Escape, focus).
- [ ] Submit the Host enquiry form and request a contribution link end-to-end in
      a preview environment with Turnstile + R2 + D1 configured.
- [ ] Check responsive layout (mobile/tablet) for the split hero and nav.
- [ ] Run `npm run check` (0 errors expected) and `npm run build` before deploy.

---

### Notes for reviewers

- i18n architecture: `src/i18n/` — `en.ts` is the canonical shape/source;
  locale files are deep-partial overrides merged over English with fallback.
  Helpers (`getLangFromUrl`, `useTranslations`, `localizePath`,
  `switchLocalePath`, `getLocalePaths`) live in `src/i18n/index.ts`.
- Page bodies live in `src/components/pages/*.astro` (each reads the locale from
  the URL); route files under `src/pages/` and `src/pages/[lang]/` are thin
  wrappers. To add a page to the localized set, also add its base path to
  `localizedBasePaths` in `src/i18n/index.ts`.
