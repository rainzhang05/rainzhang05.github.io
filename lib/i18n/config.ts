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

/** Open Graph locale identifiers. */
export const OG_LOCALE: Record<Locale, string> = {
  en: "en_CA",
  ja: "ja_JP",
};

export const SITE_URL = "https://rainzhang.me";

/**
 * Explicit language choice, written only by the locale toggle. Middleware
 * honours this over geo so a visitor in Japan can stay on English.
 */
export const LOCALE_COOKIE = "portfolio.locale";

/** One year, in seconds. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
