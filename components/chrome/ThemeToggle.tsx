"use client";

import { Icon } from "@/components/atoms/Icon";
import type { ThemeMode } from "@/lib/types";

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="w-[34px] h-[28px] rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
    >
      <Icon name={theme === "dark" ? "moon" : "sun"} size={13} />
    </button>
  );
}
