import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ComponentsSection } from "@/sections/design-system/ComponentsSection";

describe("ComponentsSection", () => {
  it("renders every subhead grouping", () => {
    render(<ComponentsSection />);
    ["Buttons", "Tags", "Form fields", "Project card (interactive)", "Section header (kicker + title)"].forEach(
      (h) => {
        expect(screen.getByRole("heading", { level: 4, name: h })).toBeInTheDocument();
      }
    );
  });

  it("renders each example button", () => {
    render(<ComponentsSection />);
    expect(screen.getByRole("button", { name: /Primary/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Secondary/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ghost/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /STATUS/ })).toBeInTheDocument();
  });

  it("renders the form inputs by placeholder", () => {
    render(<ComponentsSection />);
    expect(screen.getByPlaceholderText("Rain Zhang")).toHaveAttribute("type", "text");
    expect(screen.getByPlaceholderText("you@example.com")).toHaveAttribute("type", "email");
  });

  it("applies the interactive hover contract to the example project card", () => {
    const { container } = render(<ComponentsSection />);
    const interactiveCard = container.querySelector(".hover\\:border-\\[var\\(--border-strong\\)\\]");
    expect(interactiveCard).not.toBeNull();
  });

  it("renders the SectionLabel with padStart numbering (idx=2 → '03 — Projects')", () => {
    render(<ComponentsSection />);
    expect(screen.getByText(/03 — Projects/)).toBeInTheDocument();
  });

  it("uses section id=#components", () => {
    const { container } = render(<ComponentsSection />);
    expect(container.querySelector("section")?.id).toBe("components");
  });
});
