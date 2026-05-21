import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TypeSection } from "@/sections/design-system/TypeSection";
import { DS_TYPE } from "@/lib/data/design-system";

describe("TypeSection", () => {
  it("renders every type row by name and example", () => {
    render(<TypeSection />);
    DS_TYPE.forEach((row) => {
      expect(screen.getByText(row.name)).toBeInTheDocument();
      expect(screen.getByText(row.example)).toBeInTheDocument();
    });
  });

  it("renders the Manrope specimen with an inline fontFamily", () => {
    render(<TypeSection />);
    const specimen = screen.getByText("Aa Bb Cc");
    expect(specimen.getAttribute("style") ?? "").toContain("Manrope");
  });

  it("renders the JetBrains Mono specimen label", () => {
    render(<TypeSection />);
    expect(screen.getByText("01 — Aa")).toBeInTheDocument();
  });

  it("uses section id=#type", () => {
    const { container } = render(<TypeSection />);
    expect(container.querySelector("section")?.id).toBe("type");
  });
});
