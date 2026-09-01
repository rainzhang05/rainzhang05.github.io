import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MicroLabel } from "@/components/atoms/MicroLabel";

describe("MicroLabel", () => {
  it("renders its children", () => {
    render(<MicroLabel>Navigate</MicroLabel>);
    expect(screen.getByText("Navigate")).toBeInTheDocument();
  });

  it("drives font, tracking, and casing off the locale typography tokens", () => {
    render(<MicroLabel>label</MicroLabel>);
    const el = screen.getByText("label");
    expect(el.className).toContain("font-[family-name:var(--label-font)]");
    expect(el.className).toContain("tracking-[var(--label-tracking)]");
    expect(el.className).toContain("[text-transform:var(--label-transform)]");
  });

  it("merges a custom className", () => {
    render(<MicroLabel className="mb-4">label</MicroLabel>);
    expect(screen.getByText("label").className).toContain("mb-4");
  });
});
