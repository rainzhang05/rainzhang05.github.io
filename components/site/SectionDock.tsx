'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  ACTIVE_LINE,
  AMPLITUDE,
  BASE,
  OPEN_RATIO,
  RELEASE_RATIO,
  SNAP_EPSILON,
  SPREAD,
  TAU_POINTER,
  TAU_SECTION,
  bandIndex,
  dockMetrics,
  magnify,
  railDistance,
} from '@/lib/dockMotion';
import { targetId } from '@/lib/sectionLinks';
import { prefersReducedMotion } from '@/lib/useReducedMotion';
import type { NavLink } from '@/lib/types';

/** The rail appears this far past the header's bottom edge and leaves again
 *  16px earlier. The band is wide because a flip now restarts a 540ms sequence,
 *  so it has to dwarf a momentum tail and an iOS toolbar reflow. */
const SHOW_AT = 24;
const HIDE_AT = 8;

/** How long a click's smooth scroll may hold the focus index before the
 *  observer is trusted again, and how much stillness counts as arrived. */
const SCROLL_SETTLE_MS = 120;
const SCROLL_CAP_MS = 1200;

/** Layout-derived page position, immune to the .enter transform that leaves
 *  #experience reading 10px long for the first second after paint. */
function offsetTop(el: HTMLElement): number {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

function offsetLeft(el: HTMLElement): number {
  let x = 0;
  let node: HTMLElement | null = el;
  while (node) {
    x += node.offsetLeft;
    node = node.offsetParent as HTMLElement | null;
  }
  return x;
}

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface Landmarks {
  ready: boolean;
  /** Enough page left that the formed dock is somewhere a reader can sit. */
  enabled: boolean;
  /** Page offset at which the top bar's last pixel leaves the viewport. */
  threshold: number;
  /** Viewport height x ACTIVE_LINE, cached so the frame loop reads no layout. */
  activeLine: number;
  pitch: number;
  /** Rail-local y of each bubble's centre, for the lens and the bands. */
  local: number[];
  /** The rail's own box in viewport coordinates. */
  railTop: number;
  railBottom: number;
  railRight: number;
  /** Pointer reach right of the rail, already clamped to the real gutter. */
  reach: number;
  tops: number[];
  maxScroll: number;
}

const EMPTY: Landmarks = {
  ready: false,
  enabled: false,
  threshold: 0,
  activeLine: 0,
  pitch: 0,
  local: [],
  railTop: 0,
  railBottom: 0,
  railRight: 0,
  reach: 0,
  tops: [],
  maxScroll: 0,
};

/**
 * The section dock: a rail of bubbles down the left gutter, which appears once
 * the top bar has scrolled out of sight and tracks the section being read.
 *
 * The entrance is CSS. Crossing the threshold flips one attribute and the
 * transitions in globals.css unfurl the spine and lift the bubbles in from the
 * middle outward; scrolling back up flips it again and an interrupted
 * transition reverses itself. Nothing here is scroll-scrubbed, which is what
 * keeps the motion at its own speed rather than the trackpad's.
 *
 * JavaScript owns four things and no more: data-shown on the rail, data-active
 * and data-open on each button, and the magnifying scale() on each dot. Every
 * property those drive is declared in the stylesheet.
 *
 * Below 640px this never renders: the gate is a media query, not a width read
 * here, so nothing about it depends on hydration.
 */
export function SectionDock({
  links,
  label,
  onNavigate,
}: {
  links: NavLink[];
  label: string;
  onNavigate: (id: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lockRef = useRef<((index: number) => void) | null>(null);

  /** Distance from the middle of the column, and its inverse. CSS cannot count
   *  its siblings, so the stagger order is handed to it per item. */
  const steps = useMemo(() => {
    const centre = (links.length - 1) / 2;
    const away = links.map((_, i) => Math.abs(i - centre));
    const furthest = away.length > 0 ? Math.max(...away) : 0;
    return away.map((d) => ({ in: d, out: furthest - d }));
  }, [links]);

  useEffect(() => setMounted(true), []);

  useIsoLayoutEffect(() => {
    const nav = navRef.current;
    if (!mounted || !nav || links.length === 0) return;

    const dock = nav;
    const reduced = prefersReducedMotion();
    const n = links.length;
    const seen: boolean[] = links.map(() => false);

    let disposed = false;
    let rafId = 0;
    let immediateRaf = 0;
    let needsMeasure = true;
    let last = 0;
    let lastY = Number.NaN;
    let marks: Landmarks = EMPTY;

    let focusY = 0;
    let seeded = false;
    let pointerX = Number.NaN;
    let pointerY = Number.NaN;
    let lensOn = false;
    let openOn = false;
    let focusIndex: number | null = null;
    let observed: number | null = null;
    let locked: number | null = null;
    let shown = false;
    const wroteDot: string[] = links.map(() => '');
    const wroteActive: string[] = links.map(() => '');
    const wroteOpen: string[] = links.map(() => '');

    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    let capTimer: ReturnType<typeof setTimeout> | undefined;

    const wake = () => {
      if (rafId === 0) {
        last = 0;
        rafId = requestAnimationFrame(tick);
      }
    };

    const invalidate = () => {
      needsMeasure = true;
      wake();
    };

    /* ---- read phase: the only place that touches layout ---- */

    function measure() {
      const doc = document.documentElement;
      const viewport = doc.clientHeight;
      const metrics = dockMetrics(dock);
      const header = document.querySelector('header');
      const main = document.getElementById('main');

      if (!metrics || !header || !main || viewport <= 0) {
        marks = EMPTY;
        return;
      }

      const headerEl = header as HTMLElement;
      // "After the top bar items are not able to be seen" — its bottom edge.
      const threshold = offsetTop(headerEl) + headerEl.offsetHeight;

      const { pitch } = metrics;
      const column = n * pitch;
      const railTop = viewport / 2 - column / 2;
      const railRight = metrics.inset + metrics.hit;
      // Never reach out over the prose: past the content column's left edge a
      // pointer is reading, not aiming at the dock.
      const gutter = offsetLeft(main) - railRight;
      const reach = Math.max(0, Math.min(metrics.reach, gutter));

      const maxScroll = Math.max(0, doc.scrollHeight - doc.clientHeight);

      marks = {
        ready: true,
        enabled: maxScroll >= threshold + viewport / 2,
        threshold,
        activeLine: viewport * ACTIVE_LINE,
        pitch,
        local: links.map((_, i) => (i + 0.5) * pitch),
        railTop,
        railBottom: railTop + column,
        railRight,
        reach,
        tops: links.map((link) => {
          const el = document.getElementById(link.id);
          return el ? offsetTop(el) : Number.POSITIVE_INFINITY;
        }),
        maxScroll,
      };

      if (!seeded) {
        focusY = marks.local[0] ?? 0;
        seeded = true;
      }
    }

    /** Where the page says we are, from the same cached numbers the dock draws
     *  from. The observer below is what drives this in a browser; this is the
     *  answer before its first callback, and under happy-dom, whose
     *  IntersectionObserver is a constructible no-op that never fires. */
    function activeFromTops(y: number): number {
      const line = y + marks.activeLine;
      let index = 0;
      for (let i = 0; i < marks.tops.length; i += 1) if (marks.tops[i] <= line) index = i;
      return index;
    }

    /* ---- the frame ---- */

    function tick(now: number) {
      rafId = 0;
      if (disposed) return;

      if (needsMeasure) {
        measure();
        needsMeasure = false;
      }
      if (!marks.ready) return;

      const y = window.scrollY;

      // Hysteresis, and a latch so the rail can never be hidden out from under
      // the keyboard.
      const holdsFocus = dock.contains(document.activeElement);
      if (!shown && marks.enabled && y >= marks.threshold + SHOW_AT) shown = true;
      else if (shown && !holdsFocus && (!marks.enabled || y <= marks.threshold + HIDE_AT))
        shown = false;

      let active = locked ?? observed ?? activeFromTops(y);
      if (locked === null && y >= marks.maxScroll - 2) active = n - 1;

      let openIndex = -1;
      let lensSettled = true;

      if (!reduced) {
        // Proximity. Every boundary releases further out than it engages, so a
        // pointer parked on one cannot chatter.
        if (shown && Number.isFinite(pointerX)) {
          const d = railDistance(
            pointerX,
            pointerY,
            marks.railRight,
            marks.railTop,
            marks.railBottom
          );
          if (!lensOn && d <= marks.reach) lensOn = true;
          else if (lensOn && d > marks.reach * RELEASE_RATIO) lensOn = false;

          const openAt = marks.reach * OPEN_RATIO;
          if (!openOn && d <= openAt) openOn = true;
          else if (openOn && d > openAt * RELEASE_RATIO) openOn = false;
        } else {
          lensOn = false;
          openOn = false;
        }

        const localY = lensOn ? pointerY - marks.railTop : null;
        if (openOn && localY !== null) {
          openIndex = bandIndex(localY, marks.pitch, n, marks.pitch / 2);
        }

        const target = localY !== null ? localY : (marks.local[focusIndex ?? active] ?? 0);
        // A live input is followed; a section change the reader did not ask for
        // glides in at a quarter of the speed.
        const tau = localY !== null || focusIndex !== null ? TAU_POINTER : TAU_SECTION;
        const dt = last === 0 ? 1 / 60 : Math.min((now - last) / 1000, 0.05);
        last = now;
        focusY += (target - focusY) * (1 - Math.exp(-dt / tau));
        if (Math.abs(target - focusY) < SNAP_EPSILON) focusY = target;
        lensSettled = focusY === target;

        /* ---- write phase ---- */

        for (let i = 0; i < n; i += 1) {
          const dot = dotRefs.current[i];
          if (!dot) continue;
          const scale = magnify(Math.abs(marks.local[i] - focusY), BASE, AMPLITUDE, SPREAD);
          const next = 'scale(' + Math.round(scale * 1000) / 1000 + ')';
          if (wroteDot[i] !== next) {
            wroteDot[i] = next;
            dot.style.transform = next;
          }
        }
      }

      const shownNext = shown ? 'true' : 'false';
      if (dock.dataset.shown !== shownNext) dock.dataset.shown = shownNext;

      for (let i = 0; i < n; i += 1) {
        const item = itemRefs.current[i];
        if (!item) continue;
        const activeNext = i === active ? 'true' : 'false';
        if (wroteActive[i] !== activeNext) {
          wroteActive[i] = activeNext;
          item.dataset.active = activeNext;
        }
        const openNext = i === openIndex ? 'true' : 'false';
        if (wroteOpen[i] !== openNext) {
          wroteOpen[i] = openNext;
          item.dataset.open = openNext;
        }
      }

      // The lens eases towards its target, so the loop has to keep running
      // until it arrives — including while the pointer sits still beside the
      // rail, which is exactly when nothing else would wake it.
      if (y !== lastY || !lensSettled) {
        lastY = y;
        wake();
      }
    }

    /* ---- the click lock ---- */

    const release = () => {
      clearTimeout(settleTimer);
      clearTimeout(capTimer);
      settleTimer = undefined;
      capTimer = undefined;
      if (locked === null) return;
      locked = null;
      observed = null; // re-derive rather than trust a callback from mid-flight
      wake();
    };

    const onScroll = () => {
      if (locked !== null) {
        clearTimeout(settleTimer);
        settleTimer = setTimeout(release, SCROLL_SETTLE_MS);
      }
      wake();
    };

    const onInterrupt = () => {
      if (locked !== null) release();
    };

    const onPointer = (e: Event) => {
      const pe = e as PointerEvent;
      // Hardware that reports hover can still be poked with a finger, and a tap
      // sends a pointermove first, so gate on the pointer and not the device.
      if (pe.pointerType !== 'mouse') {
        clearPointer();
        return;
      }
      pointerX = pe.clientX;
      pointerY = pe.clientY;
      wake();
    };

    const clearPointer = () => {
      if (!Number.isFinite(pointerX)) return;
      pointerX = Number.NaN;
      pointerY = Number.NaN;
      wake();
    };

    const onFocusIn = (e: Event) => {
      const index = itemRefs.current.indexOf(e.target as HTMLButtonElement);
      focusIndex = index >= 0 ? index : null;
      wake();
    };

    const onFocusOut = (e: Event) => {
      const next = (e as FocusEvent).relatedTarget as Node | null;
      if (next && dock.contains(next)) return;
      focusIndex = null;
      wake();
    };

    /* ---- wiring ---- */

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', invalidate);
    window.addEventListener('orientationchange', invalidate);
    window.addEventListener('blur', clearPointer);
    document.addEventListener('visibilitychange', clearPointer);
    window.addEventListener('wheel', onInterrupt, { passive: true });
    window.addEventListener('touchstart', onInterrupt, { passive: true });
    window.addEventListener('keydown', onInterrupt);
    dock.addEventListener('focusin', onFocusIn);
    dock.addEventListener('focusout', onFocusOut);

    if (!reduced) {
      // On the window, not the rail: the reach extends past the buttons, and
      // nothing outside them is allowed to become a hit target to hear about it.
      window.addEventListener('pointermove', onPointer, { passive: true });
    }

    // Cannot feed back: the dock is fixed and cannot alter the page's height.
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(invalidate);
      ro.observe(document.documentElement);
    }

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const index = links.findIndex((link) => link.id === entry.target.id);
            if (index < 0) continue;
            seen[index] = entry.isIntersecting;
          }
          const first = seen.indexOf(true);
          if (first >= 0) observed = first;
          wake();
        },
        { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
      );
      for (const link of links) {
        const el = document.getElementById(link.id);
        if (el) io.observe(el);
      }
    }

    if (document.readyState === 'complete') invalidate();
    else window.addEventListener('load', invalidate, { once: true });
    document.fonts?.ready?.then(() => {
      if (!disposed) invalidate();
    });

    // Measure and paint the correct state now, so a page opened deep or
    // refreshed mid-scroll arrives already docked rather than animating in.
    // data-immediate is what guarantees it: measure() calls getComputedStyle
    // for the dock tokens *before* tick() flips data-shown, and that resolution
    // is a before-change style every transition would otherwise run from.
    dock.dataset.immediate = 'true';
    measure();
    needsMeasure = false;
    tick(0);
    immediateRaf = requestAnimationFrame(() => {
      immediateRaf = 0;
      delete dock.dataset.immediate;
    });

    const lock = (index: number) => {
      locked = index;
      observed = null;
      clearTimeout(capTimer);
      capTimer = setTimeout(release, SCROLL_CAP_MS);
      clearTimeout(settleTimer);
      settleTimer = setTimeout(release, SCROLL_SETTLE_MS);
      wake();
    };
    lockRef.current = lock;

    return () => {
      disposed = true;
      lockRef.current = null;
      if (rafId !== 0) cancelAnimationFrame(rafId);
      if (immediateRaf !== 0) cancelAnimationFrame(immediateRaf);
      clearTimeout(settleTimer);
      clearTimeout(capTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', invalidate);
      window.removeEventListener('orientationchange', invalidate);
      window.removeEventListener('blur', clearPointer);
      document.removeEventListener('visibilitychange', clearPointer);
      window.removeEventListener('wheel', onInterrupt);
      window.removeEventListener('touchstart', onInterrupt);
      window.removeEventListener('keydown', onInterrupt);
      window.removeEventListener('load', invalidate);
      window.removeEventListener('pointermove', onPointer);
      dock.removeEventListener('focusin', onFocusIn);
      dock.removeEventListener('focusout', onFocusOut);
      ro?.disconnect();
      io?.disconnect();
    };
  }, [mounted, links]);

  if (!mounted || links.length === 0) return null;

  return (
    <nav
      ref={navRef}
      aria-label={label}
      data-shown="false"
      data-immediate="true"
      className="section-dock no-copy"
    >
      {links.map((link, i) => (
        <button
          key={link.id}
          type="button"
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          onClick={() => {
            lockRef.current?.(i);
            onNavigate(targetId(link));
          }}
          className="dock-item"
          data-open="false"
          style={
            {
              '--dock-d': steps[i].in,
              '--dock-d-out': steps[i].out,
            } as CSSProperties
          }
        >
          <span
            aria-hidden="true"
            className="dock-dot"
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
          />
          <span className="dock-label">
            <span>{link.label}</span>
          </span>
        </button>
      ))}
    </nav>
  );
}
