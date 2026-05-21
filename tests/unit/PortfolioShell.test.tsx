import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PortfolioShell } from "@/sections/portfolio/PortfolioShell";
import {
  mockClipboard,
  mockFonts,
  mockIntersectionObserver,
  mockMatchMedia,
  mockWindowScrollTo,
} from "@/tests/setup/dom-mocks";

describe("PortfolioShell", () => {
  const cleanups: Array<() => void> = [];

  beforeEach(() => {
    vi.useFakeTimers();
    const mm = mockMatchMedia(false);
    cleanups.push(mm.restore);
    const io = mockIntersectionObserver();
    cleanups.push(io.restore);
    const fonts = mockFonts();
    cleanups.push(fonts.restore);
    const win = mockWindowScrollTo();
    cleanups.push(win.restore);
    const clip = mockClipboard({ absent: true });
    cleanups.push(clip.restore);
  });

  afterEach(() => {
    while (cleanups.length) cleanups.pop()?.();
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("renders the preloader on initial mount", () => {
    const { container } = render(<PortfolioShell />);
    const preloader = container.querySelector("[data-preloader]");
    expect(preloader).not.toBeNull();
    expect(preloader?.className).toContain("opacity-100");
  });

  it("attaches scroll-lock listeners (wheel, touchmove, keydown, scroll) while loading", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    render(<PortfolioShell />);

    const events = addSpy.mock.calls.map(([e]) => e);
    expect(events).toContain("wheel");
    expect(events).toContain("touchmove");
    expect(events).toContain("keydown");
    expect(events).toContain("scroll");

    addSpy.mockRestore();
  });

  it("removes scroll-lock listeners once the 3.5s fallback flips loading to false", async () => {
    render(<PortfolioShell />);
    const removeSpy = vi.spyOn(window, "removeEventListener");

    await act(async () => {
      vi.advanceTimersByTime(3500);
      await Promise.resolve();
    });

    const events = removeSpy.mock.calls.map(([e]) => e);
    expect(events).toContain("wheel");
    expect(events).toContain("touchmove");
    expect(events).toContain("keydown");
    expect(events).toContain("scroll");

    removeSpy.mockRestore();
  });

  it("unmounts the preloader 700ms after the 3.5s fallback completes", async () => {
    const { container } = render(<PortfolioShell />);
    expect(container.querySelector("[data-preloader]")).not.toBeNull();

    await act(async () => {
      vi.advanceTimersByTime(3500);
      await Promise.resolve();
    });
    await act(async () => {
      vi.advanceTimersByTime(700);
      await Promise.resolve();
    });

    expect(container.querySelector("[data-preloader]")).toBeNull();
  });

  it("does not warn when unmounted before timers fire (active-flag cleanup)", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { unmount } = render(<PortfolioShell />);

    unmount();

    await act(async () => {
      vi.advanceTimersByTime(5000);
      await Promise.resolve();
    });

    const updateWarnings = errorSpy.mock.calls
      .map((c) => String(c[0] ?? ""))
      .filter((m) => /unmounted|memory leak/i.test(m));
    expect(updateWarnings).toEqual([]);

    errorSpy.mockRestore();
  });
});
