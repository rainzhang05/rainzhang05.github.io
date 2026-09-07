'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ACTIVE_LINE,
  AMPLITUDE,
  BASE,
  MERGE_END,
  OPACITY_SPAN,
  SNAP_EPSILON,
  SPLIT_START,
  SPREAD,
  TAU,
  clamp01,
  dockMetrics,
  easeOut,
  easePanel,
  lerp,
  magnify,
  progress,
  subProgress,
} from '@/lib/dockMotion';
import { prefersReducedMotion } from '@/lib/useReducedMotion';
import type { NavLink } from '@/lib/types';

/** Shortest morph worth playing; below this the dock simply appears. */
const MIN_SPAN = 240;
/** Longest morph, as a fraction of the viewport, so a tall intro cannot stretch it. */
const MAX_SPAN_RATIO = 1.2;
/** The dock appears this far past T1 and leaves again 6px earlier — enough that
 *  a wheel notch or a hover near the edge cannot flicker it. */
const SHOW_AT = 8;
const HIDE_AT = 2;
/** The rail's own padding. With a 32px hit box this puts the dot's centre at
 *  28px and its box at 12-44px, inside the page's 48px padding at every width
 *  the dock renders at. */
const DOT_INSET = 12;
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

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface Landmarks {
  ready: boolean;
  /** documentElement.clientHeight at the last measure. Cached so the frame
   *  loop never reads layout. */
  viewport: number;
  /** Enough page left that the formed dock is somewhere a reader can sit,
   *  rather than a state that exists for the last few pixels of scroll. */
  enabled: boolean;
  t1: number;
  span: number;
  opacityLead: number;
  pitch: number;
  /** Viewport y of each resting bubble's centre. */
  centres: number[];
  /** Rail-local y of each resting bubble's centre, for the pointer lens. */
  local: number[];
  navTop: number;
  headerX: number[];
  headerY: number[];
  mergedY: number[];
  tops: number[];
  maxScroll: number;
}

const EMPTY: Landmarks = {
  ready: false,
  viewport: 0,
  enabled: false,
  t1: 0,
  span: 0,
  opacityLead: 0,
  pitch: 0,
  centres: [],
  local: [],
  navTop: 0,
  headerX: [],
  headerY: [],
  mergedY: [],
  tops: [],
  maxScroll: 0,
};

/**
 * The top bar, past the first screen: its items converge leftward, merge into
 * one bubble, fall to the middle of the left edge and split into a column.
 *
 * Every drawn value is a pure function of window.scrollY. Nothing integrates
 * and nothing animates towards a target, so scrolling back up retraces the way
 * down through the same code, a trackpad fling that crosses every threshold in
 * one frame lands in the right final state, and there is no half-finished
 * state to get stuck in. The one exception is the magnifier's focus point,
 * which eases — and it eases on a time constant rather than a per-frame
 * fraction, so 120Hz feels the same as 60Hz.
 *
 * Below 640px this never renders: the gate is a media query in globals.css,
 * not a width read here, so nothing about it depends on hydration.
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
    let needsMeasure = true;
    let last = 0;
    let lastY = Number.NaN;
    let marks: Landmarks = EMPTY;

    let focusY = 0;
    let lensTarget = 0;
    let seeded = false;
    let hoverY: number | null = null;
    let focusIndex: number | null = null;
    let observed: number | null = null;
    let locked: number | null = null;
    let shown = false;
    const wroteItem: string[] = links.map(() => '');
    const wroteDot: string[] = links.map(() => '');

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
      const metrics = dockMetrics(nav as Element);
      const header = document.querySelector('header');
      const first = document.getElementById(links[0].id);

      if (!metrics || !header || !first || viewport <= 0) {
        marks = EMPTY;
        return;
      }

      const { pitch } = metrics;
      const headerEl = header as HTMLElement;
      const padTop = Number.parseFloat(getComputedStyle(headerEl).paddingTop) || 0;
      const t1 = offsetTop(headerEl) + padTop;
      const headerBottom = offsetTop(headerEl) + headerEl.offsetHeight;
      const headerMid = t1 + (headerEl.offsetHeight - padTop) / 2;

      const gap = Number.parseFloat(getComputedStyle(first).paddingTop) || 0;
      const t4 = offsetTop(first) - gap;
      const span = Math.min(Math.max(t4 - t1, MIN_SPAN), MAX_SPAN_RATIO * viewport);

      const column = n * pitch;
      const navTop = viewport / 2 - column / 2;
      const local = links.map((_, i) => (i + 0.5) * pitch);
      const centres = local.map((y) => navTop + y);
      const mergedY = centres.map((y) => viewport / 2 - y);
      const headerY = centres.map((y) => headerMid - t1 - y);

      // Where each item sat in the top bar. Background has no header link, so
      // it starts between its neighbours rather than borrowing Resume's slot.
      const restX = DOT_INSET + metrics.hit / 2;
      const raw: (number | null)[] = links.map((link) => {
        const a = headerEl.querySelector<HTMLElement>('nav a[href="' + link.href + '"]');
        if (!a) return null;
        const r = a.getBoundingClientRect();
        return r.width > 0 ? r.left + r.width / 2 : null;
      });
      const fallback = headerEl.getBoundingClientRect();
      const mid = fallback.width > 0 ? fallback.left + fallback.width / 2 : restX;
      const headerX = raw.map((x, i) => {
        if (x !== null) return x - restX;
        const before = raw
          .slice(0, i)
          .filter((v): v is number => v !== null)
          .pop();
        const after = raw.slice(i + 1).find((v): v is number => v !== null);
        if (before !== undefined && after !== undefined) return (before + after) / 2 - restX;
        return (before ?? after ?? mid) - restX;
      });

      const maxScroll = Math.max(0, doc.scrollHeight - doc.clientHeight);

      marks = {
        ready: true,
        viewport,
        enabled: maxScroll >= t1 + span + viewport / 2,
        t1,
        span,
        opacityLead: span > 0 ? (headerBottom - t1) / span : 0,
        pitch,
        centres,
        local,
        navTop,
        headerX,
        headerY,
        mergedY,
        tops: links.map((link) => {
          const el = document.getElementById(link.id);
          return el ? offsetTop(el) : Number.POSITIVE_INFINITY;
        }),
        maxScroll,
      };

      if (!seeded) {
        focusY = marks.local[0] ?? 0;
        lensTarget = focusY;
        seeded = true;
      }
    }

    /** Where the page says we are, from the same cached numbers the dock draws
     *  from. The observer below is what actually drives this in a browser; this
     *  is the answer before its first callback, and under happy-dom, whose
     *  IntersectionObserver is a constructible no-op that never fires. */
    function activeFromTops(y: number): number {
      const line = y + marks.viewport * ACTIVE_LINE;
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
      const enabled = marks.enabled;

      // Hysteresis, and a latch so the rail can never be display:none'd out
      // from under the keyboard.
      const holdsFocus = dock.contains(document.activeElement);
      if (!shown && enabled && y >= marks.t1 + SHOW_AT) shown = true;
      else if (shown && !holdsFocus && (!enabled || y <= marks.t1 + HIDE_AT)) shown = false;
      if (!shown) hoverY = null;

      const p = progress(y, marks.t1, marks.span);
      const eMerge = easeOut(subProgress(p, 0, MERGE_END));
      const eMergeY = easePanel(subProgress(p, 0, MERGE_END));
      const eSplit = easePanel(subProgress(p, SPLIT_START, 1));

      let active = locked ?? observed ?? activeFromTops(y);
      if (locked === null && y >= marks.maxScroll - 2) active = n - 1;

      if (!reduced) {
        const dt = last === 0 ? 1 / 60 : Math.min((now - last) / 1000, 0.05);
        last = now;
        lensTarget = hoverY !== null ? hoverY : (marks.local[focusIndex ?? active] ?? 0);
        focusY += (lensTarget - focusY) * (1 - Math.exp(-dt / TAU));
        if (Math.abs(lensTarget - focusY) < SNAP_EPSILON) focusY = lensTarget;
      }

      /* ---- write phase ---- */

      dock.dataset.shown = shown ? 'true' : 'false';
      dock.style.opacity = reduced
        ? '1'
        : String(Math.round(clamp01((p - marks.opacityLead) / OPACITY_SPAN) * 1000) / 1000);

      for (let i = 0; i < n; i += 1) {
        const item = itemRefs.current[i];
        const dot = dotRefs.current[i];
        if (item) {
          const state = i === active ? 'true' : 'false';
          if (item.dataset.active !== state) item.dataset.active = state;
        }
        if (reduced || !item || !dot) continue;

        const dx = lerp(lerp(marks.headerX[i], 0, eMerge), 0, eSplit);
        const dy = lerp(lerp(marks.headerY[i], marks.mergedY[i], eMergeY), 0, eSplit);
        const next =
          'translate3d(' + Math.round(dx * 2) / 2 + 'px,' + Math.round(dy * 2) / 2 + 'px,0)';
        if (wroteItem[i] !== next) {
          wroteItem[i] = next;
          item.style.transform = next;
        }

        const scale = magnify(Math.abs(marks.local[i] - focusY), BASE, AMPLITUDE * eSplit, SPREAD);
        const dotNext = 'scale(' + Math.round(scale * 1000) / 1000 + ')';
        if (wroteDot[i] !== dotNext) {
          wroteDot[i] = dotNext;
          dot.style.transform = dotNext;
        }
      }

      if (y !== lastY || (!reduced && focusY !== lensTarget)) {
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
        hoverY = null;
        return;
      }
      if (!shown) return;
      hoverY = pe.clientY - marks.navTop;
      wake();
    };

    const clearHover = () => {
      if (hoverY === null) return;
      hoverY = null;
      wake();
    };

    const onFocusIn = (e: Event) => {
      const index = itemRefs.current.indexOf(e.target as HTMLButtonElement);
      focusIndex = index >= 0 ? index : null;
      wake();
    };

    const onFocusOut = (e: Event) => {
      const next = (e as FocusEvent).relatedTarget as Node | null;
      if (next && nav.contains(next)) return;
      focusIndex = null;
      wake();
    };

    /* ---- wiring ---- */

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', invalidate);
    window.addEventListener('orientationchange', invalidate);
    window.addEventListener('blur', clearHover);
    document.addEventListener('visibilitychange', clearHover);
    window.addEventListener('wheel', onInterrupt, { passive: true });
    window.addEventListener('touchstart', onInterrupt, { passive: true });
    window.addEventListener('keydown', onInterrupt);
    nav.addEventListener('focusin', onFocusIn);
    nav.addEventListener('focusout', onFocusOut);

    if (!reduced) {
      nav.addEventListener('pointermove', onPointer, { passive: true });
      nav.addEventListener('pointerleave', clearHover);
      nav.addEventListener('pointercancel', clearHover);
    }

    // Cannot feed back: the dock is fixed and cannot change the page's height.
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
    measure();
    needsMeasure = false;
    tick(0);

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
      clearTimeout(settleTimer);
      clearTimeout(capTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', invalidate);
      window.removeEventListener('orientationchange', invalidate);
      window.removeEventListener('blur', clearHover);
      document.removeEventListener('visibilitychange', clearHover);
      window.removeEventListener('wheel', onInterrupt);
      window.removeEventListener('touchstart', onInterrupt);
      window.removeEventListener('keydown', onInterrupt);
      window.removeEventListener('load', invalidate);
      nav.removeEventListener('focusin', onFocusIn);
      nav.removeEventListener('focusout', onFocusOut);
      nav.removeEventListener('pointermove', onPointer);
      nav.removeEventListener('pointerleave', clearHover);
      nav.removeEventListener('pointercancel', clearHover);
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
      className="section-dock no-copy"
      style={{ opacity: 0, paddingLeft: DOT_INSET }}
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
            onNavigate(link.id);
          }}
          className="dock-item"
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
