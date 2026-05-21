import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FoundationSection } from "@/sections/design-system/FoundationSection";
import { DS_FOUNDATIONS } from "@/lib/data/design-system";

describe("FoundationSection", () => {
  it("renders every foundation title", () => {
    render(<FoundationSection />);
    DS_FOUNDATIONS.forEach((f) => {
      expect(screen.getByRole("heading", { level: 4, name: f.t })).toBeInTheDocument();
    });
  });

  it("renders every foundation description", () => {
    render(<FoundationSection />);
    DS_FOUNDATIONS.forEach((f) => {
      expect(screen.getByText(f.d)).toBeInTheDocument();
    });
  });

  it("renders zero-padded sequence labels via padStart", () => {
    render(<FoundationSection />);
    DS_FOUNDATIONS.forEach((_, i) => {
      const expected = String(i + 1).padStart(2, "0");
      // "01" also appears as the DSBlock num indicator, so use queryAllByText.
      expect(screen.queryAllByText(expected).length).toBeGreaterThan(0);
    });
  });

  it("anchors the section to id=#foundations for nav alignment", () => {
    const { container } = render(<FoundationSection />);
    expect(container.querySelector("section")?.id).toBe("foundations");
  });
});
