"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import type { Copy, Dictionary, SiteContent } from "@/lib/i18n/types";

/**
 * Defaults to the English dictionary so a component rendered without a
 * provider (unit tests, isolated stories) behaves exactly as it did before
 * localization existed.
 */
const LocaleContext = createContext<Dictionary>(getDictionary(DEFAULT_LOCALE));

interface LocaleProviderProps {
  locale: Locale;
  children: ReactNode;
}

export function LocaleProvider({ locale, children }: LocaleProviderProps) {
  const value = useMemo(() => getDictionary(locale), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext).locale;
}

export function useCopy(): Copy {
  return useContext(LocaleContext).copy;
}

export function useContent(): SiteContent {
  return useContext(LocaleContext).content;
}
