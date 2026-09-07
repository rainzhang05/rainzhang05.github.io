import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ACTIVE_LINE,
  AMPLITUDE,
  BASE,
  MERGE_END,
  SPLIT_START,
  SPREAD,
  clamp01,
  cubicBezier,
  dockMetrics,
  easeOut,
  easePanel,
  lerp,
  magnify,
  progress,
  subProgress,
} from "@/lib/dockMotion";

/** Everything the dock draws, derived from one scroll position. */
const frame = (scrollY: number, t1 = 36, span = 500) => {
  const p = progress(scrollY, t1, span);
  const pMerge = subProgress(p, 0, MERGE_END);
  const pSplit = subProgress(p, SPLIT_START, 1);
  return [p, easeOut(pMerge), easePanel(pSplit)];
};

describe("progress", () => {
  it("is 0 before T1 and 1 after T1 + span", () => {
    expect(progress(0, 36, 500)).toBe(0);
    expect(progress(36, 36, 500)).toBe(0);
    expect(progress(536, 36, 500)).toBe(1);
    expect(progress(9000, 36, 500)).toBe(1);
  });

  it("rises monotonically across the span", () => {
    let previous = -1;
    for (let y = 0; y <= 600; y += 5) {
      const p = progress(y, 36, 500);
      expect(p).toBeGreaterThanOrEqual(previous);
      previous = p;
    }
  });

  it("falls back to a binary answer when the span collapses", () => {
    expect(progress(10, 36, 0)).toBe(0);
    expect(progress(40, 36, 0)).toBe(1);
    expect(progress(40, 36, -100)).toBe(1);
  });
});

describe("reversibility", () => {
  // The load-bearing property: scrolling up has to retrace the way down, not
  // play a second animation. Position is a pure function of scrollY, so the
  // two sweeps must agree exactly — not approximately.
  it("draws an identical frame at the same scroll position in both directions", () => {
    const positions: number[] = [];
    for (let y = 0; y <= 600; y += 3) positions.push(y);

    const down = positions.map((y) => frame(y));
    const up = [...positions].reverse().map((y) => frame(y));

    expect(up).toEqual([...down].reverse());
  });

  it("lands in the final state when a fling skips every threshold in one step", () => {
    // One frame from the top of the page to well past T4.
    expect(frame(0)).toEqual([0, 0, 0]);
    expect(frame(4000)).toEqual([1, 1, 1]);
  });

  it("resumes from where it is when the direction reverses mid-descent", () => {
    const mid = frame(200);
    expect(frame(260)).not.toEqual(mid);
    expect(frame(200)).toEqual(mid);
  });
});

describe("subProgress", () => {
  it("re-maps a slice of the progress value onto 0..1", () => {
    expect(subProgress(0, 0, MERGE_END)).toBe(0);
    expect(subProgress(MERGE_END, 0, MERGE_END)).toBe(1);
    expect(subProgress(MERGE_END / 2, 0, MERGE_END)).toBeCloseTo(0.5, 10);
  });

  it("holds the split at zero through the parked beat", () => {
    expect(subProgress(MERGE_END, SPLIT_START, 1)).toBe(0);
    expect(subProgress(SPLIT_START, SPLIT_START, 1)).toBe(0);
    expect(subProgress(1, SPLIT_START, 1)).toBe(1);
  });

  it("survives a degenerate range", () => {
    expect(subProgress(0.5, 0.7, 0.7)).toBe(0);
    expect(subProgress(0.8, 0.7, 0.7)).toBe(1);
  });
});

describe("magnify", () => {
  it("peaks at the focus point and falls away smoothly", () => {
    expect(magnify(0, BASE, AMPLITUDE, SPREAD)).toBeCloseTo(1.5, 10);
    expect(magnify(40, BASE, AMPLITUDE, SPREAD)).toBeCloseTo(0.96417, 4);
    expect(magnify(80, BASE, AMPLITUDE, SPREAD)).toBeCloseTo(0.7095, 4);
  });

  it("keeps adjacent bubbles far enough apart to read", () => {
    // On a 10px dot at a 40px pitch: 15.00px focused against 9.64px beside it.
    const dot = 10;
    const focused = magnify(0, BASE, AMPLITUDE, SPREAD) * dot;
    const neighbour = magnify(40, BASE, AMPLITUDE, SPREAD) * dot;
    expect(focused - neighbour).toBeGreaterThan(5);
  });

  it("is symmetric about the focus point", () => {
    expect(magnify(-27, BASE, AMPLITUDE, SPREAD)).toBeCloseTo(
      magnify(27, BASE, AMPLITUDE, SPREAD),
      12
    );
  });

  it("never drops below the base scale", () => {
    for (let d = 0; d < 400; d += 7) {
      const scale = magnify(d, BASE, AMPLITUDE, SPREAD);
      expect(scale).toBeGreaterThanOrEqual(BASE);
      expect(scale).toBeLessThanOrEqual(BASE + AMPLITUDE);
    }
  });

  it("returns the base scale rather than NaN when the spread is unusable", () => {
    expect(magnify(10, BASE, AMPLITUDE, 0)).toBe(BASE);
    expect(magnify(10, BASE, AMPLITUDE, -5)).toBe(BASE);
  });
});

describe("cubicBezier", () => {
  it("pins both ends", () => {
    expect(easeOut(0)).toBe(0);
    expect(easeOut(1)).toBe(1);
    expect(easePanel(0)).toBe(0);
    expect(easePanel(1)).toBe(1);
    expect(easeOut(-1)).toBe(0);
    expect(easePanel(2)).toBe(1);
  });

  it("reproduces linear for a linear control polygon", () => {
    const linear = cubicBezier(1 / 3, 1 / 3, 2 / 3, 2 / 3);
    for (const t of [0.1, 0.25, 0.5, 0.75, 0.9]) {
      expect(linear(t)).toBeCloseTo(t, 5);
    }
  });

  it("is monotonic across both of the site's curves", () => {
    for (const ease of [easeOut, easePanel]) {
      let previous = -1;
      for (let t = 0; t <= 1.0001; t += 0.01) {
        const v = ease(t);
        expect(v).toBeGreaterThanOrEqual(previous - 1e-9);
        previous = v;
      }
    }
  });

  it("front-loads both curves, which is what keeps the morph from lurching", () => {
    expect(easeOut(0.5)).toBeGreaterThan(0.5);
    expect(easePanel(0.5)).toBeGreaterThan(0.5);
  });
});

describe("clamp01 and lerp", () => {
  it("clamps", () => {
    expect(clamp01(-3)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(9)).toBe(1);
  });

  it("interpolates and pins its ends", () => {
    expect(lerp(10, 20, 0)).toBe(10);
    expect(lerp(10, 20, 1)).toBe(20);
    expect(lerp(10, 20, 0.5)).toBe(15);
    expect(lerp(-40, 0, 1)).toBe(0);
  });
});

describe("dockMetrics", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const stub = (values: Record<string, string>) =>
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      getPropertyValue: (name: string) => values[name] ?? "",
    } as unknown as CSSStyleDeclaration);

  it("reads the spatial tokens off the element", () => {
    stub({ "--dock-pitch": "40px", "--dock-dot": "10px", "--dock-hit": "32px" });

    expect(dockMetrics(document.createElement("div"))).toEqual({ pitch: 40, dot: 10, hit: 32 });
  });

  it("returns null when the tokens are missing, so no NaN reaches a transform", () => {
    stub({});

    expect(dockMetrics(document.createElement("div"))).toBeNull();
  });

  it("returns null for non-positive values", () => {
    stub({ "--dock-pitch": "0px", "--dock-dot": "10px", "--dock-hit": "32px" });
    expect(dockMetrics(document.createElement("div"))).toBeNull();

    stub({ "--dock-pitch": "40px", "--dock-dot": "-2px", "--dock-hit": "32px" });
    expect(dockMetrics(document.createElement("div"))).toBeNull();
  });
});

describe("tuning constants", () => {
  it("keeps the morph phases in order", () => {
    expect(MERGE_END).toBeGreaterThan(0);
    expect(SPLIT_START).toBeGreaterThan(MERGE_END);
    expect(SPLIT_START).toBeLessThan(1);
  });

  it("puts the active line in the upper half of the viewport", () => {
    expect(ACTIVE_LINE).toBeGreaterThan(0);
    expect(ACTIVE_LINE).toBeLessThan(0.5);
  });
});
