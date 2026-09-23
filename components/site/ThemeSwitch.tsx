'use client';

import { useEffect, useState } from 'react';
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
 */
export function ThemeSwitch({ labels }: { labels: Copy['labels']['theme'] }) {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  function choose(next: Theme) {
    chooseTheme(next);
    setTheme(next);
  }

  return (
    <div
      role="radiogroup"
      aria-label={labels.group}
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
          aria-checked={option === theme}
          aria-label={labels[option]}
          title={labels[option]}
          data-theme-option={option}
          onClick={() => choose(option)}
          className="theme-option relative inline-flex h-[22px] w-[26px] items-center justify-center rounded-pill transition-colors duration-base ease-out"
        >
          <Icon name={ICONS[option]} size={14} />
        </button>
      ))}
    </div>
  );
}
