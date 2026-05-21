import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionTitle } from "@/components/atoms/SectionTitle";

describe("SectionTitle", () => {
  it("renders the heading as h2", () => {
    render(<SectionTitle>About</SectionTitle>);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("About");
  });

  it("omits the kicker paragraph when not provided", () => {
    const { container } = render(<SectionTitle>About</SectionTitle>);
    expect(container.querySelector("p")).toBeNull();
  });

  it("renders the kicker paragraph when provided", () => {
    render(<SectionTitle kicker="a short read">About</SectionTitle>);
    expect(screen.getByText("a short read")).toBeInTheDocument();
    expect(screen.getByText("a short read").tagName).toBe("P");
  });

  it("accepts a ReactNode kicker", () => {
    render(
      <SectionTitle kicker={<span data-testid="rich">rich kicker</span>}>About</SectionTitle>
    );
    expect(screen.getByTestId("rich")).toHaveTextContent("rich kicker");
  });
});
