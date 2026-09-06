import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  tone?: 'accent' | 'ink';
  external?: boolean;
  children: ReactNode;
}

/** Text link. The accent colour lives here and nowhere else. */
export function TextLink({
  href,
  tone = 'accent',
  external,
  children,
  className = '',
  ...rest
}: TextLinkProps) {
  const colour =
    tone === 'accent'
      ? 'text-sage hover:text-sage-strong'
      : 'text-ink-2 hover:text-ink hover:decoration-rule-strong';

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={
        'inline-flex items-center gap-0.5 no-underline transition-colors duration-fast ease-out hover:underline hover:decoration-1 hover:underline-offset-2 ' +
        colour +
        (className ? ' ' + className : '')
      }
      {...rest}
    >
      <span>{children}</span>
      {external ? <Icon name="arrow-up-right" size={14} /> : null}
    </a>
  );
}
