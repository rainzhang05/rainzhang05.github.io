'use client';

import { useEffect } from 'react';
import { bootDeadlineMs, bootFadeMs, bootFlag, bootImageMs, bootReducedMotionMs } from '@/lib/boot';
import { prefersReducedMotion } from '@/lib/useReducedMotion';

/**
 * Waits for the page's own assets, then lifts the sheet. See lib/boot.ts for
 * the shape of the thing and why the defaults sit where they do.
 *
 * Mounted once, in the layout, so a client-side route change does not remount
 * it and the sheet stays down for the rest of the session.
 */

/**
 * One image, settled — loaded, failed, or given up on.
 *
 * `complete` is true for an image that has finished fetching whether or not it
 * succeeded, and for one already in the cache, so it is both the fast path and
 * the reason a 404 can never hang the gate. What it does not cover is a socket
 * that opens and delivers nothing, which fires neither event: hence the
 * budget. `load`/`error` rather than `decode()`, which rejects if the source
 * changes underneath it and would need its rejection swallowed anyway.
 */
function settle(img: HTMLImageElement, budget: number): Promise<void> {
  if (img.complete) return Promise.resolve();

  return new Promise((resolve) => {
    const done = () => {
      clearTimeout(timer);
      img.removeEventListener('load', done);
      img.removeEventListener('error', done);
      resolve();
    };
    const timer = setTimeout(done, budget);
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  });
}

function after(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * A frame, or 50ms, whichever comes first. Waiting on the frame alone is what
 * you want — it means layout has run and asked for the faces it needs — but a
 * backgrounded tab never paints one, and a link opened in one would then sit
 * on the sheet until the deadline and be finished the moment it was looked at.
 */
function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    requestAnimationFrame(done);
    setTimeout(done, 50);
  });
}

export function BootGate() {
  useEffect(() => {
    const root = document.documentElement;

    // Tell the inline script's timer to stand down: React is here.
    window.__bootLive = true;

    // Anything other than `pending` means the sheet was never raised (a repeat
    // visit) or a failsafe has already lowered it. Either way there is nothing
    // to own.
    if (root.dataset.boot !== 'pending') return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const reduced = prefersReducedMotion();

    const sheet = document.getElementById('boot');
    let settled = 0;
    let total = 1; // the fonts count as one

    const progress = () => {
      settled += 1;
      sheet?.style.setProperty('--boot-progress', String(Math.min(1, settled / total)));
    };

    /**
     * Three states, not two. The entrance stays paused through `leaving`, so
     * its 620ms plays after the sheet has gone rather than through the last of
     * it. transitionend does the handoff, with a timer behind it because a
     * backgrounded tab never fires one.
     */
    const finish = () => {
      if (cancelled) return;
      cancelled = true;

      try {
        sessionStorage.setItem(bootFlag, '1');
      } catch {
        // A private window with storage denied still gets the sheet, just once
        // per load rather than once per session. Nothing here depends on it.
      }

      root.dataset.boot = 'leaving';

      const done = () => {
        root.dataset.boot = 'done';
      };
      sheet?.addEventListener('transitionend', done, { once: true });
      timers.push(setTimeout(done, bootFadeMs + 60));
    };

    const work = async () => {
      // A frame first, so layout has asked for the faces it needs: fonts.ready
      // is a snapshot of what is pending when it is read, and read any earlier
      // it resolves against an empty set.
      await nextFrame();
      if (cancelled) return;

      const fonts = document.fonts
        ? document.fonts.ready.then(progress, progress)
        : Promise.resolve();

      const first = Array.from(document.images);
      total += first.length;
      await Promise.allSettled([
        fonts,
        ...first.map((img) => settle(img, bootImageMs).then(progress)),
      ]);
      if (cancelled) return;

      // One more pass, never a loop. document.images is live, so a while loop
      // over it is how a gate hangs forever; hydration is the only thing that
      // can have added an image by now, and it has finished.
      const late = Array.from(document.images).filter((img) => !img.complete);
      total += late.length;
      await Promise.allSettled(late.map((img) => settle(img, bootImageMs).then(progress)));
    };

    Promise.race([work(), after(reduced ? bootReducedMotionMs : bootDeadlineMs)]).then(finish);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
