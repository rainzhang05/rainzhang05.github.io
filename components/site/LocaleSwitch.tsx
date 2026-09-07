'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { localeCookie, localeHome, locales, type Locale } from '@/lib/site';

const LABELS: Record<Locale, string> = { en: 'EN', ja: 'JA' };

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
 * EN / JA switch. Real links, so both routes are crawlable and next/link
 * prefetches the other language before it is clicked. Choosing a language
 * writes the cookie the middleware reads, so the geo redirect never
 * overrides a deliberate choice.
 *
 * The selected pill is one element that slides between the labels rather than
 * a background that jumps. Changing language changes the root layout's params,
 * so React replaces the whole tree and any slide begun on the click is cut off
 * with it. The arriving pill therefore carries `data-slide-from`, and
 * globals.css animates it *from* the label the visitor just left — a keyframe
 * rather than a transition, because it has to be certain to run on mount.
 */
export function LocaleSwitch({ current }: { current: Locale }) {
  const [target, setTarget] = useState<Locale>(current);
  const [slideFrom, setSlideFrom] = useState<Locale | null>(null);

  useEffect(() => {
    setTarget(current);
    const previous = cameFrom();
    if (previous && previous !== current) setSlideFrom(previous);
  }, [current]);

  function remember(locale: Locale) {
    document.cookie = localeCookie + '=' + locale + '; path=/; max-age=31536000; samesite=lax';
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
      className="no-copy relative inline-flex rounded-pill border border-rule p-0.5"
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
          href={localeHome[locale]}
          role="radio"
          aria-checked={locale === current}
          onClick={() => remember(locale)}
          className={
            'relative inline-flex h-[22px] w-[38px] items-center justify-center rounded-pill text-[12.5px] font-medium no-underline transition-colors duration-base ease-out hover:no-underline ' +
            (target === locale ? 'text-ink' : 'text-ink-2 hover:text-ink')
          }
        >
          {LABELS[locale]}
        </Link>
      ))}
    </div>
  );
}
