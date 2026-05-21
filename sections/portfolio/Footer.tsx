"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { Icon } from "@/components/atoms/Icon";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { FOOTER_ELSEWHERE, FOOTER_NAV } from "@/lib/data/nav";
import type { IconName } from "@/lib/types";

function useCopiedReset(copied: boolean, reset: () => void) {
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(reset, 2000);
    return () => window.clearTimeout(id);
  }, [copied, reset]);
}

function copyEmail(
  e: React.MouseEvent<HTMLAnchorElement>,
  email: string,
  onCopied: () => void
) {
  // Without a clipboard API, let the default mailto: navigation happen.
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return;
  e.preventDefault();
  navigator.clipboard.writeText(email).then(onCopied, () => {
    // Clipboard rejected (permission, non-secure context). Fall back to mailto.
    window.location.href = `mailto:${email}`;
  });
}

function FooterEmailLink({ href, label, icon }: { href: string; label: string; icon: IconName }) {
  const [copied, setCopied] = useState(false);
  useCopiedReset(copied, () => setCopied(false));

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const email = href.replace("mailto:", "");
    copyEmail(e, email, () => setCopied(true));
  };

  return (
    <a
      href={href}
      onClick={handleEmailClick}
      className="group inline-flex items-center gap-2.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
    >
      <Icon name={icon} size={14} />
      <span aria-live="polite">{copied ? "Email copied!" : label}</span>
      {copied ? (
        <span className="text-[10px] bg-[var(--accent)] text-white px-1.5 py-0.5 rounded font-sans ml-1">
          Copied!
        </span>
      ) : (
        <Icon
          name="arrow-up-right"
          size={11}
          className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[var(--text-subtle)]"
        />
      )}
    </a>
  );
}

export function Footer() {
  const [copiedMain, setCopiedMain] = useState(false);
  useCopiedReset(copiedMain, () => setCopiedMain(false));

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const onJump = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleMainEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    copyEmail(e, "rainzhang.zty@gmail.com", () => setCopiedMain(true));
  };

  return (
    <footer className="pt-[calc(var(--gap-section)*0.25)] mt-[calc(var(--gap-section)*0.25)] border-t border-[var(--border)]">
      <div className="grid lg:grid-cols-[1.5fr_1fr_1fr] gap-10 lg:gap-16 pb-4">
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
            onClick={handleMainEmailClick}
            className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--text)] hover:text-[var(--accent-strong)] transition-colors group"
          >
            <Icon name="mail" size={14} />
            <span className="font-mono" aria-live="polite">
              {copiedMain ? "Email copied!" : "rainzhang.zty@gmail.com"}
            </span>
            {copiedMain ? (
              <span className="text-[10px] bg-[var(--accent)] text-white px-1.5 py-0.5 rounded font-sans ml-1">
                Copied!
              </span>
            ) : (
              <Icon
                name="arrow-up-right"
                size={12}
                className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"
              />
            )}
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
              const isEmail = l.href.startsWith("mailto:");
              return (
                <li key={l.label}>
                  {isEmail ? (
                    <FooterEmailLink href={l.href} label={l.label} icon={l.icon} />
                  ) : (
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
                  )}
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
