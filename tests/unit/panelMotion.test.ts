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
