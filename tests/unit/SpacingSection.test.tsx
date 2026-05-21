import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpacingSection } from "@/sections/design-system/SpacingSection";
import { DS_DENSITY, DS_RADII, DS_SPACING } from "@/lib/data/design-system";

describe("SpacingSection", () => {
  it("renders every spacing token + px value", () => {
    render(<SpacingSection />);
    DS_SPACING.forEach((s) => {
      expect(screen.getByText(s.token)).toBeInTheDocument();
      expect(screen.getByText(`${s.px}px`)).toBeInTheDocument();
    });
  });

  it("renders the visualization bar with width = px * 1.5", () => {
    const { container } = render(<SpacingSection />);
    // Find the bar for --space-8 (32px → 48px wide).
    const tokenLabel = screen.getByText("--space-8");
    const row = tokenLabel.parentElement!;
    const bar = row.querySelector("span.block") as HTMLElement;
    expect(bar).not.toBeNull();
    expect(bar.style.width).toBe("48px");
    expect(container).toBeTruthy();
  });

  it("renders every radius token with soft + sharp swatches", () => {
    const { container } = render(<SpacingSection />);
    DS_RADII.forEach((r) => {
      expect(screen.getByText(r.token)).toBeInTheDocument();
      expect(screen.getByText(`soft · ${r.soft}px`)).toBeInTheDocument();
      expect(screen.getByText(`sharp · ${r.sharp}px`)).toBeInTheDocument();
    });
    const softSquare = container.querySelector(
      `div[style*="border-radius: ${DS_RADII[0].soft}px"]`
    );
    expect(softSquare).not.toBeNull();
  });

  it("renders every density preset", () => {
    render(<SpacingSection />);
    DS_DENSITY.forEach((d) => {
      expect(screen.getByText(d.name)).toBeInTheDocument();
      expect(screen.getByText(`card ${d.card} · section ${d.section}`)).toBeInTheDocument();
    });
  });

  it("uses section id=#spacing", () => {
    const { container } = render(<SpacingSection />);
    expect(container.querySelector("section")?.id).toBe("spacing");
  });
});
