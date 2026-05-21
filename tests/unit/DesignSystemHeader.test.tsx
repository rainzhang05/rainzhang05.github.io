import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DesignSystemHeader } from "@/sections/design-system/DesignSystemHeader";
import { DS_LINKS } from "@/lib/data/design-system";
import { mockMatchMedia } from "@/tests/setup/dom-mocks";

describe("DesignSystemHeader", () => {
  const cleanups: Array<() => void> = [];

  afterEach(() => {
    while (cleanups.length) cleanups.pop()?.();
  });

  it("renders the brand and every DS_LINKS nav entry", () => {
    const mm = mockMatchMedia(false);
    cleanups.push(mm.restore);

    render(<DesignSystemHeader />);
    expect(screen.getByText("Rain Zhang · Design System")).toBeInTheDocument();
    DS_LINKS.forEach((l) => {
      expect(screen.getByRole("link", { name: l.label })).toHaveAttribute("href", `#${l.id}`);
    });
  });

  it("toggles theme on click and never writes to localStorage", () => {
    const mm = mockMatchMedia(false);
    cleanups.push(mm.restore);

    render(<DesignSystemHeader />);
    expect(screen.getByLabelText("Switch to dark mode")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Switch to dark mode"));
    expect(screen.getByLabelText("Switch to light mode")).toBeInTheDocument();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(window.localStorage.getItem("portfolio.theme")).toBeNull();
  });

  it("starts in dark mode when prefers-color-scheme: dark", () => {
    const mm = mockMatchMedia((q) => q === "(prefers-color-scheme: dark)");
    cleanups.push(mm.restore);

    render(<DesignSystemHeader />);
    expect(screen.getByLabelText("Switch to light mode")).toBeInTheDocument();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});
