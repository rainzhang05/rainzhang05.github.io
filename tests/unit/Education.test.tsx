import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Education } from "@/sections/portfolio/Education";
import { EDUCATION } from "@/lib/data/education";

describe("Education", () => {
  it("renders both schools", () => {
    render(<Education />);
    expect(screen.getByText("Simon Fraser University")).toBeInTheDocument();
    expect(screen.getByText("Semiahmoo Secondary")).toBeInTheDocument();
  });

  it("renders the expected-graduation line only for entries that have one", () => {
    render(<Education />);
    const sfu = EDUCATION.find((e) => e.school === "Simon Fraser University")!;
    const semi = EDUCATION.find((e) => e.school === "Semiahmoo Secondary")!;
    expect(screen.getByText(sfu.expected as string)).toBeInTheDocument();
    expect(semi.expected).toBeNull();
    expect(screen.queryByText(/expected graduation/i)).toBe(
      screen.getByText(sfu.expected as string)
    );
  });

  it("renders every note for each school", () => {
    render(<Education />);
    EDUCATION.forEach((entry) => {
      const heading = screen.getByRole("heading", { level: 3, name: entry.school });
      const card = heading.closest("div.relative") as HTMLElement;
      const list = within(card).getAllByRole("listitem");
      expect(list.length).toBe(entry.notes.length);
      entry.notes.forEach((note) => {
        expect(within(card).getByText(note)).toBeInTheDocument();
      });
    });
  });
});
