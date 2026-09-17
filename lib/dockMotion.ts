/**
 * The maths behind the section dock, kept out of the component so it can be
 * reasoned about and tested on its own — the same split as lib/panelMotion.ts.
 *
 * Nothing here is a function of scroll position. The dock's entrance is CSS:
 * crossing the threshold flips one attribute and the transitions in
 * globals.css do the rest, so reversal is whatever an interrupted transition
 * naturally does. What is left in JavaScript is the magnifying lens, which has
 * to follow a pointer, and the geometry that decides what the pointer is near.
 */

/** Resting dot scale — 0.7 x --dock-dot. */
export const BASE = 0.7;
/** Added at the focus point — BASE + AMPLITUDE is the peak, 1.5 x --dock-dot. */
export const AMPLITUDE = 0.8;
/** Falloff distance in px along Y. Roughly 0.95 x --dock-pitch, so the lens
 *  reaches one neighbour on each side and no further. Retuning --dock-pitch
 *  means retuning this. */
export const SPREAD = 38;

/**
 * Time constant, in seconds, for the lens following a live input — the pointer,
 * or the keyboard focus ring. 0.084 is the exact continuous equivalent of an
 * 0.18-per-frame lerp at 60Hz, so a 120Hz display feels the same rather than
 * twice as fast.
 */
export const TAU_POINTER = 0.084;

/**
 * Time constant for the lens gliding to a new section with nothing pointing at
 * it — the one move the reader did not ask for, and the only one that gets the
 * slow constant. 0.32s is --duration-slow expressed as a time constant, so the
 * glide has the same characteristic time as the fill that accompanies it. It
 * drops the first frame of a one-pitch jump from 7.2px to 2.0px, which is what
 * "smoother" means here: under about 2px per frame, a scale change on a 10px
 * dot stops being resolvable frame to frame.
 */
export const TAU_SECTION = 0.32;

/**
 * How close the eased focus point has to get before it is snapped home. An
 * exponential approach never actually arrives, so without this the render loop
 * would never see itself settle and would never park.
 */
export const SNAP_EPSILON = 0.25;

/** A section is current once its top passes this far down the viewport. */
export const ACTIVE_LINE = 0.45;

/** The label commits at 80% of the lens reach, so the column stirs before a
 *  word appears. */
export const OPEN_RATIO = 0.8;

/** Every boundary is released 20% further out than it engaged, so a pointer
 *  parked on one cannot chatter the lens between the cursor and the section. */
export const RELEASE_RATIO = 1.2;

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

/**
 * How far past the rail's ends a pointer that already woke the lens may stray
 * before the column lets go, in px. The band engages on the rail's exact edge:
 * above the first bubble and below the last there is nothing to magnify, so a
 * pointer there is in empty gutter and the dock owes it no answer. Releasing on
 * that same pixel, though, would let a pointer parked on the edge chatter the
 * lens on and off, so it is given a few px of overshoot — wider than any
 * pointer jitter, far narrower than a bubble.
 */
export const BAND_SLACK = 4;

/**
 * Distance from a pointer to the collapsed rail, in px, or Infinity when the
 * pointer is not beside the rail at all.
 *
 * The rail runs from the left edge of the viewport to `right` and spans
 * `top`..`bottom`, so there is no left side to be outside of: only how far
 * right of it the pointer is. Past either end the distance is not measured but
 * refused. The lens has no bubble to aim at up there — the gutter above the
 * first bubble and below the last is empty — and a pointer that is merely near
 * the column's corner is looking at the page, not at the dock. Anywhere inside
 * the rail's own box this is 0, which is why :hover is a strict subset of
 * proximity rather than a parallel path.
 *
 * `slack` extends the ends for a pointer the caller has already engaged; see
 * BAND_SLACK.
 */
export function railDistance(
  x: number,
  y: number,
  right: number,
  top: number,
  bottom: number,
  slack: number
): number {
  if (y < top - slack || y > bottom + slack) return Number.POSITIVE_INFINITY;
  return x > right ? x - right : 0;
}

/**
 * Which bubble sits at a rail-local y, or -1 past either end. The bands are the
 * buttons' own boxes and tile the column exactly, so exactly one bubble is ever
 * open and there is no seam between two. `slack` keeps the end bubbles open for
 * a little overshoot, matching the way the lens still inflates them when the
 * pointer is just past the column.
 */
export function bandIndex(localY: number, pitch: number, count: number, slack: number): number {
  if (!(pitch > 0) || count <= 0) return -1;
  if (localY < -slack || localY > count * pitch + slack) return -1;
  const i = Math.floor(localY / pitch);
  return i < 0 ? 0 : i >= count ? count - 1 : i;
}

export interface DockMetrics {
  /** Centre-to-centre spacing of the bubbles, px. Also the button's height. */
  pitch: number;
  /** Nominal dot diameter before magnification, px. */
  dot: number;
  /** Width of a collapsed bubble's hit box, px. */
  hit: number;
  /** The rail's own padding-left, so the proximity maths and the stylesheet
   *  cannot disagree about where the rail's right edge is — and so the token
   *  step at 1176px needs no second source of truth in JavaScript. */
  inset: number;
  /** Maximum pointer reach right of the rail, px. The caller clamps it to the
   *  gutter that actually exists. */
  reach: number;
}

/**
 * Read the dock's spatial tokens off an element, the way panelSpeed() reads
 * --panel-speed. Returns null when any of them is missing so the caller can
 * bail rather than write scale(NaN) into a transform — which is what happens
 * under vitest, where `css: false` means no custom property resolves at all.
 */
export function dockMetrics(el: Element): DockMetrics | null {
  const style = getComputedStyle(el);
  const pitch = Number.parseFloat(style.getPropertyValue('--dock-pitch'));
  const dot = Number.parseFloat(style.getPropertyValue('--dock-dot'));
  const hit = Number.parseFloat(style.getPropertyValue('--dock-hit'));
  const inset = Number.parseFloat(style.getPropertyValue('--dock-inset'));
  const reach = Number.parseFloat(style.getPropertyValue('--dock-reach'));
  if (!Number.isFinite(pitch) || pitch <= 0) return null;
  if (!Number.isFinite(dot) || dot <= 0) return null;
  if (!Number.isFinite(hit) || hit <= 0) return null;
  if (!Number.isFinite(inset) || inset < 0) return null;
  if (!Number.isFinite(reach) || reach < 0) return null;
  return { pitch, dot, hit, inset, reach };
}
