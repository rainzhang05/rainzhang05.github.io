'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import { chooseTheme, readTheme, themes, type Theme } from '@/lib/theme';
import type { Copy } from '@/lib/types';

const ICONS: Record<Theme, IconName> = { system: 'monitor', light: 'sun', dark: 'moon' };

/**
 * System / Light / Dark. The EN / 日本語 switch's twin — the same pill, the
 * same sliding indicator in --surface-2, the same 22px track — so the header
 * gains a control but not a new kind of control.
 *
 * Unlike the language switch, nothing here navigates: a choice repaints the
 * page in place (lib/theme.ts), so the pill slides on the page it started on
 * and needs no hand-off across a tree swap.
 *
 * Which option *looks* selected is driven from <html> by globals.css, not from
 * the state below. The inline script has already put the stored choice on
 * <html> before this is parsed, so the first paint is right; React only reads
 * the choice after hydration, and styling from state would slide the pill
 * across under the reader on every load. The state is for aria-checked alone,
 * which starts at System on the server and settles on mount without a visible
 * frame.
 *
 * Three equal grid columns and no gap, as in LocaleSwitch: the pill is one
 * column wide, calc((100% - 4px) / 3) of the padding box, and translateX(100%)
 * moves it by exactly one column.
 *
 * It is a radio group, so it keeps a radio group's keyboard: one tab stop, on
 * the chosen option, and the arrow keys move the choice — Home and End to the
 * ends, wrapping at both. Three tab stops whose arrows did nothing was a row
 * of buttons that only said it was something else.
 */
export function ThemeSwitch({ labels }: { labels: Copy['labels']['theme'] }) {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const options = useRef<Partial<Record<Theme, HTMLButtonElement | null>>>({});

  function choose(next: Theme) {
    chooseTheme(next);
    setTheme(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const at = themes.indexOf(theme);
    const last = themes.length - 1;
    const to =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? at === last
          ? 0
          : at + 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? at === 0
            ? last
            : at - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : -1;
    if (to < 0) return;

    event.preventDefault();
    choose(themes[to]);
    options.current[themes[to]]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={labels.group}
      onKeyDown={onKeyDown}
      className="no-copy relative inline-grid shrink-0 grid-cols-3 rounded-pill border border-rule p-0.5"
    >
      <span
        aria-hidden="true"
        className="theme-pill pointer-events-none absolute left-0.5 top-0.5 h-[22px] w-[calc((100%-4px)/3)] rounded-pill bg-surface-2 transition-transform duration-base ease-out"
      />

      {themes.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          ref={(el) => {
            options.current[option] = el;
          }}
          aria-checked={option === theme}
          tabIndex={option === theme ? 0 : -1}
          aria-label={labels[option]}
          title={labels[option]}
          data-theme-option={option}
          onClick={() => choose(option)}
          className="theme-option hit-y relative inline-flex h-[22px] w-[26px] items-center justify-center rounded-pill transition-colors duration-base ease-out"
        >
          <Icon name={ICONS[option]} size={14} />
        </button>
      ))}
    </div>
  );
}
