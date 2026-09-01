"use client";

import { useState, type MouseEvent } from "react";
import { Icon } from "@/components/atoms/Icon";
import { LocaleToggle } from "@/components/chrome/LocaleToggle";
import { MobileMenu } from "@/components/chrome/MobileMenu";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { useContent, useCopy } from "@/lib/i18n/LocaleProvider";
import { smoothScrollTo } from "@/lib/utils/smoothScroll";
import type { ThemeMode } from "@/lib/types";

interface NavProps {
  activeSection: string;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function Nav({ activeSection, theme, onToggleTheme }: NavProps) {
  const [open, setOpen] = useState(false);
  const copy = useCopy();
  const { navItems } = useContent();

  const onJump = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    smoothScrollTo(id);
    setOpen(false);
  };

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-40 flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] backdrop-blur-xl px-3 py-2 shadow-[0_1px_0_color-mix(in_oklab,white_50%,transparent)_inset,0_12px_30px_-12px_rgba(0,0,0,0.25)]">
          <a
            href="#intro"
            onClick={onJump("intro")}
            className="flex items-center gap-2 px-2 sm:px-3 py-1.5 font-medium tracking-tight text-[15px] shrink-0"
          >
            <span className="inline-block w-2 h-2 rounded-sm bg-[var(--accent)] shrink-0" />
            Rain Zhang
          </a>
          <span className="w-px h-4 bg-[var(--border)] shrink-0" aria-hidden="true" />
          <nav className="hidden md:flex items-center" aria-label={copy.nav.sectionsLabel}>
            {navItems.slice(1).map((it) => (
              <a
                key={it.id}
                href={`#${it.id}`}
                onClick={onJump(it.id)}
                className={`text-sm px-[var(--nav-link-px)] py-2 rounded-full transition-colors whitespace-nowrap ${
                  activeSection === it.id
                    ? "text-[var(--text)] bg-[var(--surface-2)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {it.label}
              </a>
            ))}
          </nav>
          <span
            className="hidden md:inline-block w-px h-4 bg-[var(--border)] shrink-0"
            aria-hidden="true"
          />
          <LocaleToggle />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={copy.nav.openMenu}
            className="md:hidden p-2 shrink-0 text-[var(--text-muted)]"
          >
            <Icon name="menu" size={18} />
          </button>
        </div>
      </header>
      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        activeSection={activeSection}
        onJump={onJump}
      />
    </>
  );
}
