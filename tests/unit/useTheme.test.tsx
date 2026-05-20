import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useTheme } from "@/lib/hooks/useTheme";

describe("useTheme", () => {
  it("initialises to light and writes light to localStorage on first mount", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current[0]).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(window.localStorage.getItem("portfolio.theme")).toBe("light");
  });

  it("syncs to whatever data-theme the ThemeScript already applied", () => {
    document.documentElement.setAttribute("data-theme", "dark");
    const { result } = renderHook(() => useTheme());
    expect(result.current[0]).toBe("dark");
  });

  it("toggling flips theme + persists it", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current[1]());
    expect(result.current[0]).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(window.localStorage.getItem("portfolio.theme")).toBe("dark");
    act(() => result.current[1]());
    expect(result.current[0]).toBe("light");
  });
});
