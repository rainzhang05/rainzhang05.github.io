/**
 * Every disclosure panel holds a different amount of content — an experience
 * entry is around 600px tall, the MNT project over 1200 — so a single duration
 * makes the tall ones move at twice the speed of the short ones. These panels
 * are given one speed instead: the duration follows the distance, which is
 * what makes them feel alike.
 *
 * The speed itself is a token (`--panel-speed`, pixels per second) so it stays
 * in globals.css with the rest of the motion values.
 */

/** Below this a panel would blink rather than open, however short it is. */
export const MIN_PANEL_MS = 240;

export function panelDurationMs(height: number, pxPerSecond: number): number {
  if (!(height > 0) || !(pxPerSecond > 0)) return MIN_PANEL_MS;
  return Math.max(MIN_PANEL_MS, Math.round((height / pxPerSecond) * 1000));
}

/** Reads `--panel-speed` off the element, or null when it is not set. */
export function panelSpeed(el: Element): number | null {
  const raw = getComputedStyle(el).getPropertyValue('--panel-speed');
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) && value > 0 ? value : null;
}
