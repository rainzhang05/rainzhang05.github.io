import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CursorGlow } from "@/components/chrome/CursorGlow";
import { mockRaf } from "@/tests/setup/dom-mocks";

describe("CursorGlow", () => {
  const cleanups: Array<() => void> = [];

  afterEach(() => {
    while (cleanups.length) cleanups.pop()?.();
  });

  it("attaches a passive pointermove listener on mount", () => {
    const raf = mockRaf();
    cleanups.push(raf.restore);
    const addSpy = vi.spyOn(window, "addEventListener");
    cleanups.push(() => addSpy.mockRestore());

    render(<CursorGlow />);

    const pointermoveCall = addSpy.mock.calls.find(
      ([event]) => event === "pointermove"
    );
    expect(pointermoveCall).toBeDefined();
    expect(pointermoveCall?.[2]).toMatchObject({ passive: true });
  });

  it("sets --mx/--my CSS variables after a pointermove + RAF flush", () => {
    const raf = mockRaf();
    cleanups.push(raf.restore);

    const { container } = render(<CursorGlow />);
    const wrapper = container.firstChild as HTMLElement;

    const event = new Event("pointermove") as PointerEvent;
    Object.assign(event, { clientX: 120, clientY: 240 });
    window.dispatchEvent(event);
    raf.flush();

    expect(wrapper.style.getPropertyValue("--mx")).toBe("120px");
    expect(wrapper.style.getPropertyValue("--my")).toBe("240px");
  });

  it("cancels the prior RAF on a subsequent pointermove so the last move wins", () => {
    const raf = mockRaf();
    cleanups.push(raf.restore);

    const { container } = render(<CursorGlow />);
    const wrapper = container.firstChild as HTMLElement;

    const first = new Event("pointermove") as PointerEvent;
    Object.assign(first, { clientX: 10, clientY: 20 });
    window.dispatchEvent(first);

    const second = new Event("pointermove") as PointerEvent;
    Object.assign(second, { clientX: 30, clientY: 40 });
    window.dispatchEvent(second);

    expect(raf.caf).toHaveBeenCalled();

    raf.flush();
    expect(wrapper.style.getPropertyValue("--mx")).toBe("30px");
    expect(wrapper.style.getPropertyValue("--my")).toBe("40px");
  });

  it("removes the listener and cancels any pending RAF on unmount", () => {
    const raf = mockRaf();
    cleanups.push(raf.restore);
    const removeSpy = vi.spyOn(window, "removeEventListener");
    cleanups.push(() => removeSpy.mockRestore());

    const { unmount } = render(<CursorGlow />);

    const move = new Event("pointermove") as PointerEvent;
    Object.assign(move, { clientX: 1, clientY: 2 });
    window.dispatchEvent(move);

    unmount();
    expect(
      removeSpy.mock.calls.some(([event]) => event === "pointermove")
    ).toBe(true);
    expect(raf.caf).toHaveBeenCalled();
  });

  it("renders a fixed pointer-events-none aria-hidden wrapper", () => {
    const { container } = render(<CursorGlow />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.getAttribute("aria-hidden")).toBe("true");
    expect(wrapper.className).toContain("fixed");
    expect(wrapper.className).toContain("pointer-events-none");
  });
});
