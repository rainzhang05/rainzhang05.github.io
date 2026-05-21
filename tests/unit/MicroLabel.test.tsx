import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MicroLabel } from "@/components/atoms/MicroLabel";

describe("MicroLabel", () => {
  it("renders its children", () => {
    render(<MicroLabel>Navigate</MicroLabel>);
    expect(screen.getByText("Navigate")).toBeInTheDocument();
  });

  it("applies the mono uppercase styling contract", () => {
    render(<MicroLabel>label</MicroLabel>);
    const el = screen.getByText("label");
    expect(el.className).toContain("font-mono");
    expect(el.className).toContain("uppercase");
  });

  it("merges a custom className", () => {
    render(<MicroLabel className="mb-4">label</MicroLabel>);
    expect(screen.getByText("label").className).toContain("mb-4");
  });
});
