'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { LocaleSwitch } from './LocaleSwitch';
import type { Locale } from '@/lib/site';
import type { NavLink } from '@/lib/types';

/**
 * Static header: never sticky, no background, no border. Under 720px the
 * links move into a full-page sheet. Navigation is plain anchors, so it
 * works before JavaScript loads and smooth scrolling comes from CSS.
 */
export function SiteHeader({
  name,
  links,
  locale,
}: {
  name: string;
  links: NavLink[];
  locale: Locale;
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

  const wordmark = (
    <a
      href="#top"
      className="no-copy text-body-14 font-medium tracking-[-0.005em] text-ink no-underline transition-colors duration-fast ease-out hover:text-ink-2 hover:no-underline"
    >
      {name}
    </a>
  );

  return (
    <>
      <header className="enter-fade flex items-center justify-between gap-6 pt-9">
        {wordmark}

        <div className="hidden items-center gap-7 sm:flex">
          <nav aria-label="Primary" className="flex gap-7">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                className="no-copy text-body-14 text-ink-2 no-underline transition-colors duration-fast ease-out hover:text-ink hover:no-underline"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <LocaleSwitch current={locale} />
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
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                onClick={() => setOpen(false)}
                className="no-copy block border-b border-rule py-4 text-display-2 font-normal text-ink-2 no-underline transition-colors duration-fast ease-out hover:text-ink hover:no-underline"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-8">
            <LocaleSwitch current={locale} />
          </div>
        </div>
      ) : null}
    </>
  );
}
