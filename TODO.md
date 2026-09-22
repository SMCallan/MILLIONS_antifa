# Site checklist

The site is live at https://millionwords.net (`www` redirects to it). This is
what is left, grouped by who needs to act.

---

## 1. Content — project team

- [ ] **Gallery.** Replace the placeholder tiles in
      `src/components/pages/Gallery.astro` with confirmed works. Contributions
      sent by email are reviewed privately and are never published here
      automatically.
- [ ] **Tour data.** Confirm dates, venues and spellings in `src/data/site.ts`:
      `tourDates` (four stops have dates, the rest show "TBC") and
      `artistCommissions`.
- [ ] **Copy sign-off.** Confirm the drafted wording on Concept, Gallery, Links
      and the Contribute / Host conditions, especially the rights, consent and
      retention language. Re-check the translations after any change.
- [ ] **Placeholder email.** `src/data/site.ts` `email` is still
      `bookings@example.org`. Nothing renders it any more: set the real address
      or remove the field.
- [ ] **Contact address (optional).** The email reveal returns `CONTACT_EMAIL`
      when it is set on the Pages project, otherwise the fallback in
      `functions/api/contact-email.ts`.

## 2. Translations

- [ ] **Catalan open questions.** Resolve the "Needs a decision" and
      "Follow-ups" lists in PR #22: commissioned vs selected, curated vs
      selected, the headline in English, "la paraula dita", the sala/espai and
      socis/col·laboradors terms, "Trieu l'idioma", and the two 404 strings the
      reviewer has not seen. The other five locales had native review in
      September 2026.

## 3. QA by hand

- [ ] Click through all 7 languages on every page; the switcher should keep you
      on the same page.
- [ ] Keyboard-test the header "More information" dropdown and the full-screen
      menu, including Escape to close and focus returning to the button.
- [ ] Check mobile and tablet layouts. Known quirk: around 340 px wide,
      "Collaborators" in the full-screen menu squeezes its number column and
      covers the arrow.
- [ ] Share a page link somewhere that shows previews (or use a link-preview
      debugger) and check the card image and title.

## 4. Infrastructure

- [ ] **Retire the old Pages project** `millions-antifa`
      (millions-antifa.pages.dev). It still builds from this repository but can
      no longer reveal the contact email, because its Turnstile secret belongs
      to the old widget.
- [ ] **`npm run deploy:pages`** still passes `--project-name millions-antifa`,
      and the README still suggests that name. Update both once the old project
      is gone.

---

### Done in September 2026

- Production domain `millionwords.net`; `site`, `url` and `PUBLIC_SITE_URL`
  agree, and canonical / hreflang URLs carry the trailing slash Pages serves.
- Sitemap (`sitemap-index.xml` via `@astrojs/sitemap`, with hreflang
  alternates, 404 pages excluded) and `robots.txt` pointing at it.
- Social share card `public/og-image.jpg` (1200×630) with `og:` and
  `twitter:card` tags.
- Turnstile widget and secret for the millionwords.net Pages project.
- The commissioned home film replaced the placeholder animation.
- Links page has real, checked destinations; Donate goes straight to the
  Chuffed campaign.
- Native review applied to all six non-English locales.
- Astro 7 / Vite 8 / Wrangler 4.136; `npm audit` clean.

The earlier checklist also covered an artwork-upload flow (R2, D1, magic-link
email, `/admin`, `/submit`, `/booking`). That flow was replaced by the
email-reveal contact gate, so those items no longer apply; the old list is in
git history.

### Notes for reviewers

- i18n architecture: `src/i18n/` — `en.ts` is the canonical shape/source;
  locale files are deep-partial overrides merged over English with fallback.
  Helpers (`getLangFromUrl`, `useTranslations`, `localizePath`,
  `switchLocalePath`, `getLocalePaths`) live in `src/i18n/index.ts`.
- Page bodies live in `src/components/pages/*.astro` (each reads the locale from
  the URL); route files under `src/pages/` and `src/pages/[lang]/` are thin
  wrappers. To add a page to the localized set, also add its base path to
  `localizedBasePaths` in `src/i18n/index.ts`.
