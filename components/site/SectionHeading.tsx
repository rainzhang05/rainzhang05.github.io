import type { ReactNode } from 'react';

/**
 * The label that opens every section. On the home page it stands on space
 * alone, the way the intro's eyebrow does; `rule` puts it on a hairline, which
 * the resume keeps because it is set like the printed document.
 */
export function SectionHeading({
  id,
  rule = false,
  children,
}: {
  id?: string;
  rule?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={rule ? 'border-b border-rule pb-3' : 'pb-heading-space'}>
      <h2 id={id} className="m-0 text-label font-medium uppercase text-ink-3">
        {children}
      </h2>
    </div>
  );
}
