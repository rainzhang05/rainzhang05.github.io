import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ColorsSection } from "@/sections/design-system/ColorsSection";
import { DS_ACCENTS, DS_DARK, DS_LIGHT } from "@/lib/data/design-system";

describe("ColorsSection", () => {
  it("renders every accent name and base hex", () => {
    render(<ColorsSection />);
    DS_ACCENTS.forEach((a) => {
      expect(screen.getByText(a.name)).toBeInTheDocument();
      expect(screen.getByText(a.base)).toBeInTheDocument();
    });
  });

  it("renders every light theme swatch (name + hex)", () => {
    render(<ColorsSection />);
    DS_LIGHT.forEach((c) => {
      const labels = screen.getAllByText(c.name);
      expect(labels.length).toBeGreaterThan(0);
      expect(screen.getAllByText(c.hex).length).toBeGreaterThan(0);
    });
  });

  it("renders every dark theme swatch (name + hex)", () => {
    render(<ColorsSection />);
    DS_DARK.forEach((c) => {
      const labels = screen.getAllByText(c.name);
      expect(labels.length).toBeGreaterThan(0);
      expect(screen.getAllByText(c.hex).length).toBeGreaterThan(0);
    });
  });

  it("renders the ring-inset overlay only for the dark Background swatch (#07090d)", () => {
    const { container } = render(<ColorsSection />);
    const rings = container.querySelectorAll(".ring-inset");
    expect(rings.length).toBe(1);
  });

  it("uses section id=#colors", () => {
    const { container } = render(<ColorsSection />);
    expect(container.querySelector("section")?.id).toBe("colors");
  });
});
