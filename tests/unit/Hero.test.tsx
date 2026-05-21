import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Hero } from "@/sections/portfolio/Hero";
import {
  mockClipboard,
  mockMatchMedia,
  mockWindowLocation,
} from "@/tests/setup/dom-mocks";

describe("Hero", () => {
  const cleanups: Array<() => void> = [];

  afterEach(() => {
    while (cleanups.length) cleanups.pop()?.();
    vi.useRealTimers();
  });

  it("renders headline, tags, and the resume CTA with external link attributes", () => {
    const mm = mockMatchMedia(false);
    cleanups.push(mm.restore);

    render(<Hero animate={false} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Rain/);
    expect(screen.getByText("Vancouver, BC")).toBeInTheDocument();
    expect(screen.getByText("Full-stack engineer")).toBeInTheDocument();

    const resume = screen.getByRole("link", { name: /Resume/i });
    expect(resume).toHaveAttribute("target", "_blank");
    expect(resume).toHaveAttribute("rel", "noopener noreferrer");
    expect(resume).toHaveAttribute("href", "/rain-zhang-resume.pdf");
  });

  it("hides staggered content until animate flips on", () => {
    const mm = mockMatchMedia(false);
    cleanups.push(mm.restore);

    const { container, rerender } = render(<Hero animate={false} />);
    const wrappersBefore = container.querySelectorAll(".opacity-0");
    expect(wrappersBefore.length).toBeGreaterThan(0);

    rerender(<Hero animate={true} />);
    expect(container.querySelectorAll(".opacity-0").length).toBe(0);
  });

  it("shows everything immediately when reduced motion is requested even if animate=false", () => {
    const mm = mockMatchMedia((q) => q === "(prefers-reduced-motion: reduce)");
    cleanups.push(mm.restore);

    const { container } = render(<Hero animate={false} />);
    expect(container.querySelectorAll(".opacity-0").length).toBe(0);
    // The transition string should be empty when reduced motion is on.
    expect(container.innerHTML).not.toContain("transition-all duration-1000");
  });

  it("copies the email to clipboard and shows the confirmation, then resets after 2s", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const mm = mockMatchMedia(false);
    cleanups.push(mm.restore);
    const clip = mockClipboard();
    cleanups.push(clip.restore);

    render(<Hero animate={true} />);
    const cta = screen.getByRole("link", { name: /Get in touch/i });

    await act(async () => {
      fireEvent.click(cta);
    });

    expect(clip.writeText).toHaveBeenCalledWith("rainzhang.zty@gmail.com");
    await waitFor(() => {
      expect(screen.getByText("Email copied!")).toBeInTheDocument();
    });

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.queryByText("Email copied!")).toBeNull();
  });

  it("falls back to window.location.href on clipboard rejection", async () => {
    const mm = mockMatchMedia(false);
    cleanups.push(mm.restore);
    const clip = mockClipboard({ shouldReject: true });
    cleanups.push(clip.restore);
    const loc = mockWindowLocation();
    cleanups.push(loc.restore);

    render(<Hero animate={true} />);
    const cta = screen.getByRole("link", { name: /Get in touch/i });
    await act(async () => {
      fireEvent.click(cta);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(loc.location.href).toBe("mailto:rainzhang.zty@gmail.com");
  });

  it("lets the default mailto: navigation happen when navigator.clipboard is absent", () => {
    const mm = mockMatchMedia(false);
    cleanups.push(mm.restore);
    const clip = mockClipboard({ absent: true });
    cleanups.push(clip.restore);

    render(<Hero animate={true} />);
    const cta = screen.getByRole("link", { name: /Get in touch/i });
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    cta.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });
});
