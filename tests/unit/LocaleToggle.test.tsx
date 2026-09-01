import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { LocaleToggle } from "@/components/chrome/LocaleToggle";
import { LOCALE_COOKIE } from "@/lib/i18n/config";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";

describe("LocaleToggle", () => {
  it("links to both locales with matching hreflang", () => {
    render(<LocaleToggle />);

    const en = screen.getByRole("link", { name: "EN" });
    const ja = screen.getByRole("link", { name: "日本語" });

    expect(en).toHaveAttribute("href", "/");
    expect(en).toHaveAttribute("hreflang", "en");
    expect(ja).toHaveAttribute("href", "/ja");
    expect(ja).toHaveAttribute("hreflang", "ja");
  });

  it("marks English current when no provider is present", () => {
    render(<LocaleToggle />);
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "日本語" })).not.toHaveAttribute("aria-current");
  });

  it("marks Japanese current inside a ja provider", () => {
    render(
      <LocaleProvider locale="ja">
        <LocaleToggle />
      </LocaleProvider>
    );
    expect(screen.getByRole("link", { name: "日本語" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "EN" })).not.toHaveAttribute("aria-current");
  });

  it("exposes a labelled group for assistive tech", () => {
    const { rerender } = render(<LocaleToggle />);
    expect(screen.getByRole("group", { name: "Language" })).toBeInTheDocument();

    rerender(
      <LocaleProvider locale="ja">
        <LocaleToggle />
      </LocaleProvider>
    );
    expect(screen.getByRole("group", { name: "表示言語" })).toBeInTheDocument();
  });

  it("writes the locale cookie when a language is chosen", () => {
    render(<LocaleToggle />);
    fireEvent.click(screen.getByRole("link", { name: "日本語" }));
    expect(document.cookie).toContain(`${LOCALE_COOKIE}=ja`);

    fireEvent.click(screen.getByRole("link", { name: "EN" }));
    expect(document.cookie).toContain(`${LOCALE_COOKIE}=en`);
  });
});
