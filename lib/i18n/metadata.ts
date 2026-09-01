import type { Metadata, Viewport } from "next";
import { LOCALE_PATH, OG_LOCALE, SITE_URL, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";

/** hreflang map. `x-default` points at the English site. */
const ALTERNATE_LANGUAGES: Record<string, string> = {
  en: LOCALE_PATH.en,
  ja: LOCALE_PATH.ja,
  "x-default": LOCALE_PATH.en,
};

export const SHARED_VIEWPORT: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export function buildMetadata(locale: Locale): Metadata {
  const { metadata } = getDictionary(locale).copy;

  return {
    metadataBase: new URL(SITE_URL),
    title: metadata.title,
    description: metadata.description,
    icons: { icon: "/icon.ico" },
    alternates: {
      canonical: LOCALE_PATH[locale],
      languages: ALTERNATE_LANGUAGES,
    },
    openGraph: {
      type: "website",
      siteName: "Rain Zhang",
      title: metadata.title,
      description: metadata.description,
      url: LOCALE_PATH[locale],
      locale: OG_LOCALE[locale],
    },
  };
}
