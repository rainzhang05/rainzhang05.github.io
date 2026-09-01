import {
  isLocale,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  type Locale,
} from "@/lib/i18n/config";

interface GeoRedirectInput {
  pathname: string;
  cookie: string | null | undefined;
  country: string | null | undefined;
}

/**
 * Whether a request for `pathname` should 307 to `/ja`.
 *
 * Cookie wins over geo. `/ja` and every non-root path are never bounced.
 * Country is the ISO 3166-1 alpha-2 code from `x-vercel-ip-country`.
 */
export function shouldRedirectToJa({ pathname, cookie, country }: GeoRedirectInput): boolean {
  if (pathname !== "/") return false;
  if (cookie === "ja") return true;
  if (cookie === "en") return false;
  return country?.toUpperCase() === "JP";
}

/** Persist an explicit toggle choice. No-op on the server. */
export function persistLocalePreference(locale: Locale): void {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function parseLocaleCookie(value: string | null | undefined): Locale | null {
  if (!value || !isLocale(value)) return null;
  return value;
}
