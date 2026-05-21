import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Experience } from "@/sections/portfolio/Experience";
import { EXPERIENCES } from "@/lib/data/experiences";
import { PROJECTS } from "@/lib/data/projects";

describe("Experience", () => {
  it("renders the experience role, dept, period, and location", () => {
    render(<Experience />);
    const exp = EXPERIENCES[0];
    expect(screen.getByRole("heading", { level: 3, name: exp.role })).toBeInTheDocument();
    expect(screen.getByText(exp.dept)).toBeInTheDocument();
    expect(screen.getByText(exp.period)).toBeInTheDocument();
    expect(screen.getByText(exp.location)).toBeInTheDocument();
  });

  it("renders every outcome as a list item", () => {
    render(<Experience />);
    EXPERIENCES[0].outcomes.forEach((o) => {
      expect(screen.getByText(o)).toBeInTheDocument();
    });
  });

  it("renders related-work buttons that resolve to project titles", () => {
    render(<Experience />);
    EXPERIENCES[0].related.forEach((id) => {
      const project = PROJECTS.find((p) => p.id === id);
      expect(project).toBeDefined();
      expect(screen.getByRole("button", { name: project!.title })).toBeInTheDocument();
    });
  });

  it("invokes onOpenProject(id) when a related-work button is clicked", () => {
    const onOpenProject = vi.fn();
    render(<Experience onOpenProject={onOpenProject} />);
    const exp = EXPERIENCES[0];
    const firstRelated = PROJECTS.find((p) => p.id === exp.related[0])!;
    fireEvent.click(screen.getByRole("button", { name: firstRelated.title }));
    expect(onOpenProject).toHaveBeenCalledWith(exp.related[0]);
  });

  it("does not throw when onOpenProject is undefined", () => {
    render(<Experience />);
    const exp = EXPERIENCES[0];
    const firstRelated = PROJECTS.find((p) => p.id === exp.related[0])!;
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: firstRelated.title }))
    ).not.toThrow();
  });

  it("silently omits related buttons when the project id is unknown", async () => {
    vi.resetModules();
    vi.doMock("@/lib/data/projects", () => ({ PROJECTS: [] }));
    const { Experience: ExperienceReloaded } = await import("@/sections/portfolio/Experience");
    render(<ExperienceReloaded />);
    EXPERIENCES[0].related.forEach((id) => {
      // No buttons should be created for any of the related IDs.
      const project = PROJECTS.find((p) => p.id === id);
      if (project) {
        expect(screen.queryByRole("button", { name: project.title })).toBeNull();
      }
    });
    vi.doUnmock("@/lib/data/projects");
    vi.resetModules();
  });
});
