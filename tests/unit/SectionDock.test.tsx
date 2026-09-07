import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SectionDock } from "@/components/site/SectionDock";
import { sectionLinks } from "@/lib/sectionLinks";
import { en, ja } from "@/lib/content";

const links = sectionLinks(en);

const render_ = (onNavigate = vi.fn()) => {
  const view = render(
    <SectionDock links={links} label={en.labels.sectionNav} onNavigate={onNavigate} />
  );
  return { ...view, onNavigate };
};

describe("SectionDock", () => {
  it("is a landmark of its own, never the one the header already owns", () => {
    render_();

    expect(screen.getByRole("navigation", { name: "On this page" })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Primary" })).toBeNull();
  });

  it("renders one real button per section, in document order", () => {
    render_();

    const dock = screen.getByRole("navigation", { name: "On this page" });
    const buttons = within(dock).getAllByRole("button");

    expect(buttons.map((b) => b.textContent)).toEqual([
      "Introduction",
      "Experience",
      "Selected Work",
      "Background",
      "Contact",
    ]);
    buttons.forEach((b) => expect(b).toHaveAttribute("type", "button"));
  });

  it("keeps the label as the accessible name while the bubble is collapsed", () => {
    render_();

    // The label is clipped by a 0fr grid track, not by visibility or display,
    // so it still names the control.
    const dock = screen.getByRole("navigation", { name: "On this page" });
    links.forEach((link) => {
      expect(within(dock).getByRole("button", { name: link.label })).toBeInTheDocument();
    });
  });

  it("starts hidden, so nothing sits over the first screen", () => {
    render_();

    expect(screen.getByRole("navigation", { name: "On this page" })).toHaveAttribute(
      "data-shown",
      "false"
    );
  });

  it("asks the page to scroll, rather than scrolling by itself", async () => {
    const user = userEvent.setup();
    const { onNavigate } = render_();

    const dock = screen.getByRole("navigation", { name: "On this page" });
    await user.click(within(dock).getByRole("button", { name: "Background" }));

    expect(onNavigate).toHaveBeenCalledWith("background");
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it("sends the Introduction bubble to the top, not to the section it watches", async () => {
    const user = userEvent.setup();
    const { onNavigate } = render_();

    const dock = screen.getByRole("navigation", { name: "On this page" });
    await user.click(within(dock).getByRole("button", { name: "Introduction" }));

    expect(onNavigate).toHaveBeenCalledWith("top");
  });

  it("hands CSS the stagger order, counting out from the middle of the column", () => {
    render_();

    const dock = screen.getByRole("navigation", { name: "On this page" });
    const steps = within(dock)
      .getAllByRole("button")
      .map((b) => b.getAttribute("style") ?? "");

    // Five bubbles: the entrance runs 2,1,0,1,2 from the middle outward and the
    // exit runs 0,1,2,1,0 from the outside in. CSS cannot count its siblings.
    expect(steps.map((s) => /--dock-d:\s*([\d.]+)/.exec(s)?.[1])).toEqual([
      "2",
      "1",
      "0",
      "1",
      "2",
    ]);
    expect(steps.map((s) => /--dock-d-out:\s*([\d.]+)/.exec(s)?.[1])).toEqual([
      "0",
      "1",
      "2",
      "1",
      "0",
    ]);
  });

  it("renders nothing at all when there are no sections to point at", () => {
    render(<SectionDock links={[]} label={en.labels.sectionNav} onNavigate={vi.fn()} />);

    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("takes its labels from the locale it is given", () => {
    render(
      <SectionDock links={sectionLinks(ja)} label={ja.labels.sectionNav} onNavigate={vi.fn()} />
    );

    const dock = screen.getByRole("navigation", { name: ja.labels.sectionNav });
    expect(within(dock).getAllByRole("button").map((b) => b.textContent)).toEqual([
      ja.sections.intro,
      ja.sections.experience,
      ja.sections.work,
      ja.sections.background,
      ja.sections.contact,
    ]);
  });
});
