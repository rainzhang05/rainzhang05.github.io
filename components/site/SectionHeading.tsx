import type { ReactNode } from 'react';

/** Section marker on the hairline that opens every section. */
export function SectionHeading({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <div className="border-b border-rule pb-3">
      <h2 id={id} className="m-0 text-label font-medium uppercase text-ink-3">
        {children}
      </h2>
    </div>
  );
}
