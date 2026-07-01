import type { Translation } from "./en";

// Single shared DeepPartial so the locale override files and the merge helper
// all reference the same type (avoids TS "two unrelated types" errors).
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/** The shape each non-English locale file provides. */
export type TranslationOverride = DeepPartial<Translation>;
