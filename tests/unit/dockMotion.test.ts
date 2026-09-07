import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ACTIVE_LINE,
  AMPLITUDE,
  BASE,
  OPEN_RATIO,
  RELEASE_RATIO,
  SPREAD,
  TAU_POINTER,
  TAU_SECTION,
  bandIndex,
  dockMetrics,
  magnify,
  railDistance,
} from "@/lib/dockMotion";

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

  it("never leaves the base..base+amplitude range", () => {
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

describe("railDistance", () => {
  // The rail runs from the viewport's left edge to `right`, spanning top..bottom.
  const right = 60;
  const top = 350;
  const bottom = 550;
  const d = (x: number, y: number) => railDistance(x, y, right, top, bottom);

  it("is zero anywhere inside the rail, which is why :hover is a subset", () => {
    expect(d(0, 450)).toBe(0);
    expect(d(60, 350)).toBe(0);
    expect(d(30, 550)).toBe(0);
  });

  it("measures straight out to the right", () => {
    expect(d(120, 450)).toBe(60);
    expect(d(180, 400)).toBe(120);
  });

  it("measures straight past either end", () => {
    expect(d(30, 300)).toBe(50);
    expect(d(30, 600)).toBe(50);
  });

  it("is euclidean at a corner, so a pointer parked diagonally stays away", () => {
    expect(d(160, 650)).toBeCloseTo(Math.sqrt(100 * 100 + 100 * 100), 10);
    expect(d(160, 650)).toBeGreaterThan(100);
  });

  it("grows monotonically as the pointer retreats", () => {
    let previous = -1;
    for (let x = 0; x < 400; x += 10) {
      const now = d(x, 450);
      expect(now).toBeGreaterThanOrEqual(previous);
      previous = now;
    }
  });
});

describe("bandIndex", () => {
  const pitch = 40;
  const count = 5;

  it("tiles the column with no seam between two bubbles", () => {
    expect(bandIndex(0, pitch, count, 20)).toBe(0);
    expect(bandIndex(39.9, pitch, count, 20)).toBe(0);
    expect(bandIndex(40, pitch, count, 20)).toBe(1);
    expect(bandIndex(199.9, pitch, count, 20)).toBe(4);
  });

  it("holds the end bubbles open for a little overshoot", () => {
    expect(bandIndex(-10, pitch, count, 20)).toBe(0);
    expect(bandIndex(210, pitch, count, 20)).toBe(4);
  });

  it("reports nothing past the slack", () => {
    expect(bandIndex(-30, pitch, count, 20)).toBe(-1);
    expect(bandIndex(230, pitch, count, 20)).toBe(-1);
  });

  it("survives a degenerate column", () => {
    expect(bandIndex(10, 0, count, 20)).toBe(-1);
    expect(bandIndex(10, pitch, 0, 20)).toBe(-1);
  });
});

describe("dockMetrics", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const full = {
    "--dock-pitch": "40px",
    "--dock-dot": "10px",
    "--dock-hit": "44px",
    "--dock-inset": "16px",
    "--dock-reach": "120px",
  };

  const stub = (values: Record<string, string>) =>
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      getPropertyValue: (name: string) => values[name] ?? "",
    } as unknown as CSSStyleDeclaration);

  it("reads every spatial token off the element", () => {
    stub(full);

    expect(dockMetrics(document.createElement("div"))).toEqual({
      pitch: 40,
      dot: 10,
      hit: 44,
      inset: 16,
      reach: 120,
    });
  });

  it("returns null when the tokens are missing, so no NaN reaches a transform", () => {
    // This is the state under vitest, where css:false resolves nothing.
    stub({});

    expect(dockMetrics(document.createElement("div"))).toBeNull();
  });

  it("returns null when any single token is unusable", () => {
    for (const key of ["--dock-pitch", "--dock-dot", "--dock-hit"]) {
      stub({ ...full, [key]: "0px" });
      expect(dockMetrics(document.createElement("div")), key).toBeNull();
    }

    stub({ ...full, "--dock-inset": "-4px" });
    expect(dockMetrics(document.createElement("div"))).toBeNull();
  });

  it("allows a zero inset and a zero reach, which are legitimate", () => {
    stub({ ...full, "--dock-inset": "0px", "--dock-reach": "0px" });

    expect(dockMetrics(document.createElement("div"))).toMatchObject({ inset: 0, reach: 0 });
  });
});

describe("tuning constants", () => {
  it("follows a live pointer far faster than it glides between sections", () => {
    expect(TAU_POINTER).toBeGreaterThan(0);
    expect(TAU_SECTION).toBeGreaterThan(TAU_POINTER * 3);
  });

  it("opens the label inside the lens reach, and releases further out than it engages", () => {
    expect(OPEN_RATIO).toBeGreaterThan(0);
    expect(OPEN_RATIO).toBeLessThan(1);
    expect(RELEASE_RATIO).toBeGreaterThan(1);
  });

  it("puts the active line in the upper half of the viewport", () => {
    expect(ACTIVE_LINE).toBeGreaterThan(0);
    expect(ACTIVE_LINE).toBeLessThan(0.5);
  });
});
