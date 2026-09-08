import { describe, expect, it } from 'vitest';
import { MIN_PANEL_MS, panelDurationMs, panelSpeed } from '@/lib/panelMotion';

describe('panelDurationMs', () => {
  it('gives a taller panel proportionally longer, so both move at one speed', () => {
    const short = panelDurationMs(600, 2000);
    const tall = panelDurationMs(1200, 2000);

    expect(short).toBe(300);
    expect(tall).toBe(600);
    expect(tall / short).toBe(2);
  });

  it('holds one speed across every real panel height on the page', () => {
    const heights = [597, 606, 624, 786, 854, 1072, 1258];
    const speeds = heights.map((h) => Math.round(h / (panelDurationMs(h, 2000) / 1000)));

    // Rounding to whole milliseconds is the only source of drift.
    speeds.forEach((s) => expect(Math.abs(s - 2000)).toBeLessThanOrEqual(5));
  });

  it('will not let a very short panel blink open', () => {
    expect(panelDurationMs(40, 2000)).toBe(MIN_PANEL_MS);
  });

  it('falls back rather than dividing by nothing', () => {
    expect(panelDurationMs(0, 2000)).toBe(MIN_PANEL_MS);
    expect(panelDurationMs(600, 0)).toBe(MIN_PANEL_MS);
    expect(panelDurationMs(Number.NaN, 2000)).toBe(MIN_PANEL_MS);
  });
});

describe('panelSpeed', () => {
  const el = (value: string) =>
    ({ style: { getPropertyValue: () => value } }) as unknown as Element;

  it('reads the token off the element', () => {
    const original = globalThis.getComputedStyle;
    globalThis.getComputedStyle = (() => ({ getPropertyValue: () => ' 2000 ' })) as never;

    expect(panelSpeed(el('2000'))).toBe(2000);

    globalThis.getComputedStyle = original;
  });

  it('reports nothing when the token is missing, so the CSS fallback stands', () => {
    const original = globalThis.getComputedStyle;
    globalThis.getComputedStyle = (() => ({ getPropertyValue: () => '' })) as never;

    expect(panelSpeed(el(''))).toBeNull();

    globalThis.getComputedStyle = original;
  });
});

/**
 * The point of a speed rather than a duration: every row moves at the same
 * rate whatever it holds, and only the time taken differs.
 */
describe('one speed across every panel', () => {
  const speed = 1400;
  // Real content heights, measured in the browser: the two experience entries,
  // the four selected-work panels, and the three other-work ones.
  const heights = [606, 597, 1258, 1072, 786, 624, 624, 854];

  it('gives every panel the same pixels per second', () => {
    const rates = heights.map((h) => h / (panelDurationMs(h, speed) / 1000));

    // Rounding the duration to whole milliseconds is the only thing that can
    // separate them, and it is worth a tenth of a percent.
    for (const rate of rates) expect(Math.abs(rate - speed) / speed).toBeLessThan(0.005);
  });

  it('lets the time taken follow the content, which is the whole idea', () => {
    const shortest = panelDurationMs(Math.min(...heights), speed);
    const tallest = panelDurationMs(Math.max(...heights), speed);

    expect(shortest).toBeLessThan(tallest);
    expect(tallest / shortest).toBeCloseTo(Math.max(...heights) / Math.min(...heights), 1);
  });

  it('keeps every one of them clear of the floor, so none is capped', () => {
    for (const h of heights) expect(panelDurationMs(h, speed)).toBeGreaterThan(MIN_PANEL_MS);
  });
});
