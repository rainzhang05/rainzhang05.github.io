import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TechTag } from "@/components/atoms/TechTag";
import { TECH_ICONS } from "@/lib/data/tech-icons";

describe("TechTag", () => {
  it("renders the tech name", () => {
    render(<TechTag name="Python" />);
    expect(screen.getByText("Python")).toBeInTheDocument();
  });

  it("renders an icon img for a known tech with the right src and aria/alt attributes", () => {
    const { container } = render(<TechTag name="Python" />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toBe(TECH_ICONS["Python"]);
    expect(img?.getAttribute("alt")).toBe("");
    expect(img?.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders no img for an unknown tech", () => {
    const { container } = render(<TechTag name="UnknownLanguage" />);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("UnknownLanguage")).toBeInTheDocument();
  });

  it("merges a custom className", () => {
    render(<TechTag name="Rust" className="extra-class" />);
    expect(screen.getByText("Rust").className).toContain("extra-class");
  });
});
