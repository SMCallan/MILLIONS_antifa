// Supported locales for the site. English is the default and is served from the
// site root (no URL prefix); every other locale is served under /{code}/.
//
// `flag` is a Unicode regional-indicator emoji for the six national locales.
// Catalan has no country flag emoji, so it is rendered as an inline SVG senyera
// by the LanguageSwitcher (see `svgFlag`). Swap these for a dedicated flag-icon
// set later if you want fully consistent rendering across every platform.

export type LanguageCode = "en" | "ca" | "es" | "de" | "sv" | "nl" | "fr";

export interface LanguageMeta {
  /** Native name shown in the switcher. */
  label: string;
  /** English name, used for aria-labels. */
  englishName: string;
  /** Unicode flag emoji, or null when an inline SVG is used instead. */
  flag: string | null;
  /** Text direction. All current locales are left-to-right. */
  dir: "ltr" | "rtl";
}

export const defaultLang: LanguageCode = "en";

export const languages: Record<LanguageCode, LanguageMeta> = {
  en: { label: "English", englishName: "English", flag: "\u{1F1EC}\u{1F1E7}", dir: "ltr" },
  ca: { label: "Català", englishName: "Catalan", flag: null, dir: "ltr" },
  es: { label: "Español", englishName: "Spanish", flag: "\u{1F1EA}\u{1F1F8}", dir: "ltr" },
  de: { label: "Deutsch", englishName: "German", flag: "\u{1F1E9}\u{1F1EA}", dir: "ltr" },
  sv: { label: "Svenska", englishName: "Swedish", flag: "\u{1F1F8}\u{1F1EA}", dir: "ltr" },
  nl: { label: "Nederlands", englishName: "Dutch", flag: "\u{1F1F3}\u{1F1F1}", dir: "ltr" },
  fr: { label: "Français", englishName: "French", flag: "\u{1F1EB}\u{1F1F7}", dir: "ltr" },
};

export const languageCodes = Object.keys(languages) as LanguageCode[];

/** Locales other than the default, used to generate prefixed routes. */
export const nonDefaultLanguageCodes = languageCodes.filter(
  (code) => code !== defaultLang,
);
