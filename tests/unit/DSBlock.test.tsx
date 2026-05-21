import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DSBlock } from "@/sections/design-system/DSBlock";

describe("DSBlock", () => {
  it("renders the num, kicker, title (twice), and children", () => {
    render(
      <DSBlock id="foundations" num="01" title="Foundations" kicker="A short description.">
        <p data-testid="child">child</p>
      </DSBlock>
    );
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Foundations" })).toBeInTheDocument();
    expect(screen.getByText("A short description.")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
    // Title appears once as h2 plus once as the small kicker line.
    expect(screen.getAllByText("Foundations").length).toBe(2);
  });

  it("forwards the id to the underlying <section>", () => {
    const { container } = render(
      <DSBlock id="colors" num="02" title="Colors" kicker="palette">
        <span>x</span>
      </DSBlock>
    );
    expect(container.querySelector("section")?.id).toBe("colors");
  });
});
