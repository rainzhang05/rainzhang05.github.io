import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DesignSystemShell } from "@/sections/design-system/DesignSystemShell";
import { mockMatchMedia } from "@/tests/setup/dom-mocks";

describe("DesignSystemShell", () => {
  const cleanups: Array<() => void> = [];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-20"));
    const mm = mockMatchMedia(false);
    cleanups.push(mm.restore);
  });

  afterEach(() => {
    while (cleanups.length) cleanups.pop()?.();
    vi.useRealTimers();
  });

  it("renders the hero headline", () => {
    render(<DesignSystemShell />);
    expect(screen.getByText(/The system behind/)).toBeInTheDocument();
  });

  it("renders every numbered DSBlock heading", () => {
    render(<DesignSystemShell />);
    [
      "Foundations",
      "Colors",
      "Typography",
      "Spacing & Radii",
      "Components",
      "Tweaks",
    ].forEach((title) => {
      expect(screen.getByRole("heading", { level: 2, name: title })).toBeInTheDocument();
    });
  });

  it("renders the dynamic footer year", () => {
    render(<DesignSystemShell />);
    expect(screen.getByText(/© 2026 Rain Zhang/)).toBeInTheDocument();
  });
});
