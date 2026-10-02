import type { ReactNode } from 'react';

/**
 * A status, not a technology: a filled pill with a small sage dot, so it reads
 * apart from the outlined TechTag pills it sits near.
 */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="no-copy inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-pill bg-surface px-[9px] text-[12.5px] font-medium text-ink-2">
      <span aria-hidden="true" className="h-1.5 w-1.5 flex-none rounded-full bg-sage" />
      {children}
    </span>
  );
}
