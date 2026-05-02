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

## Useful Commands

```bash
npm run check
npm run build
npm run preview:pages
npm run deploy:pages
```
