'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { localeHome, locales, rememberLocale, type Locale } from '@/lib/site';

/**
 * Japanese names itself. "JA" is only legible to someone who already reads
 * English, which is the one reader who does not need the switch.
 */
const LABELS: Record<Locale, string> = { en: 'EN', ja: '日本語' };

/** Where the visitor came from, so the pill can finish its slide after the swap. */
const CAME_FROM = 'portfolio.localeFrom';

function cameFrom(): Locale | null {
  try {
    const value = window.sessionStorage.getItem(CAME_FROM);
    window.sessionStorage.removeItem(CAME_FROM);
    return locales.includes(value as Locale) ? (value as Locale) : null;
  } catch {
    return null;
  }
}

/**
 * EN / 日本語 switch. Real links, so both routes are crawlable and next/link
 * prefetches the other language before it is clicked. Choosing a language
 * writes the cookie the middleware reads, so neither the geo redirect nor the
 * language of the last visit can override a deliberate choice — here or on
 * the visit after it.
 *
 * On a page that exists in both languages the switch is handed that page's two
 * addresses, so choosing a language keeps the reader where they were.
 *
 * The selected pill is one element that slides between the labels rather than
 * a background that jumps. Changing language changes the root layout's params,
 * so React replaces the whole tree and any slide begun on the click is cut off
 * with it. The arriving pill therefore carries `data-slide-from`, and
 * globals.css animates it *from* the label the visitor just left — a keyframe
 * rather than a transition, because it has to be certain to run on mount.
 *
 * The two labels are not the same width, so they sit in two equal grid columns
 * rather than side by side: calc(50% - 2px) of the padding box is then exactly
 * one column whatever the labels say, and translate-x-full moves the pill by
 * exactly one column. It has to be inline-grid — a block-level grid would
 * stretch the whole control across the mobile menu sheet — and it must have no
 * gap, which would move the second column without moving the pill.
 */
export function LocaleSwitch({
  current,
  hrefs = localeHome,
}: {
  current: Locale;
  /** Where each language goes. Defaults to the two home pages. */
  hrefs?: Record<Locale, string>;
}) {
  const [target, setTarget] = useState<Locale>(current);
  const [slideFrom, setSlideFrom] = useState<Locale | null>(null);

  useEffect(() => {
    setTarget(current);
    const previous = cameFrom();
    if (previous && previous !== current) setSlideFrom(previous);
  }, [current]);

  function remember(locale: Locale) {
    rememberLocale(locale);
    try {
      window.sessionStorage.setItem(CAME_FROM, current);
    } catch {
      // Storage denied: the pill simply arrives in place instead of sliding.
    }
    setTarget(locale);
  }

  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className="no-copy relative inline-grid grid-cols-2 rounded-pill border border-rule p-0.5"
    >
      <span
        aria-hidden="true"
        data-slide-from={slideFrom ?? undefined}
        className={
          'locale-pill pointer-events-none absolute left-0.5 top-0.5 h-[22px] w-[calc(50%-2px)] rounded-pill bg-surface-2 transition-transform duration-base ease-out ' +
          (target === 'en' ? 'translate-x-0' : 'translate-x-full')
        }
      />

      {locales.map((locale) => (
        <Link
          key={locale}
          href={hrefs[locale]}
          lang={locale}
          hrefLang={locale}
          role="radio"
          aria-checked={locale === current}
          onClick={() => remember(locale)}
          className={
            'relative inline-flex h-[22px] w-full items-center justify-center rounded-pill px-2 font-jp text-[12.5px] font-medium no-underline transition-colors duration-base ease-out hover:no-underline ' +
            (target === locale ? 'text-ink' : 'text-ink-2 hover:text-ink')
          }
        >
          {LABELS[locale]}
        </Link>
      ))}
    </div>
  );
}
