import type { ElementType, ReactNode } from 'react';

/**
 * The 12px tracked uppercase label that carries the whole layout.
 * The only uppercase type in the system.
 */
export function Eyebrow({ as: Tag = 'div', children }: { as?: ElementType; children: ReactNode }) {
  return <Tag className="text-label font-medium uppercase text-ink-3">{children}</Tag>;
}
