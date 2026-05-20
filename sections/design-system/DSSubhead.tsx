import type { ReactNode } from "react";

export function DSSubhead({ children }: { children: ReactNode }) {
  return (
    <h4 className="font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--text-muted)]">
      {children}
    </h4>
  );
}
