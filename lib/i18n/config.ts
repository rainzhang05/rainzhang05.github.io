export type Locale = "en" | "ja";

export const LOCALES: readonly Locale[] = ["en", "ja"] as const;

export const DEFAULT_LOCALE: Locale = "en";

/** Route each locale lives at. English is unprefixed. */
export const LOCALE_PATH: Record<Locale, string> = {
  en: "/",
  ja: "/ja",
};

/** Label shown in the language toggle. */
export const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  ja: "日本語",
};

/** Value for the `lang` attribute on <html> and `hreflang` on locale links. */
export const HTML_LANG: Record<Locale, string> = {
  en: "en",
  ja: "ja",
};

export const SITE_URL = "https://rainzhang.me";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
