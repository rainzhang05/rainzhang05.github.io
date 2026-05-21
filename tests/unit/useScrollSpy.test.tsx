import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";
import { NAV_ITEMS } from "@/lib/data/nav";
import { mockIntersectionObserver } from "@/tests/setup/dom-mocks";

describe("useScrollSpy", () => {
  let controller: ReturnType<typeof mockIntersectionObserver>;
  const addedIds: string[] = [];

  beforeEach(() => {
    controller = mockIntersectionObserver();
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.createElement("section");
      el.id = id;
      document.body.appendChild(el);
      addedIds.push(id);
    });
  });

  afterEach(() => {
    controller.restore();
    while (addedIds.length) {
      const id = addedIds.pop()!;
      document.getElementById(id)?.remove();
    }
  });

  it("defaults to 'intro' before any intersection entries fire", () => {
    const { result } = renderHook(() => useScrollSpy());
    expect(result.current).toBe("intro");
  });

  it("updates activeId to the section that fired an intersection", () => {
    const { result } = renderHook(() => useScrollSpy());
    const about = document.getElementById("about")!;
    act(() => {
      controller.trigger([
        { target: about, isIntersecting: true, intersectionRatio: 0.6 },
      ]);
    });
    expect(result.current).toBe("about");
  });

  it("picks the entry with the highest intersectionRatio when multiple sections are visible", () => {
    const { result } = renderHook(() => useScrollSpy());
    const experience = document.getElementById("experience")!;
    const projects = document.getElementById("projects")!;
    act(() => {
      controller.trigger([
        { target: experience, isIntersecting: true, intersectionRatio: 0.3 },
        { target: projects, isIntersecting: true, intersectionRatio: 0.8 },
      ]);
    });
    expect(result.current).toBe("projects");
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = renderHook(() => useScrollSpy());
    const [instance] = controller.instances();
    expect(instance).toBeDefined();
    unmount();
    expect(instance.disconnect).toHaveBeenCalled();
  });

  it("observes every NAV_ITEMS section that exists in the DOM", () => {
    renderHook(() => useScrollSpy());
    const [instance] = controller.instances();
    expect(instance.observed.length).toBe(NAV_ITEMS.length);
  });

  it("uses an IntersectionObserver configured for mid-viewport detection", () => {
    renderHook(() => useScrollSpy());
    const [instance] = controller.instances();
    expect(instance.options?.rootMargin).toBe("-30% 0px -55% 0px");
    expect(instance.options?.threshold).toEqual([0, 0.25, 0.5, 1]);
  });
});
