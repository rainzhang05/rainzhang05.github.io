import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Icon } from "@/components/atoms/Icon";
import type { IconName } from "@/lib/types";

const ALL_ICONS: IconName[] = [
  "arrow-up-right",
  "arrow-right",
  "arrow-down",
  "external",
  "github",
  "linkedin",
  "mail",
  "file",
  "sun",
  "moon",
  "menu",
  "x",
  "check",
];

describe("Icon", () => {
  it("renders an svg with default size 16, viewBox, and aria-hidden", () => {
    const { container } = render(<Icon name="check" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("width")).toBe("16");
    expect(svg?.getAttribute("height")).toBe("16");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("respects a custom size", () => {
    const { container } = render(<Icon name="menu" size={32} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("32");
    expect(svg?.getAttribute("height")).toBe("32");
  });

  it("merges a custom className", () => {
    const { container } = render(<Icon name="x" className="text-red-500" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("text-red-500");
  });

  it.each(ALL_ICONS)("renders a geometric child for %s", (name) => {
    const { container } = render(<Icon name={name} />);
    const shapes = container.querySelectorAll("path, rect, circle, polyline");
    expect(shapes.length).toBeGreaterThan(0);
  });
});
