import { afterEach, describe, expect, it } from 'vitest';
import {
  panelMotion,
  panelTimeAt,
  panelTokens,
  settleDistance,
  supportsLinearEasing,
  unseenCloseMs,
  type PanelMotion,
} from '@/lib/panelMotion';

const SPEED = 2800;
const SETTLE = 400;
const FULL_SETTLE = settleDistance(SPEED, SETTLE);

// Real content heights, measured in the browser at 1024px: the two experience
// entries and the six projects.
const HEIGHTS = [597, 653, 1183, 670, 1137, 781, 702, 849];

/** Where a panel is, in pixels, `t` ms after it starts — read off its linear() easing. */
function travelled(motion: PanelMotion, height: number, t: number): number {
  const stops = motion.easing
    .slice('linear('.length, -1)
    .split(', ')
    .map((s) => {
      const [progress, at] = s.split(' ');
      return { x: Number.parseFloat(at) / 100, y: Number(progress) };
    });
  const x = Math.min(1, Math.max(0, t / motion.durationMs));
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1];
    const b = stops[i];
    if (x <= b.x) return (a.y + ((b.y - a.y) * (x - a.x)) / (b.x - a.x || 1)) * height;
  }
  return height;
}

/** The one motion every panel shares: the distance still to go, `left` ms from the end. */
function stillToGo(left: number): number {
  if (left >= SETTLE) return FULL_SETTLE + (SPEED * (left - SETTLE)) / 1000;
  return FULL_SETTLE * (left / SETTLE) ** 4;
}

const motionFor = (h: number) => panelMotion(h, SPEED, SETTLE)!;

/**
 * The point of the whole module: two panels of different heights are at the
 * same speed at every moment, not merely on average. A duration in proportion
 * to height matched only the average — it stretched the easing, so a tall
 * panel got up to speed and came to rest twice as slowly as a short one.
 */
describe('one motion across every panel', () => {
  it('moves every panel off at the cruise speed at once', () => {
    for (const h of HEIGHTS) {
      const motion = motionFor(h);
      // 50ms is inside every panel's glide: the shortest settles from 113ms.
      expect(travelled(motion, h, 50)).toBeCloseTo((SPEED * 50) / 1000, 1);
      expect(travelled(motion, h, 16)).toBeCloseTo((SPEED * 16) / 1000, 1);
    }
  });

  it('brings every panel to rest along the same settle', () => {
    for (const h of HEIGHTS) {
      const motion = motionFor(h);
      for (const left of [0, 25, 50, 100, 150, 200, 300, 400]) {
        const position = travelled(motion, h, motion.durationMs - left);
        // Within a pixel: the settle is drawn as straight lines between samples.
        expect(Math.abs(h - position - stillToGo(left))).toBeLessThan(1);
      }
    }
  });

  it('puts the shortest and the tallest row in the same place after the same time', () => {
    const short = motionFor(597);
    const tall = motionFor(1183);

    expect(travelled(short, 597, 100)).toBeCloseTo(travelled(tall, 1183, 100), 1);
  });

  it('lets a taller panel glide for longer, and nothing else', () => {
    const short = motionFor(597);
    const tall = motionFor(1183);

    // The extra time is exactly the extra distance at the cruise speed.
    expect(tall.durationMs - short.durationMs).toBeCloseTo(((1183 - 597) / SPEED) * 1000, 0);
  });

  it('lets a panel shorter than the settle join it part-way, so it still lands alike', () => {
    const h = 120;
    const motion = motionFor(h);

    expect(h).toBeLessThan(FULL_SETTLE);
    expect(motion.durationMs).toBeLessThan(SETTLE);
    for (const left of [0, 50, 100, 150, 200]) {
      if (left > motion.durationMs) continue;
      const position = travelled(motion, h, motion.durationMs - left);
      expect(Math.abs(h - position - stillToGo(left))).toBeLessThan(1);
    }
  });

  it('cannot blink a tiny panel open: it rides the slow end of the settle', () => {
    expect(motionFor(20).durationMs).toBeGreaterThan(SETTLE / 2);
  });
});

describe('panelTimeAt', () => {
  it('reads the curve the other way: the time at which a panel has come so far', () => {
    for (const h of [120, 597, 1183]) {
      const motion = motionFor(h);
      for (const fraction of [0, 0.1, 0.5, 0.8, 0.95, 1]) {
        const t = panelTimeAt(h, h * fraction, SPEED, SETTLE);
        expect(Math.abs(travelled(motion, h, t) - h * fraction)).toBeLessThan(1);
      }
    }
  });

  it('ends where the motion ends', () => {
    expect(panelTimeAt(1183, 1183, SPEED, SETTLE)).toBeCloseTo(motionFor(1183).durationMs, 0);
  });
});

/**
 * A close is wound forward past whatever happens below the fold, so a tall
 * panel shut from the top of the screen moves something visible on its first
 * frame, exactly as a short one does.
 */
describe('unseenCloseMs', () => {
  const VIEWPORT = 800;

  it('skips nothing when the panel ends on screen', () => {
    expect(unseenCloseMs(597, 150, VIEWPORT, SPEED, SETTLE)).toBe(0);
  });

  it('skips the travel below the fold, leaving the edge at the fold', () => {
    const h = 1183;
    const top = 250;
    const skip = unseenCloseMs(h, top, VIEWPORT, SPEED, SETTLE);
    // Closing, progress runs from the bottom edge upward: after the skip the
    // edge has risen exactly as far as it started below the fold.
    expect(travelled(motionFor(h), h, skip)).toBeCloseTo(top + h - VIEWPORT, 0);
  });

  it('leaves exactly the close a panel the height of the visible part would have', () => {
    const h = 1183;
    const top = 250;
    const visible = VIEWPORT - top;
    const left = motionFor(h).durationMs - unseenCloseMs(h, top, VIEWPORT, SPEED, SETTLE);

    expect(left).toBeCloseTo(motionFor(visible).durationMs, 0);
  });

  it('skips the whole close of a panel that is entirely below the fold', () => {
    expect(unseenCloseMs(700, 900, VIEWPORT, SPEED, SETTLE)).toBeCloseTo(
      motionFor(700).durationMs,
      0
    );
  });
});

describe('panelMotion', () => {
  it('writes a well-formed linear() easing that never runs backwards', () => {
    const { easing } = motionFor(849);

    expect(easing.startsWith('linear(0 0%, ')).toBe(true);
    expect(easing.endsWith(', 1 100%)')).toBe(true);

    const stops = easing
      .slice('linear('.length, -1)
      .split(', ')
      .map((s) => s.split(' ').map((n) => Number.parseFloat(n)));
    for (let i = 1; i < stops.length; i++) {
      expect(stops[i][0]).toBeGreaterThanOrEqual(stops[i - 1][0]);
      expect(stops[i][1]).toBeGreaterThan(stops[i - 1][1]);
    }
  });

  it('reports nothing it cannot compute, so the CSS fallback stands', () => {
    expect(panelMotion(0, SPEED, SETTLE)).toBeNull();
    expect(panelMotion(Number.NaN, SPEED, SETTLE)).toBeNull();
    expect(panelMotion(600, 0, SETTLE)).toBeNull();
    expect(panelMotion(600, SPEED, 0)).toBeNull();
  });
});

describe('panelTokens', () => {
  const original = globalThis.getComputedStyle;
  afterEach(() => {
    globalThis.getComputedStyle = original;
  });

  const tokens = (values: Record<string, string>) => {
    globalThis.getComputedStyle = (() => ({
      getPropertyValue: (name: string) => values[name] ?? '',
    })) as never;
    return panelTokens({} as Element);
  };

  it('reads the speed and the settle off the element', () => {
    expect(tokens({ '--panel-speed': ' 2800', '--panel-settle': ' 400ms' })).toEqual({
      speed: 2800,
      settleMs: 400,
    });
  });

  it('reads a settle written in seconds', () => {
    expect(tokens({ '--panel-speed': '2800', '--panel-settle': '0.4s' })?.settleMs).toBe(400);
  });

  it('reports nothing when either token is missing', () => {
    expect(tokens({ '--panel-settle': '400ms' })).toBeNull();
    expect(tokens({ '--panel-speed': '2800' })).toBeNull();
    expect(tokens({ '--panel-speed': '2800', '--panel-settle': '400' })).toBeNull();
  });
});

describe('supportsLinearEasing', () => {
  const original = globalThis.CSS;
  afterEach(() => {
    globalThis.CSS = original;
  });

  it('asks the browser', () => {
    globalThis.CSS = { supports: () => true } as unknown as typeof CSS;
    expect(supportsLinearEasing()).toBe(true);

    globalThis.CSS = { supports: () => false } as unknown as typeof CSS;
    expect(supportsLinearEasing()).toBe(false);
  });

  it('says no where there is no CSS object to ask', () => {
    globalThis.CSS = undefined as unknown as typeof CSS;
    expect(supportsLinearEasing()).toBe(false);
  });
});
