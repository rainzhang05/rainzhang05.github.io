import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { mockIntersectionObserver, mockMatchMedia } from "@/tests/setup/dom-mocks";

describe("ScrollReveal", () => {
  const cleanups: Array<() => void> = [];

  afterEach(() => {
    while (cleanups.length) cleanups.pop()?.();
    vi.unstubAllGlobals();
  });

  it("reveals immediately and skips the observer when reduced motion is requested", () => {
    const mm = mockMatchMedia((q) => q === "(prefers-reduced-motion: reduce)");
    cleanups.push(mm.restore);
    const io = mockIntersectionObserver();
    cleanups.push(io.restore);

    const { container } = render(
      <ScrollReveal>
        <span>content</span>
      </ScrollReveal>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("opacity-100");
    expect(io.instances().length).toBe(0);
  });

  it("starts hidden then reveals when the observer fires, disconnecting afterwards", () => {
    const mm = mockMatchMedia(false);
    cleanups.push(mm.restore);
    const io = mockIntersectionObserver();
    cleanups.push(io.restore);

    const { container } = render(
      <ScrollReveal>
        <span>content</span>
      </ScrollReveal>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("opacity-0");

    act(() => {
      io.trigger([{ isIntersecting: true }]);
    });
    expect(wrapper.className).toContain("opacity-100");
    const [instance] = io.instances();
    expect(instance.disconnect).toHaveBeenCalled();
  });

  it("falls back to immediate reveal when IntersectionObserver is unavailable", () => {
    const mm = mockMatchMedia(false);
    cleanups.push(mm.restore);
    vi.stubGlobal("IntersectionObserver", undefined);

    const { container } = render(
      <ScrollReveal>
        <span>content</span>
      </ScrollReveal>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("opacity-100");
  });

  it("applies the delay prop as transitionDelay", () => {
    const mm = mockMatchMedia(false);
    cleanups.push(mm.restore);
    const io = mockIntersectionObserver();
    cleanups.push(io.restore);

    const { container } = render(
      <ScrollReveal delay={400}>
        <span>content</span>
      </ScrollReveal>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.transitionDelay).toBe("400ms");
  });
});
