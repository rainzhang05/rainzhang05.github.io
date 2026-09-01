import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { EN_CONTENT } from "@/lib/i18n/en/content";
import { EN_COPY } from "@/lib/i18n/en/copy";
import { JA_CONTENT } from "@/lib/i18n/ja/content";
import { JA_COPY } from "@/lib/i18n/ja/copy";
import type { Dictionary } from "@/lib/i18n/types";

const DICTIONARIES: Record<Locale, Dictionary> = {
  en: { locale: "en", copy: EN_COPY, content: EN_CONTENT },
  ja: { locale: "ja", copy: JA_COPY, content: JA_CONTENT },
};

export function getDictionary(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

export { DICTIONARIES };
