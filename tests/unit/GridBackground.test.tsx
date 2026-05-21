import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { GridBackground } from "@/components/chrome/GridBackground";

describe("GridBackground", () => {
  it("renders a single aria-hidden, fixed, pointer-events-none decoration", () => {
    const { container } = render(<GridBackground />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper.getAttribute("aria-hidden")).toBe("true");
    expect(wrapper.className).toContain("fixed");
    expect(wrapper.className).toContain("pointer-events-none");
  });
});
