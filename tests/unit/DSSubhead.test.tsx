import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DSSubhead } from "@/sections/design-system/DSSubhead";

describe("DSSubhead", () => {
  it("renders an h4 with its children", () => {
    render(<DSSubhead>Accent scale</DSSubhead>);
    const heading = screen.getByRole("heading", { level: 4, name: "Accent scale" });
    expect(heading).toBeInTheDocument();
  });

  it("applies the mono uppercase styling contract", () => {
    render(<DSSubhead>label</DSSubhead>);
    const heading = screen.getByRole("heading", { level: 4 });
    expect(heading.className).toContain("font-mono");
    expect(heading.className).toContain("uppercase");
  });
});
