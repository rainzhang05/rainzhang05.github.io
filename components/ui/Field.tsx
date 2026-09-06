'use client';

import { useId, type ChangeEvent, type FocusEvent } from 'react';

interface FieldProps {
  label: string;
  name: string;
  value: string;
  error?: string | null;
  autoComplete?: string;
  type?: 'text' | 'email';
  rows?: number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

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
          aria-invalid={error ? true : undefined}
          onChange={onChange}
          onBlur={onBlur}
          className={control}
        />
      </div>
      {error ? (
        <p role="alert" className="text-caption text-clay">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  value,
  error,
  rows = 5,
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
          ' items-stretch py-2.5 ' +
          (error ? 'border-clay' : 'border-rule-strong focus-within:border-sage hover:border-ink-3')
        }
      >
        <textarea
          id={id}
          name={name}
          rows={rows}
          value={value}
          aria-invalid={error ? true : undefined}
          onChange={onChange}
          onBlur={onBlur}
          className={control + ' block resize-y leading-relaxed'}
        />
      </div>
      {error ? (
        <p role="alert" className="text-caption text-clay">
          {error}
        </p>
      ) : null}
    </div>
  );
}
