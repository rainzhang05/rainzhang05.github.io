'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { LocaleSwitch } from './LocaleSwitch';
import { localeHome, type Locale } from '@/lib/site';
import type { NavLink } from '@/lib/types';

/**
 * Static header: never sticky, no background, no border. Under 640px the
 * links move into a full-page sheet. A link to another route goes through
 * next/link so that route is prefetched.
 *
 * `homeHref` is what an in-page hash hangs off. It is empty on the home page,
 * where "#work" means this page, and the home page's address anywhere else.
 * That emptiness is also what picks the element: on the home page a hash is a
 * plain anchor, so it scrolls before JavaScript loads and the smooth scrolling
 * comes from CSS. Anywhere else the same link crosses a route, and a plain
 * anchor there is a full document load — which is what made coming back from
 * the resume slow. Off the home page it goes through next/link instead, so the
 * home page is prefetched while the resume is being read and the trip back is
 * a transition.
 */
export function SiteHeader({
  name,
  links,
  locale,
  homeHref = '',
  localeHrefs = localeHome,
  currentId,
}: {
  name: string;
  links: NavLink[];
  locale: Locale;
  homeHref?: string;
  localeHrefs?: Record<Locale, string>;
  /** The nav entry for the page being read, marked aria-current. */
  currentId?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const wordmarkClass =
    'no-copy text-body-14 font-medium tracking-[-0.005em] text-ink no-underline transition-colors duration-fast ease-out hover:text-ink-2 hover:no-underline';

  const wordmark = homeHref ? (
    <Link href={homeHref + '#top'} className={wordmarkClass}>
      {name}
    </Link>
  ) : (
    <a href={homeHref + '#top'} className={wordmarkClass}>
      {name}
    </a>
  );

  /** An in-page hash, another route, or somewhere off the site. */
  function navLink(link: NavLink, className: string, onClick?: () => void) {
    const shared = {
      'aria-current': (link.id === currentId ? 'page' : undefined) as 'page' | undefined,
      className,
      onClick,
      children: link.label,
    };

    if (link.href.startsWith('#')) {
      return homeHref ? (
        <Link key={link.id} href={homeHref + link.href} {...shared} />
      ) : (
        <a key={link.id} href={homeHref + link.href} {...shared} />
      );
    }

    if (link.external) {
      return <a key={link.id} href={link.href} target="_blank" rel="noreferrer" {...shared} />;
    }

    return <Link key={link.id} href={link.href} {...shared} />;
  }

  return (
    <>
      <header className="enter-fade flex items-center justify-between gap-6 pt-9">
        {wordmark}

        <div className="hidden items-center gap-7 sm:flex">
          <nav aria-label="Primary" className="flex gap-7">
            {links.map((link) =>
              navLink(
                link,
                'no-copy text-body-14 text-ink-2 no-underline transition-colors duration-fast ease-out hover:text-ink hover:no-underline aria-[current]:text-ink'
              )
            )}
          </nav>
          <LocaleSwitch current={locale} hrefs={localeHrefs} />
        </div>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="no-copy inline-flex h-8 w-8 items-center justify-center rounded-pill text-ink-2 transition-colors duration-fast ease-out hover:bg-surface hover:text-ink sm:hidden"
        >
          <Icon name="menu" size={20} />
        </button>
      </header>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-paper px-gutter-mobile pb-10 pt-7"
        >
          <div className="flex items-center justify-between">
            {wordmark}
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="no-copy inline-flex h-8 w-8 items-center justify-center rounded-pill text-ink-2 transition-colors duration-fast ease-out hover:bg-surface hover:text-ink"
            >
              <Icon name="x" size={20} />
            </button>
          </div>
          <nav aria-label="Primary" className="mt-10 border-t border-rule">
            {links.map((link) =>
              navLink(
                link,
                'no-copy block border-b border-rule py-4 text-display-2 font-normal text-ink-2 no-underline transition-colors duration-fast ease-out hover:text-ink hover:no-underline aria-[current]:text-ink',
                () => setOpen(false)
              )
            )}
          </nav>
          <div className="mt-8">
            <LocaleSwitch current={locale} hrefs={localeHrefs} />
          </div>
        </div>
      ) : null}
    </>
  );
}
