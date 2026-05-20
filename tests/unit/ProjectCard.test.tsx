import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ProjectCard } from "@/sections/portfolio/ProjectCard";
import type { Project } from "@/lib/types";

const project: Project = {
  id: "security-demo",
  title: "Test Project",
  summary: "A short summary.",
  image: "/projects/security-demo.png",
  period: "Nov 2025",
  role: "Lead",
  tools: "Test, Tools",
  stack: ["Python", "React"],
  cryptoNote: null,
  links: { live: "https://example.com", github: "https://github.com/example/repo" },
  impact: [{ title: "Did stuff", body: "Lots of stuff." }],
};

describe("ProjectCard", () => {
  it("renders the title and starts collapsed (aria-expanded=false)", () => {
    render(<ProjectCard project={project} expanded={false} onToggle={vi.fn()} />);
    const toggle = screen.getByRole("button", { expanded: false });
    expect(toggle).toBeInTheDocument();
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("invokes onToggle when the card body is clicked", () => {
    const onToggle = vi.fn();
    render(<ProjectCard project={project} expanded={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("button", { expanded: false }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("inner Live/Code links do NOT trigger onToggle (stopPropagation)", () => {
    const onToggle = vi.fn();
    render(<ProjectCard project={project} expanded={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("link", { name: /Live/i }));
    expect(onToggle).not.toHaveBeenCalled();
  });

  it("flips the toggle label between Read more / Collapse based on expanded prop", () => {
    const { rerender } = render(
      <ProjectCard project={project} expanded={false} onToggle={vi.fn()} />
    );
    expect(screen.getByText("Read more")).toBeInTheDocument();
    rerender(<ProjectCard project={project} expanded onToggle={vi.fn()} />);
    expect(screen.getByText("Collapse")).toBeInTheDocument();
  });
});
