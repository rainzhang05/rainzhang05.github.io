import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TweaksSection } from "@/sections/design-system/TweaksSection";
import { DS_TWEAKS } from "@/lib/data/design-system";

describe("TweaksSection", () => {
  it("renders every tweak name and description", () => {
    render(<TweaksSection />);
    DS_TWEAKS.forEach((t) => {
      expect(screen.getByText(t.name)).toBeInTheDocument();
      expect(screen.getByText(t.desc)).toBeInTheDocument();
    });
  });

  it("renders one card per tweak (8 entries)", () => {
    const { container } = render(<TweaksSection />);
    const cards = container.querySelectorAll(".rounded-xl.border");
    // Includes the DSBlock wrapper class match noise; count rounded-xl + bg-[var(--surface)] grid items.
    const grid = container.querySelector(".grid.sm\\:grid-cols-2") as HTMLElement;
    expect(grid).not.toBeNull();
    expect(grid.children.length).toBe(DS_TWEAKS.length);
    expect(cards.length).toBeGreaterThanOrEqual(DS_TWEAKS.length);
  });
});
