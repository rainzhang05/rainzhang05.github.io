'use client';

import Link from 'next/link';
import { localeCookie, localeHome, locales, type Locale } from '@/lib/site';

const LABELS: Record<Locale, string> = { en: 'EN', ja: 'JA' };

/**
 * EN / JA switch. Real links, so both routes are crawlable and next/link
 * prefetches the other language before it is clicked. Choosing a language
 * writes the cookie the middleware reads, so the geo redirect never
 * overrides a deliberate choice.
 */
export function LocaleSwitch({ current }: { current: Locale }) {
  function remember(locale: Locale) {
    document.cookie = localeCookie + '=' + locale + '; path=/; max-age=31536000; samesite=lax';
  }

  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className="inline-flex gap-0.5 rounded-pill border border-rule p-0.5"
    >
      {locales.map((locale) => {
        const on = locale === current;
        return (
          <Link
            key={locale}
            href={localeHome[locale]}
            role="radio"
            aria-checked={on}
            onClick={() => remember(locale)}
            className={
              'inline-flex h-[22px] items-center rounded-pill px-2.5 text-[12.5px] font-medium no-underline transition-colors duration-fast ease-out hover:no-underline ' +
              (on ? 'bg-surface-2 text-ink' : 'text-ink-2 hover:text-ink')
            }
          >
            {LABELS[locale]}
          </Link>
        );
      })}
    </div>
  );
}
