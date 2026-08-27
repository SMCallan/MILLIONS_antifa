// Regenerates translation-review/: one Markdown file per locale pairing every
// English string with its translation, for native speakers to check.
//
//   node scripts/translation-review.mjs
//
// Re-run after changing any copy in src/i18n/, or the review files go stale.
// Needs a Node with TypeScript stripping (24+); it imports the dictionaries
// directly rather than parsing them.
import fs from 'node:fs';
import path from 'node:path';

// Repo root, resolved from this file so the script works from any cwd.
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'translation-review');

const { en } = await import(`${ROOT}/src/i18n/en.ts`);
// index.ts uses extensionless imports that Vite resolves and Node does not, so
// the locale files are loaded directly and merged here with the same rules as
// src/i18n/index.ts: objects merge key by key, arrays replace wholesale, and an
// empty-string override keeps the English.
const isPlainObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);
function deepMerge(base, override) {
  if (override === undefined) return base;
  if (!isPlainObject(base) || !isPlainObject(override)) return override ?? base;
  const result = { ...base };
  for (const [k, v] of Object.entries(override)) {
    if (v === undefined || v === '') continue;
    result[k] = isPlainObject(base[k]) ? deepMerge(base[k], v) : v;
  }
  return result;
}
const overrides = {};
for (const code of ['ca', 'es', 'de', 'sv', 'nl', 'fr']) {
  overrides[code] = (await import(`${ROOT}/src/i18n/${code}.ts`))[code];
}
const useTranslations = (code) => deepMerge(en, overrides[code]);

const LANGS = [
  ['ca', 'Catalan', 'català'],
  ['es', 'Spanish', 'español'],
  ['de', 'German', 'Deutsch'],
  ['sv', 'Swedish', 'svenska'],
  ['nl', 'Dutch', 'Nederlands'],
  ['fr', 'French', 'français'],
];

// Friendly headings, so a reviewer sees pages rather than variable names.
const SECTIONS = {
  meta: 'Site name and description',
  nav: 'Navigation and menu labels',
  langSwitcher: 'Language switcher',
  common: 'Shared buttons and messages',
  hero: 'Home page — headline area',
  home: 'Home page — body',
  tourDates: 'Tour dates page',
  concept: 'Concept page',
  contribute: 'Contribute page',
  contributeConditions: 'Contribution conditions',
  host: 'Host page',
  gallery: 'Gallery page',
  collaborators: 'Collaborators page',
  links: 'Links page',
  donate: 'Donate (not currently shown on the site)',
  submit: 'Submission pages',
  admin: 'Admin pages',
};

// Flatten to leaf strings, keeping a readable path.
function walk(node, prefix, out) {
  if (typeof node === 'string') {
    out.push([prefix, node]);
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => walk(v, `${prefix}[${i + 1}]`, out));
    return out;
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) walk(v, prefix ? `${prefix} › ${k}` : k, out);
  }
  return out;
}

fs.mkdirSync(OUT, { recursive: true });
const today = new Date().toISOString().slice(0, 10);
const summary = [];

for (const [code, english, native] of LANGS) {
  const dict = useTranslations(code);
  const lines = [];

  lines.push(`# ${english} (${native}) — translation check`);
  lines.push('');
  lines.push('**A Million Words Against Fascism** — millions-antifa.pages.dev');
  lines.push(`Generated ${today}.`);
  lines.push('');
  lines.push('These translations were produced by an AI assistant and have **not** been');
  lines.push('checked by a native speaker. That is what this document is for.');
  lines.push('');
  lines.push('Each entry shows the English source and the current translation. You do not');
  lines.push('need to touch any code — mark up this file however is easiest, or reply with');
  lines.push('the numbered items you would change and what they should say instead.');
  lines.push('');
  lines.push('Things worth watching for:');
  lines.push('');
  lines.push('- Wording that is grammatically fine but reads as machine-translated.');
  lines.push('- The register: this is an anti-fascist art exhibition, so the tone should be');
  lines.push('  direct and plain, not corporate or academic.');
  lines.push('- Historical terms — International Brigades, the *Ciudad de Barcelona*, the');
  lines.push('  Spanish Civil War — should use whatever wording is standard in your language.');
  lines.push('- **"Solidarity Park" is intentionally left in English** everywhere, as the');
  lines.push('  organisation\'s name. Flag it if that reads badly in context.');
  lines.push('');

  let total = 0;
  let identical = 0;
  const sameAsEnglish = [];
  const body = [];

  for (const key of Object.keys(en)) {
    const enPairs = walk(en[key], '', []);
    const locPairs = new Map(walk(dict[key], '', []));
    if (enPairs.length === 0) continue;

    const rows = [];
    for (const [p, enText] of enPairs) {
      const locText = locPairs.get(p);
      if (typeof locText !== 'string') continue;
      total += 1;
      const same = locText.trim() === enText.trim();
      if (same) {
        identical += 1;
        sameAsEnglish.push(`${SECTIONS[key] ?? key} › ${p}`);
      }
      rows.push([p, enText, locText, same]);
    }
    if (rows.length === 0) continue;

    body.push(`## ${SECTIONS[key] ?? key}`);
    body.push('');
    for (const [p, enText, locText, same] of rows) {
      body.push(`### ${p}`);
      body.push('');
      body.push(`- **English:** ${enText}`);
      body.push(`- **${english}:** ${locText}`);
      if (same) body.push(`- ⚠️ _Identical to the English. Either untranslated, or a name that should stay._`);
      body.push('');
    }
  }

  lines.push(`**${total} strings.** ${total - identical} differ from the English; ${identical} are identical (see the end of this file).`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(...body);

  lines.push('---');
  lines.push('');
  lines.push('## Strings identical to the English');
  lines.push('');
  lines.push('Some of these are deliberate — proper names, and organisations that keep their');
  lines.push('English name. Others may simply never have been translated. Worth a look:');
  lines.push('');
  for (const s of sameAsEnglish) lines.push(`- ${s}`);
  lines.push('');

  const file = path.join(OUT, `${code}-${english.toLowerCase()}.md`);
  fs.writeFileSync(file, lines.join('\n'));
  summary.push([code, english, total, total - identical, identical, path.basename(file)]);
  console.log(`${path.basename(file)}  ${total} strings, ${identical} identical to English`);
}

// Folder README so the person receiving these knows what they are.
const readme = [
  '# Translation check',
  '',
  '**A Million Words Against Fascism** — millions-antifa.pages.dev',
  `Generated ${today}.`,
  '',
  'One file per language. Each shows every piece of text on the site, with the',
  'English source above the current translation.',
  '',
  'The translations were produced by an AI assistant and have **not** been checked',
  'by a native speaker. Please read for anything that is wrong, awkward, or just',
  'reads as machine-translated.',
  '',
  '| Language | File | Strings | Translated | Same as English |',
  '| --- | --- | --- | --- | --- |',
  ...summary.map(([code, english, total, diff, same, file]) =>
    `| ${english} (${code}) | [${file}](${file}) | ${total} | ${diff} | ${same} |`),
  '',
  '## Notes for reviewers',
  '',
  '- No code knowledge needed. Mark up the file, or reply with the headings you',
  '  would change and the wording you would use instead.',
  '- "Solidarity Park" is deliberately left in English throughout, as the name of',
  '  the organisation. Say so if that reads badly in your language.',
  '- Historical terms should follow whatever is standard in your language:',
  '  the International Brigades, the *Ciudad de Barcelona*, the Spanish Civil War.',
  '- The register should be plain and direct. This is an anti-fascist art',
  '  exhibition, not a corporate site.',
  '',
];
fs.writeFileSync(path.join(OUT, 'README.md'), readme.join('\n'));
console.log('\nREADME.md written');
