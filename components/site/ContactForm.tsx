'use client';

import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TextAreaField, TextField } from '@/components/ui/Field';
import { site } from '@/lib/site';
import type { Copy } from '@/lib/types';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = { name: '', email: '', message: '' };

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Posts to Formspree as JSON, with the same protections as the previous site:
 * a honeypot field bots fill in, a 15 second abort so a hanging request never
 * leaves the button spinning, and status text in an aria-live region.
 *
 * Nothing is marked wrong until Send has been pressed. Colouring a field red
 * for being empty while someone is still filling the form in is a complaint
 * about work in progress; after the first attempt the errors do follow every
 * keystroke, so a correction clears as soon as it is made.
 */
export function ContactForm({ copy }: { copy: Copy['contact']['form'] }) {
  const [values, setValues] = useState(EMPTY);
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const honeypot = useRef('');

  const errors = {
    name: values.name.trim() ? null : copy.required,
    email: !values.email.trim()
      ? copy.required
      : EMAIL.test(values.email)
        ? null
        : copy.invalidEmail,
    message: values.message.trim() ? null : copy.required,
  };

  const shown = (key: keyof typeof errors) => (attempted ? errors[key] : null);
  const change =
    (key: keyof typeof EMPTY) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAttempted(true);
    if (errors.name || errors.email || errors.message) return;

    setStatus('sending');

    // A filled honeypot means a bot: pretend to succeed, send nothing.
    if (honeypot.current) {
      setStatus('sent');
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), site.formTimeoutMs);

    try {
      const response = await fetch(site.formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
        signal: controller.signal,
      });
      setStatus(response.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    } finally {
      clearTimeout(timer);
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" aria-live="polite" className="py-2">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-pill bg-sage-tint text-sage-strong">
          <Icon name="check" size={20} />
        </div>
        <h3 className="mb-1 mt-4 text-heading font-medium">{copy.sentTitle}</h3>
        <p className="m-0 max-w-measure text-body-15 text-ink-2">{copy.sentBody}</p>
        <div className="mt-5">
          <Button
            variant="quiet"
            size="sm"
            onClick={() => {
              setValues(EMPTY);
              setAttempted(false);
              setStatus('idle');
            }}
          >
            {copy.another}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate aria-busy={status === 'sending'} className="grid gap-4">
      <input
        type="text"
        name="confirm_username"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        onChange={(e) => {
          honeypot.current = e.target.value;
        }}
        className="absolute left-[-9999px] h-px w-px opacity-0"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label={copy.name}
          name="name"
          value={values.name}
          error={shown('name')}
          autoComplete="name"
          onChange={change('name')}
        />
        <TextField
          label={copy.email}
          name="email"
          type="email"
          value={values.email}
          error={shown('email')}
          autoComplete="email"
          onChange={change('email')}
        />
      </div>

      <TextAreaField
        label={copy.message}
        name="message"
        value={values.message}
        error={shown('message')}
        onChange={change('message')}
      />

      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          disabled={status === 'sending'}
          iconRight={<Icon name="arrow-right" size={16} />}
        >
          {status === 'sending' ? copy.sending : copy.submit}
        </Button>
        {status === 'error' ? (
          <span role="alert" className="text-caption text-clay">
            {copy.failed}
          </span>
        ) : null}
      </div>
    </form>
  );
}
