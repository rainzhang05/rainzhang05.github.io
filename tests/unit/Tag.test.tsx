import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tag } from "@/components/atoms/Tag";

describe("Tag", () => {
  it("renders its children", () => {
    render(<Tag>Hello</Tag>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("uses sans font by default and switches to mono when mono is set", () => {
    const { rerender } = render(<Tag>Sans</Tag>);
    expect(screen.getByText("Sans").className).toContain("font-sans");
    rerender(<Tag mono>Mono</Tag>);
    expect(screen.getByText("Mono").className).toContain("font-mono");
  });

  it("applies the accent tone color treatment", () => {
    render(
      <Tag tone="accent" mono>
        Featured
      </Tag>
    );
    const el = screen.getByText("Featured");
    expect(el.className).toContain("text-[var(--accent-strong)]");
  });

  it("merges custom className", () => {
    render(<Tag className="my-custom">Cls</Tag>);
    expect(screen.getByText("Cls").className).toContain("my-custom");
  });
});
