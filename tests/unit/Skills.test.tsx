import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skills } from "@/sections/portfolio/Skills";
import { SKILL_GROUPS } from "@/lib/data/skills";
import { TECH_ICONS } from "@/lib/data/tech-icons";

describe("Skills", () => {
  it("renders every skill group label", () => {
    render(<Skills />);
    SKILL_GROUPS.forEach((g) => {
      expect(screen.getByText(g.label)).toBeInTheDocument();
    });
  });

  it("renders every skill item across all groups", () => {
    render(<Skills />);
    SKILL_GROUPS.forEach((g) => {
      g.items.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });
  });

  it("renders an <img> for items that have a TECH_ICONS entry", () => {
    const { container } = render(<Skills />);
    // Python is in every snapshot of TECH_ICONS.
    const pythonSrc = TECH_ICONS["Python"];
    expect(container.querySelector(`img[src="${pythonSrc}"]`)).not.toBeNull();
  });

  it("renders a placeholder dot for items without a TECH_ICONS entry", async () => {
    vi.resetModules();
    vi.doMock("@/lib/data/tech-icons", () => ({ TECH_ICONS: {} }));
    const { Skills: SkillsReloaded } = await import("@/sections/portfolio/Skills");
    const { container } = render(<SkillsReloaded />);
    expect(container.querySelector("img")).toBeNull();
    // Placeholder uses a · glyph inside a square.
    expect(container.textContent).toContain("·");
    vi.doUnmock("@/lib/data/tech-icons");
    vi.resetModules();
  });
});
