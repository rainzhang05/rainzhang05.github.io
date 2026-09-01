"use client";

import { Icon } from "@/components/atoms/Icon";
import { useCopy } from "@/lib/i18n/LocaleProvider";
import type { ThemeMode } from "@/lib/types";

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const copy = useCopy();

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={theme === "dark" ? copy.theme.toLight : copy.theme.toDark}
      className="w-[34px] h-[28px] shrink-0 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
    >
      <Icon name={theme === "dark" ? "moon" : "sun"} size={13} />
    </button>
  );
}
