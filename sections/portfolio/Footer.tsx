"use client";

import type { MouseEvent } from "react";
import { Icon } from "@/components/atoms/Icon";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { FOOTER_ELSEWHERE, FOOTER_NAV } from "@/lib/data/nav";

export function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const onJump = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="pt-[calc(var(--gap-section)*0.45)] mt-[calc(var(--gap-section)*0.25)] border-t border-[var(--border)]">
      <div className="grid lg:grid-cols-[1.5fr_1fr_1fr] gap-10 lg:gap-16 pb-8">
        <div>
          <a
            href="#intro"
            onClick={onJump("intro")}
            className="inline-flex items-center gap-2 font-medium tracking-tight text-lg"
          >
            <span className="inline-block w-2 h-2 rounded-sm bg-[var(--accent)]" />
            Rain Zhang
          </a>
          <p className="mt-4 text-[var(--text-muted)] leading-relaxed max-w-sm text-[15px]">
            Full-stack engineer focused on shipping production systems end-to-end across modern
            stacks.
          </p>
          <a
            href="mailto:rainzhang.zty@gmail.com"
            className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--text)] hover:text-[var(--accent-strong)] transition-colors group"
          >
            <Icon name="mail" size={14} />
            <span className="font-mono">rainzhang.zty@gmail.com</span>
            <Icon
              name="arrow-up-right"
              size={12}
              className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"
            />
          </a>
        </div>

        <div>
          <MicroLabel className="mb-4">Navigate</MicroLabel>
          <ul className="grid grid-cols-2 gap-y-2.5 gap-x-4">
            {FOOTER_NAV.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={onJump(l.id)}
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <MicroLabel className="mb-4">Contact</MicroLabel>
          <ul className="space-y-2.5">
            {FOOTER_ELSEWHERE.map((l) => {
              const external = l.href.startsWith("http") || l.href.endsWith(".pdf");
              return (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group inline-flex items-center gap-2.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                  >
                    <Icon name={l.icon} size={14} />
                    <span>{l.label}</span>
                    <Icon
                      name="arrow-up-right"
                      size={11}
                      className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[var(--text-subtle)]"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-4 py-6 border-t border-[var(--border)]">
        <div className="flex flex-wrap items-center gap-3 text-[var(--text-subtle)] font-mono text-[11px]">
          <span>© {new Date().getFullYear()} Rain Zhang</span>
          <span className="opacity-40">·</span>
          <span>Designed &amp; built by Rain Zhang</span>
        </div>
        <button
          type="button"
          onClick={scrollTop}
          aria-label="Back to top"
          className="group inline-flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          <span className="font-mono uppercase tracking-[0.15em] text-[10px]">Back to top</span>
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-[var(--border)] group-hover:border-[var(--border-strong)] group-hover:bg-[var(--surface-2)] transition-colors">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:-translate-y-0.5"
              aria-hidden="true"
            >
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </svg>
          </span>
        </button>
      </div>
    </footer>
  );
}
