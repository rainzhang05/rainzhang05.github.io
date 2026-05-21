import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Footer } from "@/sections/portfolio/Footer";
import { FOOTER_ELSEWHERE, FOOTER_NAV } from "@/lib/data/nav";
import {
  mockClipboard,
  mockScrollIntoView,
  mockWindowLocation,
  mockWindowScrollTo,
} from "@/tests/setup/dom-mocks";

describe("Footer", () => {
  const cleanups: Array<() => void> = [];

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date("2026-05-20"));
  });

  afterEach(() => {
    while (cleanups.length) cleanups.pop()?.();
    vi.useRealTimers();
  });

  it("renders the dynamic copyright year from Date.getFullYear()", () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026 Rain Zhang/)).toBeInTheDocument();
  });

  it("renders every FOOTER_NAV link with a hash href", () => {
    render(<Footer />);
    FOOTER_NAV.forEach((l) => {
      const link = screen.getByRole("link", { name: l.label });
      expect(link).toHaveAttribute("href", `#${l.id}`);
    });
  });

  it("adds target=_blank rel=noopener noreferrer to external links and resume PDF", () => {
    render(<Footer />);
    FOOTER_ELSEWHERE.forEach((l) => {
      if (l.href.startsWith("mailto:")) return;
      const link = screen.getByRole("link", { name: new RegExp(l.label, "i") });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("does not add target=_blank to the email FooterEmailLink", () => {
    render(<Footer />);
    const email = screen.getByRole("link", { name: /^Email/ });
    expect(email).not.toHaveAttribute("target");
  });

  it("copies the email and resets the label after 2 seconds (main email link)", async () => {
    const clip = mockClipboard();
    cleanups.push(clip.restore);

    render(<Footer />);
    const mainEmail = screen.getByRole("link", { name: /rainzhang\.zty@gmail\.com/i });

    await act(async () => {
      fireEvent.click(mainEmail);
      await Promise.resolve();
    });

    expect(clip.writeText).toHaveBeenCalledWith("rainzhang.zty@gmail.com");
    await waitFor(() => {
      expect(screen.getByText("Email copied!")).toBeInTheDocument();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.queryByText("Email copied!")).toBeNull();
  });

  it("falls back to window.location.href on clipboard rejection", async () => {
    const clip = mockClipboard({ shouldReject: true });
    cleanups.push(clip.restore);
    const loc = mockWindowLocation();
    cleanups.push(loc.restore);

    render(<Footer />);
    const email = screen.getByRole("link", { name: /^Email/ });
    await act(async () => {
      fireEvent.click(email);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(loc.location.href).toBe("mailto:rainzhang.zty@gmail.com");
  });

  it("lets the default mailto: navigation happen when navigator.clipboard is absent", () => {
    const clip = mockClipboard({ absent: true });
    cleanups.push(clip.restore);

    render(<Footer />);
    const email = screen.getByRole("link", { name: /^Email/ });
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    email.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it("scrolls to top when the back-to-top button is clicked", () => {
    const win = mockWindowScrollTo();
    cleanups.push(win.restore);

    render(<Footer />);
    fireEvent.click(screen.getByLabelText("Back to top"));
    expect(win.spy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("smooth-scrolls the matching section when a footer nav anchor is clicked", () => {
    const scroll = mockScrollIntoView();
    cleanups.push(scroll.restore);

    const about = document.createElement("section");
    about.id = "about";
    document.body.appendChild(about);
    cleanups.push(() => about.remove());

    render(<Footer />);
    fireEvent.click(screen.getByRole("link", { name: "About" }));
    expect(scroll.spy).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });
});
