/**
 * The maths behind the section dock, kept out of the component so it can be
 * reasoned about and tested on its own — the same split as lib/panelMotion.ts.
 *
 * Everything here is a pure function of scroll position. That is the whole
 * design: the dock never animates *towards* a target, it is simply drawn at
 * whatever its progress value says. Reversal, a trackpad fling that crosses
 * every threshold in one frame, and a direction change halfway through all
 * fall out of that for free, with no second code path and no state to get
 * stuck in.
 */

/** Resting dot scale — 0.7 x --dock-dot. */
export const BASE = 0.7;
/** Added at the focus point — BASE + AMPLITUDE is the peak, 1.5 x --dock-dot. */
export const AMPLITUDE = 0.8;
/** Falloff distance in px along Y. Roughly 0.95 x --dock-pitch, so the lens
 *  reaches one neighbour on each side and no further. */
export const SPREAD = 38;

/**
 * Time constant for the focus-point easing, in seconds. 0.084 is the exact
 * continuous equivalent of a 0.18-per-frame lerp at 60Hz — written this way so
 * a 120Hz display feels the same as a 60Hz one instead of twice as fast.
 */
export const TAU = 0.084;

/**
 * How close the eased focus point has to get before it is snapped home. An
 * exponential approach never actually arrives, so without this the render loop
 * would never see itself settle and would never park. A quarter of a pixel of
 * focus error is far less than one rendered pixel of dot.
 */
export const SNAP_EPSILON = 0.25;

/** The morph, as fractions of the single progress value.
 *  0 -> MERGE_END      the items converge leftward and fall to centre
 *  MERGE_END -> SPLIT_START   the parked beat
 *  SPLIT_START -> 1    the bubble splits into the column */
export const MERGE_END = 0.45;
export const SPLIT_START = 0.62;

/** The overlay fades in over this much progress, starting once the real header
 *  has cleared the viewport (see OPACITY_LEAD in the component). */
export const OPACITY_SPAN = 0.1;

/** A section is current once its top passes this far down the viewport. */
export const ACTIVE_LINE = 0.45;

export function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** The single progress value: 0 at T1, 1 at T4. */
export function progress(scrollY: number, t1: number, span: number): number {
  if (!(span > 0)) return scrollY > t1 ? 1 : 0;
  return clamp01((scrollY - t1) / span);
}

/** Re-map a slice of the progress value back onto 0..1. */
export function subProgress(p: number, start: number, end: number): number {
  if (!(end > start)) return p >= end ? 1 : 0;
  return clamp01((p - start) / (end - start));
}

/**
 * scale = base + amplitude * exp(-(d / spread)^2)
 *
 * A gaussian rather than a tier table, so a bubble halfway between two others
 * is drawn halfway between their sizes and the column never steps.
 */
export function magnify(distance: number, base: number, amplitude: number, spread: number): number {
  if (!(spread > 0)) return base;
  return base + amplitude * Math.exp(-((distance / spread) ** 2));
}

/* --- The site's own easing curves, sampled in JS ---------------------------
 * --ease-out and --ease-panel already describe how this site moves. The morph
 * is driven from JS rather than CSS, so the curves have to be evaluated here
 * instead of named; these are the same two cubic-beziers, not new ones.
 */

function bezierAxis(p1: number, p2: number, s: number): number {
  const c = 3 * p1;
  const b = 3 * (p2 - p1) - c;
  const a = 1 - c - b;
  return ((a * s + b) * s + c) * s;
}

function bezierSlope(p1: number, p2: number, s: number): number {
  const c = 3 * p1;
  const b = 3 * (p2 - p1) - c;
  const a = 1 - c - b;
  return (3 * a * s + 2 * b) * s + c;
}

/**
 * A CSS cubic-bezier() as a plain function. Newton-Raphson on x, then read y —
 * with a bisection fallback for the flat stretches where the slope vanishes
 * (--ease-panel's first control point is 0.32,0.72, which is one of them).
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  return (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;

    let s = t;
    for (let i = 0; i < 8; i += 1) {
      const x = bezierAxis(x1, x2, s) - t;
      if (Math.abs(x) < 1e-6) return bezierAxis(y1, y2, s);
      const slope = bezierSlope(x1, x2, s);
      if (Math.abs(slope) < 1e-6) break;
      s -= x / slope;
    }

    let lo = 0;
    let hi = 1;
    s = t;
    for (let i = 0; i < 24; i += 1) {
      const x = bezierAxis(x1, x2, s);
      if (Math.abs(x - t) < 1e-6) break;
      if (x > t) hi = s;
      else lo = s;
      s = (lo + hi) / 2;
    }
    return bezierAxis(y1, y2, s);
  };
}

/** --ease-out: cubic-bezier(.2,.6,.2,1). Drives the leftward convergence. */
export const easeOut = cubicBezier(0.2, 0.6, 0.2, 1);

/** --ease-panel: cubic-bezier(.32,.72,0,1). Drives the fall and the split —
 *  it leaves immediately and decelerates, which is what keeps the descent from
 *  reading as a drop. */
export const easePanel = cubicBezier(0.32, 0.72, 0, 1);

export interface DockMetrics {
  /** Centre-to-centre spacing of the bubbles, px. */
  pitch: number;
  /** Nominal dot diameter before magnification, px. */
  dot: number;
  /** Width and height of a collapsed bubble's hit box, px. */
  hit: number;
}

/**
 * Read the dock's spatial tokens off an element, the way panelSpeed() reads
 * --panel-speed. Returns null when they are missing so the caller can bail
 * rather than write scale(NaN) into a transform — which is what happens under
 * vitest, where `css: false` means no custom property resolves at all.
 */
export function dockMetrics(el: Element): DockMetrics | null {
  const style = getComputedStyle(el);
  const pitch = Number.parseFloat(style.getPropertyValue('--dock-pitch'));
  const dot = Number.parseFloat(style.getPropertyValue('--dock-dot'));
  const hit = Number.parseFloat(style.getPropertyValue('--dock-hit'));
  if (!Number.isFinite(pitch) || pitch <= 0) return null;
  if (!Number.isFinite(dot) || dot <= 0) return null;
  if (!Number.isFinite(hit) || hit <= 0) return null;
  return { pitch, dot, hit };
}
