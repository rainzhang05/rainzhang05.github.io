import type { ReactNode } from "react";

interface DSBlockProps {
  id: string;
  num: string;
  title: string;
  kicker: string;
  children: ReactNode;
}

export function DSBlock({ id, num, title, kicker, children }: DSBlockProps) {
  return (
    <section
      id={id}
      className="py-[var(--gap-section)] border-t border-[var(--border)] first:border-t-0"
    >
      <div className="flex items-baseline gap-3 mb-6">
        <span className="font-mono text-[11px] text-[var(--text-subtle)] tabular-nums">{num}</span>
        <span className="h-px w-8 bg-[var(--border)]" />
        <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--text-muted)]">
          {title}
        </span>
      </div>
      <h2 className="text-[clamp(2rem,4.2vw,3.25rem)] tracking-[-0.025em] font-medium leading-[1.05] mb-3">
        {title}
      </h2>
      <p className="text-[var(--text-muted)] text-base max-w-2xl mb-12">{kicker}</p>
      {children}
    </section>
  );
}
