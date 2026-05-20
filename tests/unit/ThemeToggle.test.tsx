import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";

describe("ThemeToggle", () => {
  it("calls onToggle when clicked", () => {
    const onToggle = vi.fn();
    render(<ThemeToggle theme="light" onToggle={onToggle} />);
    fireEvent.click(screen.getByLabelText("Switch to dark mode"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("flips its aria-label based on current theme", () => {
    const { rerender } = render(<ThemeToggle theme="light" onToggle={vi.fn()} />);
    expect(screen.getByLabelText("Switch to dark mode")).toBeInTheDocument();
    rerender(<ThemeToggle theme="dark" onToggle={vi.fn()} />);
    expect(screen.getByLabelText("Switch to light mode")).toBeInTheDocument();
  });
});
