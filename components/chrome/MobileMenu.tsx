"use client";

import { useEffect, type MouseEvent } from "react";
import { Icon } from "@/components/atoms/Icon";
import { NAV_ITEMS } from "@/lib/data/nav";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  activeSection: string;
  onJump: (id: string) => (e: MouseEvent<HTMLAnchorElement>) => void;
}

export function MobileMenu({ open, onClose, activeSection, onJump }: MobileMenuProps) {
  // Close on Escape + lock background scroll while open. Uses the same
  // wheel/touchmove preventDefault pattern as the preloader (AGENTS.md forbids
  // overflow:hidden on body — caused a layout-shift incident).
  useEffect(() => {
    if (!open) return;

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };

    window.addEventListener("keydown", onKeydown);
    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });

    return () => {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
    };
  }, [open, onClose]);

  return (
    <div
      className={`md:hidden fixed inset-0 z-50 transition-opacity ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`absolute top-4 left-4 right-4 rounded-[calc(var(--r-md)*1px)] bg-[var(--surface)] border border-[var(--border)] p-4 transition-transform ${
          open ? "translate-y-0" : "-translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-1 text-[var(--text-muted)]"
          >
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="grid gap-1">
          {NAV_ITEMS.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              onClick={onJump(it.id)}
              className={`text-base px-3 py-2 rounded-[calc(var(--r-sm)*1px)] ${
                activeSection === it.id
                  ? "bg-[var(--surface-2)] text-[var(--text)]"
                  : "text-[var(--text-muted)]"
              }`}
            >
              {it.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
