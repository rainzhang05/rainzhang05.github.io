import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ThemeScript } from "@/components/theme/ThemeScript";

function runScript(html: string) {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  new Function(html)();
}

describe("ThemeScript", () => {
  it("renders a <script> tag with the FOUC-prevention IIFE", () => {
    const { container } = render(<ThemeScript />);
    const script = container.querySelector("script");
    expect(script).not.toBeNull();
    const html = script?.innerHTML ?? "";
    expect(html).toContain("portfolio.theme");
    expect(html).toContain("localStorage.getItem");
    expect(html).toContain("setAttribute");
    expect(html).toContain("data-theme");
    expect(html).toContain('"light"');
    expect(html).toContain('"dark"');
  });

  it("applies data-theme=dark when localStorage holds 'dark'", () => {
    const { container } = render(<ThemeScript />);
    const html = container.querySelector("script")?.innerHTML ?? "";

    window.localStorage.setItem("portfolio.theme", "dark");
    runScript(html);

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("applies data-theme=light when localStorage holds 'light'", () => {
    const { container } = render(<ThemeScript />);
    const html = container.querySelector("script")?.innerHTML ?? "";

    window.localStorage.setItem("portfolio.theme", "light");
    runScript(html);

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("leaves data-theme unset when no preference is stored", () => {
    const { container } = render(<ThemeScript />);
    const html = container.querySelector("script")?.innerHTML ?? "";

    runScript(html);
    expect(document.documentElement.getAttribute("data-theme")).toBeNull();
  });

  it("ignores garbage values without throwing", () => {
    const { container } = render(<ThemeScript />);
    const html = container.querySelector("script")?.innerHTML ?? "";

    window.localStorage.setItem("portfolio.theme", "banana");
    expect(() => runScript(html)).not.toThrow();
    expect(document.documentElement.getAttribute("data-theme")).toBeNull();
  });

  it("swallows localStorage errors so the script never throws during boot", () => {
    const { container } = render(<ThemeScript />);
    const html = container.querySelector("script")?.innerHTML ?? "";

    const original = window.localStorage.getItem;
    window.localStorage.getItem = () => {
      throw new Error("nope");
    };
    try {
      expect(() => runScript(html)).not.toThrow();
    } finally {
      window.localStorage.getItem = original;
    }
  });
});
