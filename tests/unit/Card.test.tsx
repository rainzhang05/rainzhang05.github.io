import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "@/components/atoms/Card";

describe("Card", () => {
  it("renders a div by default", () => {
    render(<Card>content</Card>);
    const el = screen.getByText("content");
    expect(el.tagName).toBe("DIV");
  });

  it("respects the polymorphic `as` prop", () => {
    render(
      <Card as="article" data-testid="card">
        content
      </Card>
    );
    expect(screen.getByTestId("card").tagName).toBe("ARTICLE");
  });

  it("adds interactive hover classes only when interactive is true", () => {
    const { rerender } = render(<Card>card</Card>);
    expect(screen.getByText("card").className).not.toContain("hover:border-[var(--border-strong)]");

    rerender(<Card interactive>card</Card>);
    const interactive = screen.getByText("card");
    expect(interactive.className).toContain("hover:border-[var(--border-strong)]");
    expect(interactive.className).toContain("hover:-translate-y-[1px]");
  });

  it("merges custom className alongside the defaults", () => {
    render(<Card className="my-card">card</Card>);
    const el = screen.getByText("card");
    expect(el.className).toContain("my-card");
    expect(el.className).toContain("rounded-[calc(var(--r-md)*1px)]");
  });

  it("forwards extra HTML props to the root element", () => {
    render(
      <Card id="cta" aria-label="My card" data-testid="card">
        content
      </Card>
    );
    const el = screen.getByTestId("card");
    expect(el.id).toBe("cta");
    expect(el.getAttribute("aria-label")).toBe("My card");
  });
});
