import type { ReactNode } from 'react';

/**
 * A status, not a technology: a filled pill with no outline, so it reads apart
 * from the outlined TechTag pills it sits near.
 */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="no-copy inline-flex h-6 items-center whitespace-nowrap rounded-pill bg-surface px-[9px] text-[12.5px] font-medium text-ink-2">
      {children}
    </span>
  );
}
