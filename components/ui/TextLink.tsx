import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  tone?: 'accent' | 'ink';
  external?: boolean;
  children: ReactNode;
}

/**
 * Text link. The accent colour lives here and nowhere else.
 *
 * The underline is always drawn and only its colour changes: transparent at
 * rest, faded in with the text on hover and out again on leave. Switching the
 * line itself on and off is not animatable, so it used to snap in at the
 * text's full colour, fade to its lighter hover colour, and snap out again.
 * The hover variants of the offset and thickness are there to outrank the
 * a:hover rule in globals.css, which would otherwise move the line on hover.
 */
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
      ? 'text-sage hover:text-sage-strong hover:decoration-sage-strong'
      : 'text-ink-2 hover:text-ink hover:decoration-rule-strong';

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={
        'inline-flex items-center gap-0.5 underline decoration-transparent decoration-1 underline-offset-2 transition-colors duration-fast ease-out hover:decoration-1 hover:underline-offset-2 ' +
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
