import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "@/sections/portfolio/About";

describe("About", () => {
  it("renders the section title and kicker", () => {
    render(<About />);
    expect(screen.getByRole("heading", { level: 2, name: "About" })).toBeInTheDocument();
    expect(screen.getByText("A short read on who I am and how I work.")).toBeInTheDocument();
  });

  it("uses the #about anchor to align with NAV_ITEMS", () => {
    const { container } = render(<About />);
    expect(container.querySelector("section")?.id).toBe("about");
  });

  it("renders exactly three paragraphs", () => {
    const { container } = render(<About />);
    const surface = container.querySelector("section .space-y-5") as HTMLElement;
    expect(surface).not.toBeNull();
    const paragraphs = surface.querySelectorAll("p");
    expect(paragraphs.length).toBe(3);
  });
});
