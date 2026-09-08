'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';
import { localeHome } from '@/lib/site';

/**
 * What the reader arrived at. One thing arrives per navigation: the first
 * screen, or the section they came for.
 *
 * The resume page's header and footer link to sections of the home page, so
 * arriving part-way down it is ordinary rather than exotic. Playing the first
 * screen's cascade there was wrong twice over — the section that was asked for
 * waited out six beats belonging to an intro nobody could see, and the two
 * sections with no beat of their own simply appeared — so each has an arrival
 * of its own, and it is the only thing that moves.
 */
const sections: readonly string[] = ['experience', 'work', 'background', 'contact'];

/**
 * `#top` is the document rather than a section — it is where the wordmark and
 * "Back to top" go — so arriving there is arriving at the first screen, which
 * is also what an unrecognised hash and no hash at all mean.
 */
export function entranceFromHash(hash: string): string {
  const id = hash.replace(/^#/, '');
  return sections.includes(id) ? id : 'intro';
}

/** The home page is the only one with sections to arrive at. */
export function entranceFor(pathname: string, hash: string): string {
  const home: readonly string[] = Object.values(localeHome);
  return home.includes(pathname) ? entranceFromHash(hash) : 'intro';
}

/**
 * Sets `data-entrance` on <html> — the same element and the same idea as
 * `data-boot`, and set first by the same inline script, which runs before any
 * content is parsed. That is what keeps a deep link from being seen before it
 * arrives: the server cannot know the fragment, so a React prop would render
 * the settled page, paint it, and only then hide it to animate it in.
 *
 * What is left for React is navigation. This runs before paint, so the section
 * is decided in the frame it is committed, and it runs on the shared layout so
 * that leaving the home page for the resume clears the attribute behind it —
 * otherwise a stale value would suppress the resume page's own entrance.
 *
 * Nothing after the attribute needs JavaScript: the arrival is a CSS animation
 * with `animation-fill-mode: both`, so it finishes on its own whatever happens
 * to the bundle.
 */
const useBeforePaint = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function EntranceRouter() {
  const pathname = usePathname();

  useBeforePaint(() => {
    document.documentElement.dataset.entrance = entranceFor(pathname, window.location.hash);
  }, [pathname]);

  return null;
}
