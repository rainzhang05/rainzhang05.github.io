'use client';

import { useEffect } from 'react';
import { rememberLocale, type Locale } from '@/lib/site';

/**
 * Remembers the language of the page being read, so the next visit opens in
 * it. Renders nothing.
 *
 * The switch in the header writes the same cookie on a click; this covers
 * every other way a reader ends up in a language — the one-time redirect for
 * a visitor in Japan, a link to /ja someone was sent, a bookmark. After the
 * first visit the cookie is what decides, and location is never consulted
 * again.
 *
 * Mounted in the layout rather than beside the switch: the memory is a fact
 * about the page, not about the control, and a page that ever renders without
 * a header should still be remembered.
 */
export function LocaleMemory({ locale }: { locale: Locale }) {
  useEffect(() => {
    try {
      rememberLocale(locale);
    } catch {
      // Cookies denied. Every visit is then a first visit, which is the
      // behaviour this site had before the cookie existed.
    }
  }, [locale]);

  return null;
}
