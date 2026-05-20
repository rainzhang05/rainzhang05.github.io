"use client";

import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import { useDsTheme } from "@/lib/hooks/useDsTheme";
import { DS_LINKS } from "@/lib/data/design-system";

export function DesignSystemHeader() {
  const [theme, toggle] = useDsTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_85%,transparent)] backdrop-blur-xl">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 lg:px-10 h-[60px]">
        <Link href="/" className="flex items-center gap-2 font-medium text-sm">
          <span className="inline-block w-2 h-2 rounded-sm bg-[var(--accent)]" />
          Rain Zhang · Design System
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {DS_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="text-sm px-3 py-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors px-3 py-1.5"
          >
            View prototype <Icon name="arrow-up-right" size={14} />
          </Link>
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="w-[34px] h-[28px] rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            <Icon name={theme === "dark" ? "moon" : "sun"} size={13} />
          </button>
        </div>
      </div>
    </header>
  );
}
