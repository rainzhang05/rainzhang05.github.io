import type { ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
  kicker?: ReactNode;
}

export function SectionTitle({ children, kicker }: SectionTitleProps) {
  return (
    <div className="mb-10">
      <h2 className="text-[clamp(2rem,4.2vw,3.25rem)] tracking-[-0.02em] font-medium leading-[1.05] text-[var(--text)]">
        {children}
      </h2>
      {kicker && (
        <p className="mt-3 text-[var(--text-muted)] text-base max-w-2xl">{kicker}</p>
      )}
    </div>
  );
}
