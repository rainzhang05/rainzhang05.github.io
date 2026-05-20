import type { ReactNode } from "react";

interface MicroLabelProps {
  children: ReactNode;
  className?: string;
}

export function MicroLabel({ children, className = "" }: MicroLabelProps) {
  return (
    <div
      className={`font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)] ${className}`}
    >
      {children}
    </div>
  );
}
