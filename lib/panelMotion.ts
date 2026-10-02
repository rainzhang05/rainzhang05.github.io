/**
 * Every disclosure panel holds a different amount of content — an experience
 * entry is around 600px tall, the MNT project nearly 1200 — and every one of
 * them has to move at exactly the same speed.
 *
 * Giving each panel a duration in proportion to its height is not enough. That
 * stretches one easing curve over a longer time, and stretching a curve
 * stretches its shape: the tall panel takes twice as long to get up to speed
 * and twice as long to settle, so in the part of the motion anyone can see —
 * the first few hundred pixels under the row — it is visibly the slower one.
 * Only the average speed matched.
 *
 * So every panel follows one motion, defined in pixels and milliseconds rather
 * than as a fraction of its own duration: it moves off at the cruise speed at
 * once, glides at that speed, and then decelerates over the same settle as
 * every other panel. A panel of height H rides the last H pixels of that one
 * motion — a taller panel simply glides for longer before the shared settle,
 * and a panel shorter than the settle itself joins it part-way through. Any
 * two panels are therefore at the same speed at every moment of the settle,
 * and at the same speed throughout the glide, whatever they hold.
 *
 * The curve is handed to CSS as a `linear()` easing, which is a list of points
 * the browser joins with straight lines, so the transition stays in CSS and
 * reverses itself when interrupted, exactly as before. The cruise is one
 * straight line and needs two points; the settle is sampled.
 *
 * The speed and the settle are tokens (`--panel-speed`, `--panel-settle`) so
 * they stay in globals.css with the rest of the motion values.
 */

/**
 * The settle's shape: speed falls as the cube of the time left, so the
 * remaining distance falls as its fourth power. That is the long, soft landing
 * the panels have always had, and it starts at exactly the cruise speed, so
 * there is no seam between the glide and the settle.
 */
const SETTLE_POWER = 4;

/** Points sampled along the settle: one per frame or better at 60Hz. */
const SETTLE_SAMPLES = 24;

export interface PanelMotion {
  /** The transition's duration, in milliseconds. */
  durationMs: number;
  /** A CSS `linear()` easing that maps that duration onto the shared motion. */
  easing: string;
}

/** How far the settle carries a panel: where it starts, the panel is at cruise speed. */
export function settleDistance(pxPerSecond: number, settleMs: number): number {
  return (pxPerSecond * settleMs) / 1000 / SETTLE_POWER;
}

/**
 * The duration and easing that move a panel of `height` pixels along the
 * shared motion. Null when there is nothing sensible to compute, so the CSS
 * fallback stands.
 */
export function panelMotion(
  height: number,
  pxPerSecond: number,
  settleMs: number
): PanelMotion | null {
  if (!(height > 0) || !(pxPerSecond > 0) || !(settleMs > 0)) return null;

  const fullSettle = settleDistance(pxPerSecond, settleMs);
  const cruise = Math.max(0, height - fullSettle);
  const settle = height - cruise;

  // Where on the shared settle this panel joins it: at the start for any panel
  // taller than the settle, part-way through for one shorter than it.
  const joinAt = 1 - Math.pow(settle / fullSettle, 1 / SETTLE_POWER);
  const cruiseMs = (cruise / pxPerSecond) * 1000;
  const settleTakesMs = settleMs * (1 - joinAt);
  const durationMs = cruiseMs + settleTakesMs;

  const stops: string[] = ['0 0%'];
  if (cruise > 0) stops.push(stop(cruise / height, cruiseMs / durationMs));
  for (let i = 1; i <= SETTLE_SAMPLES; i++) {
    const u = joinAt + ((1 - joinAt) * i) / SETTLE_SAMPLES;
    const left = fullSettle * Math.pow(1 - u, SETTLE_POWER);
    stops.push(stop(1 - left / height, (cruiseMs + settleMs * (u - joinAt)) / durationMs));
  }

  // A tenth of a millisecond, so rounding cannot put two panels out of step.
  return { durationMs: round(durationMs, 1), easing: 'linear(' + stops.join(', ') + ')' };
}

function stop(progress: number, at: number): string {
  return round(progress, 5) + ' ' + round(at * 100, 3) + '%';
}

function round(value: number, places: number): number {
  const scale = 10 ** places;
  return Math.round(value * scale) / scale;
}

/**
 * Whether this browser understands a `linear()` easing. Where it does not, the
 * panel keeps the duration and falls back to --ease-panel: an easing the
 * browser cannot parse would void the whole `transition` declaration, and the
 * panel would snap open with no motion at all.
 */
export function supportsLinearEasing(): boolean {
  return (
    typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    CSS.supports('transition-timing-function', 'linear(0, 1)')
  );
}

/** The two panel tokens, read off the element, or null when either is missing. */
export function panelTokens(el: Element): { speed: number; settleMs: number } | null {
  const style = getComputedStyle(el);
  const speed = Number.parseFloat(style.getPropertyValue('--panel-speed'));
  const settleMs = parseMs(style.getPropertyValue('--panel-settle'));
  if (!(Number.isFinite(speed) && speed > 0)) return null;
  if (settleMs === null) return null;
  return { speed, settleMs };
}

/** A CSS time — `400ms` or `0.4s` — in milliseconds. */
function parseMs(raw: string): number | null {
  const value = raw.trim();
  const n = Number.parseFloat(value);
  if (!(Number.isFinite(n) && n > 0)) return null;
  if (value.endsWith('ms')) return n;
  if (value.endsWith('s')) return n * 1000;
  return null;
}
