import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Nav } from "@/components/chrome/Nav";
import { NAV_ITEMS } from "@/lib/data/nav";

describe("Nav", () => {
  it("renders every secondary nav item", () => {
    render(<Nav activeSection="intro" theme="light" onToggleTheme={vi.fn()} />);
    // First item ("Intro") is rendered as the brand link, the rest are nav.
    for (const item of NAV_ITEMS.slice(1)) {
      expect(screen.getByRole("link", { name: item.label })).toBeInTheDocument();
    }
  });

  it("shows the sun icon in light theme and moon in dark", () => {
    const { rerender } = render(
      <Nav activeSection="intro" theme="light" onToggleTheme={vi.fn()} />
    );
    expect(screen.getByLabelText("Switch to dark mode")).toBeInTheDocument();
    rerender(<Nav activeSection="intro" theme="dark" onToggleTheme={vi.fn()} />);
    expect(screen.getByLabelText("Switch to light mode")).toBeInTheDocument();
  });

  it("highlights the active section in the nav pill", () => {
    render(<Nav activeSection="projects" theme="light" onToggleTheme={vi.fn()} />);
    const projectsLink = screen.getByRole("link", { name: "Projects" });
    expect(projectsLink.className).toContain("bg-[var(--surface-2)]");
  });
});
