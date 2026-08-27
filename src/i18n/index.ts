// i18n helpers for the static Astro build.
//
// English (`en`) is the full source of truth for copy and the canonical shape of
// every translation (`Translation`). Other locales provide a deep-partial
// override that is merged over English at build time, so any string a translator
// has not filled in yet falls back to English rather than rendering blank.

import { ca } from "./ca";
import { de } from "./de";
import { en, type Translation } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { nl } from "./nl";
import { sv } from "./sv";
import {
  defaultLang,
  languageCodes,
  nonDefaultLanguageCodes,
  type LanguageCode,
} from "./languages";
import type { DeepPartial } from "./types";

const overrides: Record<LanguageCode, DeepPartial<Translation>> = {
  en,
  ca,
  es,
  de,
  sv,
  nl,
  fr,
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

// Recursively overlay `override` on top of `base`. Arrays are replaced wholesale
// (a partial array translation would be ambiguous), objects merge key by key,
// and empty-string overrides are ignored so a blank value keeps the English one.
function deepMerge<T>(base: T, override: DeepPartial<T> | undefined): T {
  if (override === undefined) return base;
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override as unknown as T) ?? base;
  }

  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined || value === "") continue;
    const baseValue = (base as Record<string, unknown>)[key];
    result[key] = isPlainObject(baseValue)
      ? deepMerge(baseValue, value as DeepPartial<typeof baseValue>)
      : value;
  }
  return result as T;
}

const dictionaries: Record<LanguageCode, Translation> = languageCodes.reduce(
  (acc, code) => {
    acc[code] = deepMerge(en, overrides[code]);
    return acc;
  },
  {} as Record<LanguageCode, Translation>,
);

/** Fully-resolved (English-fallback-merged) copy for a locale. */
export function useTranslations(lang: LanguageCode): Translation {
  return dictionaries[lang] ?? dictionaries[defaultLang];
}

/** Read the active locale from a URL pathname's first segment. */
export function getLangFromUrl(url: URL): LanguageCode {
  const [, maybeLang] = url.pathname.split("/");
  if (languageCodes.includes(maybeLang as LanguageCode) && maybeLang !== defaultLang) {
    return maybeLang as LanguageCode;
  }
  return defaultLang;
}

/**
 * Prefix an app-relative path (starting with "/") with the locale segment.
 * The default locale is served without a prefix.
 */
export function localizePath(path: string, lang: LanguageCode): string {
  // Absolute URLs pass straight through: a nav entry may point off-site (the
  // donate link goes directly to the crowdfunding page), and those must not be
  // prefixed with a locale segment.
  if (/^https?:\/\//i.test(path)) return path;

  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  if (clean === "/") return `/${lang}/`;
  return `/${lang}${clean}`;
}

/**
 * App paths that have localized `[lang]` route mirrors. Keep in sync with the
 * files under `src/pages/[lang]/`. Every page currently has a localized mirror.
 */
export const localizedBasePaths: readonly string[] = [
  "/",
  "/tour-dates",
  "/concept",
  "/contribute",
  "/host",
  "/gallery",
  "/links",
];

/** Strip any leading locale segment, returning the canonical (English) path. */
export function getLogicalPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && languageCodes.includes(segments[0] as LanguageCode)) {
    segments.shift();
  }
  return `/${segments.join("/")}`.replace(/\/$/, "") || "/";
}

/** Whether the given path has localized `[lang]` mirror routes. */
export function isLocalizedPath(pathname: string): boolean {
  return localizedBasePaths.includes(getLogicalPath(pathname));
}

/**
 * Given the current pathname, return the equivalent path in another locale so a
 * language switch keeps the visitor on the same page. Pages without a localized
 * mirror fall back to that locale's home, so the switcher never links to a
 * non-existent `/{lang}/...` route.
 */
export function switchLocalePath(pathname: string, target: LanguageCode): string {
  const logical = getLogicalPath(pathname);
  if (!localizedBasePaths.includes(logical)) {
    return localizePath("/", target);
  }
  return localizePath(logical, target);
}

/** getStaticPaths payload for the non-default `[lang]` mirror routes. */
export function getLocalePaths() {
  return nonDefaultLanguageCodes.map((lang) => ({ params: { lang } }));
}

export { defaultLang, languageCodes, nonDefaultLanguageCodes };
export type { LanguageCode, Translation };
