import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { scrollToProject, smoothScrollTo } from "@/lib/utils/smoothScroll";
import { mockScrollIntoView, mockWindowScrollTo } from "@/tests/setup/dom-mocks";

describe("smoothScrollTo", () => {
  let scrollSpy: ReturnType<typeof mockScrollIntoView>;

  beforeEach(() => {
    scrollSpy = mockScrollIntoView();
  });

  afterEach(() => {
    scrollSpy.restore();
    document.body.innerHTML = "";
  });

  it("calls scrollIntoView with smooth behavior on the matching element", () => {
    const target = document.createElement("section");
    target.id = "about";
    document.body.appendChild(target);

    smoothScrollTo("about");

    expect(scrollSpy.spy).toHaveBeenCalledTimes(1);
    expect(scrollSpy.spy).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });

  it("is a no-op when no element matches the id", () => {
    smoothScrollTo("does-not-exist");
    expect(scrollSpy.spy).not.toHaveBeenCalled();
  });
});

describe("scrollToProject", () => {
  let winSpy: ReturnType<typeof mockWindowScrollTo>;
  const originalScrollY = window.scrollY;

  beforeEach(() => {
    winSpy = mockWindowScrollTo();
  });

  afterEach(() => {
    winSpy.restore();
    document.body.innerHTML = "";
    Object.defineProperty(window, "scrollY", {
      value: originalScrollY,
      configurable: true,
      writable: true,
    });
  });

  function placeProject(id: string, rectTop: number) {
    const el = document.createElement("article");
    el.id = `project-${id}`;
    el.getBoundingClientRect = () =>
      ({ top: rectTop, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON() {} }) as DOMRect;
    document.body.appendChild(el);
    return el;
  }

  it("computes top from getBoundingClientRect, window.scrollY, and the default 90px offset", () => {
    placeProject("foo", 200);
    Object.defineProperty(window, "scrollY", {
      value: 50,
      configurable: true,
      writable: true,
    });

    scrollToProject("foo");

    expect(winSpy.spy).toHaveBeenCalledWith({ top: 200 + 50 - 90, behavior: "smooth" });
  });

  it("honors a custom offset", () => {
    placeProject("bar", 100);
    Object.defineProperty(window, "scrollY", {
      value: 0,
      configurable: true,
      writable: true,
    });

    scrollToProject("bar", 30);

    expect(winSpy.spy).toHaveBeenCalledWith({ top: 70, behavior: "smooth" });
  });

  it("is a no-op when no matching project element exists", () => {
    scrollToProject("missing");
    expect(winSpy.spy).not.toHaveBeenCalled();
  });
});
