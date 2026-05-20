import type { ReactNode } from "react";

type Tone = "default" | "accent" | "ghost" | "solid";

const TAG_TONES: Record<Tone, string> = {
  default: "bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]",
  accent:
    "bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[var(--accent-strong)] border border-[color-mix(in_oklab,var(--accent)_22%,transparent)]",
  ghost: "text-[var(--text-muted)] border border-[var(--border)]",
  solid: "bg-[var(--text)] text-[var(--bg)] border border-transparent",
};

interface TagProps {
  children: ReactNode;
  mono?: boolean;
  tone?: Tone;
  className?: string;
}

export function Tag({ children, mono = false, tone = "default", className = "" }: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] px-2 py-[3px] rounded-[calc(var(--r-sm)*1px)] ${
        TAG_TONES[tone] || TAG_TONES.default
      } ${mono ? "font-mono" : "font-sans"} ${className}`}
    >
      {children}
    </span>
  );
}
