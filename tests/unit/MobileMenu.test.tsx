import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MobileMenu } from "@/components/chrome/MobileMenu";
import { NAV_ITEMS } from "@/lib/data/nav";

function noopJump() {
  return (e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault();
}

describe("MobileMenu", () => {
  it("renders every NAV_ITEMS entry as a hash anchor when open", () => {
    render(
      <MobileMenu open={true} onClose={vi.fn()} activeSection="intro" onJump={noopJump} />
    );
    NAV_ITEMS.forEach((item) => {
      const link = screen.getByRole("link", { name: item.label });
      expect(link).toHaveAttribute("href", `#${item.id}`);
    });
  });

  it("highlights the active section", () => {
    render(
      <MobileMenu open={true} onClose={vi.fn()} activeSection="projects" onJump={noopJump} />
    );
    expect(screen.getByRole("link", { name: "Projects" }).className).toContain(
      "bg-[var(--surface-2)]"
    );
  });

  it("close button click invokes onClose", () => {
    const onClose = vi.fn();
    render(
      <MobileMenu open={true} onClose={onClose} activeSection="intro" onJump={noopJump} />
    );
    fireEvent.click(screen.getByLabelText("Close menu"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("backdrop click invokes onClose", () => {
    const onClose = vi.fn();
    const { container } = render(
      <MobileMenu open={true} onClose={onClose} activeSection="intro" onJump={noopJump} />
    );
    const backdrop = container.querySelector(".bg-black\\/40") as HTMLElement;
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Escape key closes the menu only when open", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <MobileMenu open={false} onClose={onClose} activeSection="intro" onJump={noopJump} />
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();

    rerender(
      <MobileMenu open={true} onClose={onClose} activeSection="intro" onJump={noopJump} />
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("locks background scroll via preventDefault on wheel and touchmove while open", () => {
    const { rerender } = render(
      <MobileMenu open={true} onClose={vi.fn()} activeSection="intro" onJump={noopJump} />
    );

    const wheel = new Event("wheel", { cancelable: true });
    window.dispatchEvent(wheel);
    expect(wheel.defaultPrevented).toBe(true);

    const touch = new Event("touchmove", { cancelable: true });
    window.dispatchEvent(touch);
    expect(touch.defaultPrevented).toBe(true);

    rerender(
      <MobileMenu open={false} onClose={vi.fn()} activeSection="intro" onJump={noopJump} />
    );

    const wheel2 = new Event("wheel", { cancelable: true });
    window.dispatchEvent(wheel2);
    expect(wheel2.defaultPrevented).toBe(false);
  });

  it("detaches scroll-lock listeners on unmount", () => {
    const { unmount } = render(
      <MobileMenu open={true} onClose={vi.fn()} activeSection="intro" onJump={noopJump} />
    );
    unmount();

    const wheel = new Event("wheel", { cancelable: true });
    window.dispatchEvent(wheel);
    expect(wheel.defaultPrevented).toBe(false);
  });
});
