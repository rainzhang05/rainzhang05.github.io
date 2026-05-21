import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useDsTheme } from "@/lib/hooks/useDsTheme";
import { mockMatchMedia } from "@/tests/setup/dom-mocks";

describe("useDsTheme", () => {
  const cleanups: Array<() => void> = [];

  afterEach(() => {
    while (cleanups.length) cleanups.pop()?.();
  });

  it("initialises to 'light' when prefers-color-scheme does not match dark", () => {
    const mm = mockMatchMedia(false);
    cleanups.push(mm.restore);

    const { result } = renderHook(() => useDsTheme());
    expect(result.current[0]).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("initialises to 'dark' when prefers-color-scheme: dark matches", () => {
    const mm = mockMatchMedia((q) => q === "(prefers-color-scheme: dark)");
    cleanups.push(mm.restore);

    const { result } = renderHook(() => useDsTheme());
    expect(result.current[0]).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("toggling flips theme and updates the data-theme attribute", () => {
    const mm = mockMatchMedia(false);
    cleanups.push(mm.restore);

    const { result } = renderHook(() => useDsTheme());
    expect(result.current[0]).toBe("light");

    act(() => result.current[1]());
    expect(result.current[0]).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    act(() => result.current[1]());
    expect(result.current[0]).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("never persists the theme to localStorage", () => {
    const mm = mockMatchMedia(false);
    cleanups.push(mm.restore);

    const { result } = renderHook(() => useDsTheme());
    act(() => result.current[1]());
    act(() => result.current[1]());

    expect(window.localStorage.getItem("portfolio.theme")).toBeNull();
  });
});
