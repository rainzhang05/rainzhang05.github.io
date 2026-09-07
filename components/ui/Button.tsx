import type { ButtonHTMLAttributes, ReactNode } from 'react';

const SIZES = {
  sm: 'h-8 px-3.5 text-caption gap-1.5',
  md: 'h-10 px-[18px] text-body-14 gap-2',
} as const;

const VARIANTS = {
  primary: 'bg-ink text-paper border-transparent hover:bg-ink-hover active:bg-ink',
  secondary: 'bg-transparent text-ink border-rule hover:border-ink-3 active:bg-surface',
  quiet:
    'bg-transparent text-ink-2 border-transparent hover:bg-surface hover:text-ink active:bg-surface-2',
} as const;

interface CommonProps {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  icon?: ReactNode;
  iconRight?: ReactNode;
  children: ReactNode;
  className?: string;
}

const base =
  'no-copy inline-flex items-center justify-center whitespace-nowrap rounded-button border font-medium leading-none no-underline transition-colors duration-fast ease-out disabled:opacity-45 hover:no-underline';

function classes({ variant = 'primary', size = 'md', className = '' }: CommonProps) {
  return [base, SIZES[size], VARIANTS[variant], className].filter(Boolean).join(' ');
}

export function Button({
  variant,
  size,
  icon,
  iconRight,
  children,
  className,
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classes({ variant, size, children, className })} {...rest}>
      {icon}
      <span>{children}</span>
      {iconRight}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  icon,
  iconRight,
  children,
  className,
  href,
  external,
  download,
}: CommonProps & { href: string; external?: boolean; download?: boolean }) {
  return (
    <a
      href={href}
      download={download}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={classes({ variant, size, children, className })}
    >
      {icon}
      <span>{children}</span>
      {iconRight}
    </a>
  );
}
