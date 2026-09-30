import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/components/site/ContactForm';
import { en } from '@/lib/content';
import { site } from '@/lib/site';

const copy = en.contact.form;

function setup() {
  const rendered = render(<ContactForm copy={copy} />);
  return {
    ...rendered,
    name: screen.getByLabelText(copy.name),
    email: screen.getByLabelText(copy.email),
    message: screen.getByLabelText(copy.message),
    submit: screen.getByRole('button', { name: copy.submit }),
  };
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn(() => Promise.resolve({ ok: true } as Response));
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('ContactForm', () => {
  function fillValidForm() {
    fireEvent.change(screen.getByLabelText(copy.name), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText(copy.email), { target: { value: 'ada@example.com' } });
    fireEvent.change(screen.getByLabelText(copy.message), { target: { value: 'Hello' } });
  }

  it('renders a native POST form with validation before hydration', () => {
    const html = renderToString(<ContactForm copy={copy} />);
    const document = new DOMParser().parseFromString(html, 'text/html');
    const form = document.querySelector('form')!;

    expect(form.getAttribute('action')).toBe(site.formspreeEndpoint);
    expect(form.getAttribute('method')).toBe('post');
    expect(form.hasAttribute('novalidate')).toBe(false);
    expect(form.querySelectorAll('[required]')).toHaveLength(3);
    expect(form.querySelector('[name="email"]')).toHaveAttribute('type', 'email');
  });

  it('says nothing about a field the visitor has only passed through', async () => {
    const user = userEvent.setup();
    const { name, email, message } = setup();

    await user.click(name);
    await user.click(email);
    await user.click(message);
    await user.click(document.body);

    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('flags an empty required field once Send has been pressed', async () => {
    const user = userEvent.setup();
    const { submit } = setup();

    expect(screen.queryByRole('alert')).toBeNull();

    await user.click(submit);

    expect((await screen.findAllByRole('alert'))[0]).toHaveTextContent(copy.required);
    expect(screen.getByLabelText(copy.name)).toHaveFocus();
  });

  it('rejects an address that is not an email, once Send has been pressed', async () => {
    const user = userEvent.setup();
    const { email, submit } = setup();

    await user.type(email, 'not-an-address');
    expect(screen.queryByRole('alert')).toBeNull();

    await user.click(submit);

    expect(await screen.findByText(copy.invalidEmail)).toBeInTheDocument();
  });

  it('focuses the first invalid field after earlier fields are corrected', () => {
    const { container, name, email } = setup();
    fireEvent.change(name, { target: { value: 'Ada' } });
    fireEvent.change(email, { target: { value: 'invalid' } });
    fireEvent.submit(container.querySelector('form')!);

    expect(email).toHaveFocus();
    expect(email).toHaveAccessibleDescription(copy.invalidEmail);
  });

  it('clears an error as soon as the field is corrected', async () => {
    const user = userEvent.setup();
    const { name, submit } = setup();

    await user.click(submit);
    expect(await screen.findAllByText(copy.required)).toHaveLength(3);

    await user.type(name, 'Ada');

    expect(screen.getAllByText(copy.required)).toHaveLength(2);
  });

  it('will not submit an invalid form', async () => {
    const user = userEvent.setup();
    const { submit } = setup();

    await user.click(submit);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(await screen.findAllByRole('alert')).toHaveLength(3);
  });

  it('posts a valid form to Formspree as JSON', async () => {
    const user = userEvent.setup();
    const { name, email, message, submit } = setup();

    await user.type(name, 'Ada');
    await user.type(email, 'ada@example.com');
    await user.type(message, 'Hello');
    await user.click(submit);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(site.formspreeEndpoint);
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual({
      name: 'Ada',
      email: 'ada@example.com',
      message: 'Hello',
    });
  });

  it('confirms a successful send', async () => {
    const user = userEvent.setup();
    const { name, email, message, submit } = setup();

    await user.type(name, 'Ada');
    await user.type(email, 'ada@example.com');
    await user.type(message, 'Hello');
    await user.click(submit);

    expect(await screen.findByText(copy.sentTitle)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: copy.another })).toBeInTheDocument();
  });

  it('lets the visitor send another message', async () => {
    const user = userEvent.setup();
    const { name, email, message, submit } = setup();

    await user.type(name, 'Ada');
    await user.type(email, 'ada@example.com');
    await user.type(message, 'Hello');
    await user.click(submit);
    await user.click(await screen.findByRole('button', { name: copy.another }));

    expect(screen.getByLabelText(copy.name)).toHaveValue('');
  });

  it('reports a rejected submission without losing what was typed', async () => {
    fetchMock.mockResolvedValue({ ok: false } as Response);
    const user = userEvent.setup();
    const { name, email, message, submit } = setup();

    await user.type(name, 'Ada');
    await user.type(email, 'ada@example.com');
    await user.type(message, 'Hello');
    await user.click(submit);

    expect(await screen.findByText(copy.failed)).toBeInTheDocument();
    expect(screen.getByLabelText(copy.name)).toHaveValue('Ada');
  });

  it('reports a network failure the same way', async () => {
    fetchMock.mockRejectedValue(new Error('offline'));
    const user = userEvent.setup();
    const { name, email, message, submit } = setup();

    await user.type(name, 'Ada');
    await user.type(email, 'ada@example.com');
    await user.type(message, 'Hello');
    await user.click(submit);

    expect(await screen.findByText(copy.failed)).toBeInTheDocument();
  });

  it('carries a honeypot field that is hidden from people', () => {
    const { container } = render(<ContactForm copy={copy} />);
    const honeypot = container.querySelector('input[name="_gotcha"]');

    expect(honeypot).toBeInTheDocument();
    expect(honeypot).toHaveAttribute('tabindex', '-1');
    expect(honeypot).toHaveAttribute('aria-hidden', 'true');
  });

  it('silently drops a submission from a bot that filled the honeypot', async () => {
    const user = userEvent.setup();
    const { container } = render(<ContactForm copy={copy} />);
    const honeypot = container.querySelector('input[name="_gotcha"]') as HTMLInputElement;

    await user.type(screen.getByLabelText(copy.name), 'Bot');
    await user.type(screen.getByLabelText(copy.email), 'bot@example.com');
    await user.type(screen.getByLabelText(copy.message), 'spam');
    await user.type(honeypot, 'spam');
    await user.click(screen.getByRole('button', { name: copy.submit }));

    expect(await screen.findByText(copy.sentTitle)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('clears the honeypot when starting another message', async () => {
    const { container } = setup();
    fillValidForm();
    fireEvent.change(container.querySelector('[name="_gotcha"]')!, { target: { value: 'spam' } });
    fireEvent.submit(container.querySelector('form')!);
    fireEvent.click(screen.getByRole('button', { name: copy.another }));
    fillValidForm();
    fireEvent.submit(container.querySelector('form')!);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(await screen.findByText(copy.sentTitle)).toBeInTheDocument();
  });

  it('allows one request at a time and protects the message being sent', async () => {
    let resolve!: (response: Response) => void;
    fetchMock.mockImplementation(() => new Promise<Response>((done) => { resolve = done; }));
    const { container, name, email, message, submit } = setup();
    fillValidForm();
    const form = container.querySelector('form')!;
    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(form).toHaveAttribute('aria-busy', 'true');
    [name, email, message, submit].forEach((field) => expect(field).toBeDisabled());

    await act(async () => resolve({ ok: false } as Response));
    [name, email, message, submit].forEach((field) => expect(field).toBeEnabled());
    expect(message).toHaveValue('Hello');
  });

  it('cancels on unmount and ignores a late response', async () => {
    vi.useFakeTimers();
    let signal!: AbortSignal;
    let resolve!: (response: Response) => void;
    fetchMock.mockImplementation((_url: string, init: RequestInit) => {
      signal = init.signal as AbortSignal;
      return new Promise<Response>((done) => { resolve = done; });
    });
    const { container, unmount } = render(<ContactForm copy={copy} />);
    fillValidForm();
    fireEvent.submit(container.querySelector('form')!);
    unmount();

    expect(signal.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
    setup();
    await act(async () => resolve({ ok: true } as Response));
    expect(screen.queryByText(copy.sentTitle)).toBeNull();
    expect(screen.getByRole('button', { name: copy.submit })).toBeEnabled();
  });

  it('aborts a request that hangs past the timeout', async () => {
    // fireEvent rather than userEvent: this test drives the clock itself, and
    // userEvent's own timers would compete with the fake ones.
    vi.useFakeTimers();
    let signal: AbortSignal | undefined;
    fetchMock.mockImplementation((_url: string, init: RequestInit) => {
      signal = init.signal ?? undefined;
      return new Promise((_resolve, reject) => {
        signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      });
    });

    const { container } = render(<ContactForm copy={copy} />);
    fireEvent.change(screen.getByLabelText(copy.name), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText(copy.email), { target: { value: 'ada@example.com' } });
    fireEvent.change(screen.getByLabelText(copy.message), { target: { value: 'Hello' } });
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(signal?.aborted).toBe(false);

    await act(async () => vi.advanceTimersByTimeAsync(site.formTimeoutMs));
    expect(signal?.aborted).toBe(true);
    expect(screen.getByText(copy.failed)).toBeInTheDocument();
    expect(screen.getByLabelText(copy.message)).toHaveValue('Hello');
    expect(screen.getByRole('button', { name: copy.submit })).toBeEnabled();

    fetchMock.mockResolvedValue({ ok: true } as Response);
    await act(async () => fireEvent.submit(container.querySelector('form')!));
    expect(screen.getByText(copy.sentTitle)).toBeInTheDocument();
  });
});
