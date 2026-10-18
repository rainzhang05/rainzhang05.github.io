import type { ReactNode } from 'react';

/**
 * A status, not a technology: words led by a small sage dot, with no fill and
 * no outline, so it reads apart from the outlined TechTag pills it sits near
 * and adds nothing to the page but the one accent it already has.
 */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="no-copy inline-flex items-center gap-1.5 whitespace-nowrap text-caption font-medium text-ink-2">
      <span aria-hidden="true" className="h-1.5 w-1.5 flex-none rounded-pill bg-sage" />
      {children}
    </span>
  );
}
