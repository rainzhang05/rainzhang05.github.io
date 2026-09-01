import { describe, expect, it } from "vitest";
import { persistLocalePreference, shouldRedirectToJa } from "@/lib/i18n/geo";
import { LOCALE_COOKIE } from "@/lib/i18n/config";

describe("shouldRedirectToJa", () => {
  it("sends Japan visitors on / to Japanese when they have no preference", () => {
    expect(shouldRedirectToJa({ pathname: "/", cookie: null, country: "JP" })).toBe(true);
  });

  it("treats a lowercase country code as Japan", () => {
    expect(shouldRedirectToJa({ pathname: "/", cookie: undefined, country: "jp" })).toBe(true);
  });

  it("leaves / in English when the visitor is not in Japan", () => {
    expect(shouldRedirectToJa({ pathname: "/", cookie: null, country: "US" })).toBe(false);
    expect(shouldRedirectToJa({ pathname: "/", cookie: null, country: null })).toBe(false);
  });

  it("honours an explicit Japanese preference even outside Japan", () => {
    expect(shouldRedirectToJa({ pathname: "/", cookie: "ja", country: "CA" })).toBe(true);
  });

  it("honours an explicit English preference even inside Japan", () => {
    expect(shouldRedirectToJa({ pathname: "/", cookie: "en", country: "JP" })).toBe(false);
  });

  it("never redirects /ja or /design-system", () => {
    expect(shouldRedirectToJa({ pathname: "/ja", cookie: "en", country: "US" })).toBe(false);
    expect(shouldRedirectToJa({ pathname: "/design-system", cookie: "ja", country: "JP" })).toBe(
      false
    );
  });

  it("ignores an unknown cookie value and falls back to geo", () => {
    expect(shouldRedirectToJa({ pathname: "/", cookie: "fr", country: "JP" })).toBe(true);
    expect(shouldRedirectToJa({ pathname: "/", cookie: "fr", country: "US" })).toBe(false);
  });
});

describe("persistLocalePreference", () => {
  it("writes the locale cookie with a site-wide path", () => {
    persistLocalePreference("ja");
    expect(document.cookie).toContain(`${LOCALE_COOKIE}=ja`);
  });
});
