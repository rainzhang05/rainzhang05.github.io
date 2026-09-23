'use client';

import { useEffect, useLayoutEffect } from 'react';
import { readTheme, showTheme } from '@/lib/theme';

/**
 * Keeps the chosen theme on <html> across a change of language. Renders
 * nothing.
 *
 * The inline script sets `data-theme` once, before the first paint. But
 * choosing a language changes the root layout's params, React remounts <html>,
 * and every attribute a script wrote goes with it — the same thing that
 * happens to data-boot. The other language would then arrive in System. This
 * puts the choice back before that commit is painted, which is why it is a
 * layout effect and not an ordinary one.
 *
 * Mounted in the layout rather than inside the switch, for the reason
 * LocaleMemory is: the theme is a fact about the page, not about the control.
 */
const useBeforePaint = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function ThemeMemory() {
  useBeforePaint(() => {
    showTheme(readTheme());
  }, []);

  return null;
}
