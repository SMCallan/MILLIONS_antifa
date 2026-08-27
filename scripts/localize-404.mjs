// Astro's directory build format emits the localized 404 routes as
// dist/<lang>/404/index.html. Cloudflare Pages serves the nearest 404.html
// walking up from the requested path, so it would never find those and every
// locale would fall back to the English 404 at the root.
//
// This moves each one to dist/<lang>/404.html, where Pages will actually use
// it. Runs after `astro build`; see the build script in package.json.
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'dist');
const moved = [];

for (const entry of fs.readdirSync(DIST, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const from = path.join(DIST, entry.name, '404', 'index.html');
  if (!fs.existsSync(from)) continue;

  const to = path.join(DIST, entry.name, '404.html');
  fs.renameSync(from, to);
  fs.rmSync(path.join(DIST, entry.name, '404'), { recursive: true, force: true });
  moved.push(`${entry.name}/404.html`);
}

console.log(moved.length ? `localized 404s: ${moved.join(', ')}` : 'localized 404s: none found');
