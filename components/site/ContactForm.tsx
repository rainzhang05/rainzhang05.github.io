'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
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
  const [hydrated, setHydrated] = useState(false);
  const honeypot = useRef('');
  const activeRequest = useRef<{
    controller: AbortController;
    timer: ReturnType<typeof setTimeout>;
  } | null>(null);

  useEffect(() => {
    setHydrated(true);
    return () => {
      const request = activeRequest.current;
      activeRequest.current = null;
      if (request) {
        clearTimeout(request.timer);
        request.controller.abort();
      }
    };
  }, []);

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
    if (activeRequest.current) return;
    setAttempted(true);
    const invalid = (Object.keys(errors) as Array<keyof typeof errors>).find((key) => errors[key]);
    if (invalid) {
      const field = e.currentTarget.elements.namedItem(invalid);
      if (field instanceof HTMLElement) field.focus();
      return;
    }

    setStatus('sending');

    // A filled honeypot means a bot: pretend to succeed, send nothing.
    if (honeypot.current) {
      setStatus('sent');
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), site.formTimeoutMs);
    const request = { controller, timer };
    activeRequest.current = request;

    try {
      const response = await fetch(site.formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
        signal: controller.signal,
      });
      if (activeRequest.current === request) setStatus(response.ok ? 'sent' : 'error');
    } catch {
      if (activeRequest.current === request) setStatus('error');
    } finally {
      clearTimeout(timer);
      if (activeRequest.current === request) activeRequest.current = null;
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
              honeypot.current = '';
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
    <form
      action={site.formspreeEndpoint}
      method="post"
      onSubmit={submit}
      noValidate={hydrated}
      aria-busy={status === 'sending'}
      className="grid gap-4"
    >
      <input
        type="text"
        name="_gotcha"
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
          required
          disabled={status === 'sending'}
          error={shown('name')}
          autoComplete="name"
          onChange={change('name')}
        />
        <TextField
          label={copy.email}
          name="email"
          type="email"
          value={values.email}
          required
          disabled={status === 'sending'}
          error={shown('email')}
          autoComplete="email"
          onChange={change('email')}
        />
      </div>

      <TextAreaField
        label={copy.message}
        name="message"
        value={values.message}
        required
        disabled={status === 'sending'}
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
