import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Experience } from "@/sections/portfolio/Experience";
import { EXPERIENCES } from "@/lib/data/experiences";
import { PROJECTS } from "@/lib/data/projects";

/**
 * Entries are ordered most-recent-first, so tests address them by id rather
 * than by index — adding a newer role must not rewrite these assertions.
 */
const byId = (id: string) => EXPERIENCES.find((e) => e.id === id)!;
const FEITIAN = byId("feitian");
const MNT = byId("mnt-realty");

describe("Experience", () => {
  it("renders the experience role, dept, period, and location", () => {
    render(<Experience />);
    for (const exp of EXPERIENCES) {
      expect(screen.getByRole("heading", { level: 3, name: exp.role })).toBeInTheDocument();
      expect(screen.getByText(exp.period)).toBeInTheDocument();
      expect(screen.getByText(exp.location)).toBeInTheDocument();
      if (exp.dept) expect(screen.getByText(exp.dept)).toBeInTheDocument();
    }
  });

  it("omits the dept line for an entry that has no department", () => {
    const { container } = render(<Experience />);
    expect(MNT.dept).toBeUndefined();
    expect(FEITIAN.dept).toBeTruthy();
    // One dept paragraph across both cards — FEITIAN's.
    const deptLines = container.querySelectorAll("p.text-xs.text-\\[var\\(--text-subtle\\)\\]");
    expect(deptLines).toHaveLength(1);
    expect(deptLines[0]).toHaveTextContent(FEITIAN.dept!);
  });

  it("renders every outcome as a list item", () => {
    render(<Experience />);
    EXPERIENCES.flatMap((e) => e.outcomes).forEach((o) => {
      expect(screen.getByText(o)).toBeInTheDocument();
    });
  });

  it("gives each entry its own logo", () => {
    const { container } = render(<Experience />);
    for (const exp of EXPERIENCES) {
      const logo = container.querySelector<HTMLImageElement>(`img[src="${exp.logo}"]`);
      expect(logo, `logo for ${exp.id}`).not.toBeNull();
      expect(logo).toHaveAttribute("alt", exp.logoAlt);
      // Square marks opt into a taller class; wordmarks fall back to h-6.
      expect(logo!.className).toContain(exp.logoHeight ?? "h-6");
    }
  });

  it("renders the type pill only for entries that declare one", () => {
    render(<Experience />);
    expect(FEITIAN.tagType).toBe("Internship");
    expect(screen.getByText("Internship")).toBeInTheDocument();
    // The current role is not an internship and declares no pill at all.
    expect(MNT.tagType).toBeUndefined();
    expect(screen.getAllByText("Internship")).toHaveLength(1);
  });

  it("omits the related-work rail for an entry with no related projects", () => {
    render(<Experience />);
    expect(MNT.related).toEqual([]);
    // One rail total — FEITIAN's — even though two entries render.
    expect(screen.getAllByText("Related work")).toHaveLength(1);
  });

  it("renders related-work buttons that resolve to project titles", () => {
    render(<Experience />);
    FEITIAN.related.forEach((id) => {
      const project = PROJECTS.find((p) => p.id === id);
      expect(project).toBeDefined();
      expect(screen.getByRole("button", { name: project!.title })).toBeInTheDocument();
    });
  });

  it("invokes onOpenProject(id) when a related-work button is clicked", () => {
    const onOpenProject = vi.fn();
    render(<Experience onOpenProject={onOpenProject} />);
    const firstRelated = PROJECTS.find((p) => p.id === FEITIAN.related[0])!;
    fireEvent.click(screen.getByRole("button", { name: firstRelated.title }));
    expect(onOpenProject).toHaveBeenCalledWith(FEITIAN.related[0]);
  });

  it("does not throw when onOpenProject is undefined", () => {
    render(<Experience />);
    const firstRelated = PROJECTS.find((p) => p.id === FEITIAN.related[0])!;
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: firstRelated.title }))
    ).not.toThrow();
  });

  it("silently omits related buttons when the project id is unknown", async () => {
    vi.resetModules();
    vi.doMock("@/lib/data/projects", () => ({ PROJECTS: [] }));
    const { Experience: ExperienceReloaded } = await import("@/sections/portfolio/Experience");
    render(<ExperienceReloaded />);
    FEITIAN.related.forEach((id) => {
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
