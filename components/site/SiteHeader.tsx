'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { LocaleSwitch } from './LocaleSwitch';
import { ThemeSwitch } from './ThemeSwitch';
import { localeHome, type Locale } from '@/lib/site';
import type { Copy, NavLink } from '@/lib/types';

/**
 * Static header: never sticky, no background, no border. Under 768px the
 * links and the language switch move into a full-page sheet. A link to another
 * route goes through next/link so that route is prefetched.
 *
 * The theme switch stays in the top-right corner at every width — last in the
 * row on a wide screen, and beside the menu button on a narrow one. It is why
 * the sheet takes over at 768 rather than 640: at 640 the links and the
 * language switch already fill all but 15px of the row, and the full row needs
 * about 740.
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
  themeLabels,
  navigationLabels,
}: {
  name: string;
  links: NavLink[];
  locale: Locale;
  /** The theme switch's names, from the page's own copy. */
  themeLabels: Copy['labels']['theme'];
  navigationLabels: Copy['labels']['navigation'];
  homeHref?: string;
  localeHrefs?: Record<Locale, string>;
  /** The nav entry for the page being read, marked aria-current. */
  currentId?: string;
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogId = useId();

  function closeMenu() {
    dialogRef.current?.close();
    triggerRef.current?.focus({ preventScroll: true });
    setOpen(false);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    if (!open || !dialog || !trigger) return;

    const roots = [document.documentElement, document.body];
    const overflow = roots.map((root) =>
      ['overflow', 'overflow-x', 'overflow-y'].map((property) => ({
        property,
        value: root.style.getPropertyValue(property),
        priority: root.style.getPropertyPriority(property),
      }))
    );
    roots.forEach((root) => {
      root.style.overflow = 'hidden';
    });
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });

    const observer = new ResizeObserver(() => {
      if (getComputedStyle(trigger).display === 'none') {
        dialog.close();
        setOpen(false);
      }
    });
    observer.observe(trigger);

    return () => {
      observer.disconnect();
      if (dialog.open) dialog.close();
      roots.forEach((root, index) => {
        root.style.removeProperty('overflow');
        overflow[index].forEach(({ property, value, priority }) => {
          if (value) root.style.setProperty(property, value, priority);
        });
      });
    };
  }, [open]);

  const wordmarkClass =
    'no-copy text-body-14 font-medium tracking-[-0.005em] text-ink no-underline transition-colors duration-fast ease-out hover:text-ink-2 hover:no-underline';

  const wordmark = (onClick?: () => void) =>
    homeHref ? (
      <Link href={homeHref + '#top'} className={wordmarkClass} onClick={onClick}>
        {name}
      </Link>
    ) : (
      <a href={homeHref + '#top'} className={wordmarkClass} onClick={onClick}>
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
        {wordmark()}

        <div className="flex items-center gap-4 md:gap-7">
          <div className="hidden items-center gap-7 md:flex">
            <nav aria-label={navigationLabels.primary} className="flex gap-7">
              {links.map((link) =>
                navLink(
                  link,
                  'no-copy text-body-14 text-ink-2 no-underline transition-colors duration-fast ease-out hover:text-ink hover:no-underline aria-[current]:text-ink'
                )
              )}
            </nav>
            <LocaleSwitch current={locale} hrefs={localeHrefs} />
          </div>

          <ThemeSwitch labels={themeLabels} />

          <button
            ref={triggerRef}
            type="button"
            aria-label={navigationLabels.menu}
            aria-controls={dialogId}
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="no-copy inline-flex h-8 w-8 items-center justify-center rounded-pill text-ink-2 transition-colors duration-fast ease-out hover:bg-surface hover:text-ink md:hidden"
          >
            <Icon name="menu" size={20} />
          </button>
        </div>
      </header>

      {open ? (
        <dialog
          ref={dialogRef}
          id={dialogId}
          aria-modal="true"
          aria-label={navigationLabels.menu}
          onCancel={(event) => {
            event.preventDefault();
            closeMenu();
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) return;
            const controls = Array.from(
              event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)')
            );
            if (controls.length === 0) return;
            const current = controls.findIndex((control) => control === document.activeElement);
            const next =
              current < 0
                ? event.shiftKey
                  ? controls.length - 1
                  : 0
                : (current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
            event.preventDefault();
            controls[next].focus();
          }}
          className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none flex-col overflow-y-auto border-0 bg-paper px-gutter-mobile pb-10 pt-7 text-ink open:flex"
        >
          <div className="flex items-center justify-between">
            {wordmark(closeMenu)}
            <button
              ref={closeRef}
              type="button"
              aria-label={navigationLabels.closeMenu}
              onClick={closeMenu}
              className="no-copy inline-flex h-8 w-8 items-center justify-center rounded-pill text-ink-2 transition-colors duration-fast ease-out hover:bg-surface hover:text-ink"
            >
              <Icon name="x" size={20} />
            </button>
          </div>
          <nav aria-label={navigationLabels.primary} className="mt-10 border-t border-rule">
            {links.map((link) =>
              navLink(
                link,
                'no-copy block border-b border-rule py-4 text-display-2 font-normal text-ink-2 no-underline transition-colors duration-fast ease-out hover:text-ink hover:no-underline aria-[current]:text-ink',
                closeMenu
              )
            )}
          </nav>
          <div className="mt-8">
            <LocaleSwitch current={locale} hrefs={localeHrefs} onNavigate={closeMenu} />
          </div>
        </dialog>
      ) : null}
    </>
  );
}
