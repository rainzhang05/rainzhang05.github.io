import type { ReactNode } from "react";

interface MicroLabelProps {
  children: ReactNode;
  className?: string;
}

export function MicroLabel({ children, className = "" }: MicroLabelProps) {
  return (
    <div
      className={`font-[family-name:var(--label-font)] text-[10px] tracking-[var(--label-tracking)] [text-transform:var(--label-transform)] text-[var(--text-subtle)] ${className}`}
    >
      {children}
    </div>
  );
}
