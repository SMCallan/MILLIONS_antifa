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

- `POST /api/artwork`
- `POST /api/booking`

For live submission storage, add an R2 binding named `SUBMISSIONS` to the Pages project. A suitable bucket name is `millions-antifa-submissions`.

Without that binding, form posts redirect as submitted but are not stored. This keeps preview deploys from failing while the storage binding is being set up.

## Useful Commands

```bash
npm run check
npm run build
npm run preview:pages
npm run deploy:pages
```
