import type { ElementType, HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  as?: ElementType;
}

export function Card({
  children,
  className = "",
  interactive = false,
  as: As = "div",
  ...rest
}: CardProps) {
  return (
    <As
      className={`relative rounded-[calc(var(--r-md)*1px)] border border-[var(--border)] bg-[var(--surface)] ${
        interactive
          ? "transition-all duration-300 ease-out hover:border-[var(--border-strong)] hover:-translate-y-[1px] hover:shadow-[0_1px_0_var(--border)_inset,0_18px_40px_-24px_rgba(0,0,0,0.25)]"
          : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </As>
  );
}
