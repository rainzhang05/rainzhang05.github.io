'use client';

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  type ChangeEvent,
  type FocusEvent,
} from 'react';

interface FieldProps {
  label: string;
  name: string;
  value: string;
  error?: string | null;
  autoComplete?: string;
  type?: 'text' | 'email';
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Optional: the contact form validates on submit, not on blur. */
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const useBeforePaint = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const frame =
  'flex items-center gap-2 rounded-control border bg-sheet px-3 transition-colors duration-fast ease-out';
const control =
  'w-full min-w-0 flex-1 border-0 bg-transparent p-0 text-body-15 text-ink outline-none placeholder:text-ink-3';

export function TextField({
  label,
  name,
  value,
  error,
  autoComplete,
  type = 'text',
  required,
  disabled,
  onChange,
  onBlur,
}: FieldProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-caption font-medium text-ink-2">
        {label}
      </label>
      <div
        className={
          frame +
          ' h-10 ' +
          (error ? 'border-clay' : 'border-rule-strong focus-within:border-sage hover:border-ink-3')
        }
      >
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? id + '-error' : undefined}
          onChange={onChange}
          onBlur={onBlur}
          className={control}
        />
      </div>
      {error ? (
        <p id={id + '-error'} role="alert" className="text-caption text-clay">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * A message field that sizes itself. It cannot be dragged, and instead grows
 * with what is typed into it: `rows` is the height it starts at and never goes
 * below, and every line past that adds one. Measured before paint, so a new
 * line never shows a frame of scrollbar first, and again when the window
 * changes width, because the same text wraps onto a different number of lines.
 * Without JavaScript it is simply `rows` lines tall and scrolls.
 */
export function TextAreaField({
  label,
  name,
  value,
  error,
  rows = 5,
  required,
  disabled,
  onChange,
  onBlur,
}: FieldProps) {
  const id = useId();
  const ref = useRef<HTMLTextAreaElement>(null);

  useBeforePaint(() => {
    const el = ref.current;
    if (!el) return;
    // The scrollbar goes only once the height follows the text; with no
    // script to grow it, the field has to be able to scroll.
    el.style.overflowY = 'hidden';
    const fit = () => {
      el.style.height = 'auto';
      if (el.scrollHeight > 0) el.style.height = el.scrollHeight + 'px';
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [value]);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-caption font-medium text-ink-2">
        {label}
      </label>
      <div
        className={
          frame +
          ' items-stretch py-2.5 ' +
          (error ? 'border-clay' : 'border-rule-strong focus-within:border-sage hover:border-ink-3')
        }
      >
        <textarea
          ref={ref}
          id={id}
          name={name}
          rows={rows}
          value={value}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? id + '-error' : undefined}
          onChange={onChange}
          onBlur={onBlur}
          className={control + ' block resize-none leading-relaxed'}
        />
      </div>
      {error ? (
        <p id={id + '-error'} role="alert" className="text-caption text-clay">
          {error}
        </p>
      ) : null}
    </div>
  );
}
