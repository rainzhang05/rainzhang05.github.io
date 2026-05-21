import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, type Mock } from "vitest";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { mockMatchMedia } from "@/tests/setup/dom-mocks";

describe("useReducedMotion", () => {
  const cleanups: Array<() => void> = [];

  afterEach(() => {
    while (cleanups.length) cleanups.pop()?.();
  });

  it("returns false when window.matchMedia is unavailable", () => {
    const original = window.matchMedia;
    Object.defineProperty(window, "matchMedia", {
      value: undefined,
      configurable: true,
      writable: true,
    });
    cleanups.push(() => {
      Object.defineProperty(window, "matchMedia", {
        value: original,
        configurable: true,
        writable: true,
      });
    });

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("returns false when the query does not match", () => {
    const mm = mockMatchMedia(false);
    cleanups.push(mm.restore);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("returns true when prefers-reduced-motion matches", () => {
    const mm = mockMatchMedia(true);
    cleanups.push(mm.restore);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it("re-renders when the MediaQueryList fires `change`", () => {
    const mm = mockMatchMedia(false);
    cleanups.push(mm.restore);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      mm.dispatch(true);
    });
    expect(result.current).toBe(true);

    act(() => {
      mm.dispatch(false);
    });
    expect(result.current).toBe(false);
  });

  it("falls back to legacy addListener/removeListener when addEventListener is absent", () => {
    const mm = mockMatchMedia(false, { legacy: true });
    cleanups.push(mm.restore);

    const { result, unmount } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      mm.dispatch(true);
    });
    expect(result.current).toBe(true);

    const mqls = mm.spy.mock.results.map((r) => r.value as MediaQueryList);
    expect(mqls.some((mql) => (mql.addListener as unknown as Mock).mock.calls.length > 0)).toBe(
      true
    );
    unmount();
    expect(
      mqls.some((mql) => (mql.removeListener as unknown as Mock).mock.calls.length > 0)
    ).toBe(true);
  });
});
