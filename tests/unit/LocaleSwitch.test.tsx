import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocaleSwitch } from '@/components/site/LocaleSwitch';
import { localeCookie } from '@/lib/site';

afterEach(() => {
  document.cookie = `${localeCookie}=; path=/; max-age=0`;
  window.sessionStorage.clear();
});

describe('LocaleSwitch', () => {
  it('marks the current language and offers the other', () => {
    render(<LocaleSwitch label="Language" current="en" />);

    expect(screen.getByRole('radio', { name: 'EN' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: '日本語' })).toHaveAttribute('aria-checked', 'false');
  });

  it('points each language at its own URL, so both are crawlable', () => {
    render(<LocaleSwitch label="Language" current="ja" />);

    expect(screen.getByRole('radio', { name: 'EN' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('radio', { name: '日本語' })).toHaveAttribute('href', '/ja');
  });

  it('reflects the Japanese page', () => {
    render(<LocaleSwitch label="Language" current="ja" />);

    expect(screen.getByRole('radio', { name: '日本語' })).toHaveAttribute('aria-checked', 'true');
  });

  it('slides one pill between the labels instead of repainting them', () => {
    const { container, rerender } = render(<LocaleSwitch label="Language" current="en" />);
    const thumb = container.querySelector('[aria-hidden="true"]');

    expect(thumb?.className).toContain('translate-x-0');
    expect(thumb?.className).toContain('transition-transform');

    rerender(<LocaleSwitch label="Language" current="ja" />);
    expect(thumb?.className).toContain('translate-x-full');
  });

  it('moves the pill on the click, before the other language has loaded', async () => {
    const user = userEvent.setup();
    const { container } = render(<LocaleSwitch label="Language" current="en" />);

    await user.click(screen.getByRole('radio', { name: '日本語' }));

    expect(container.querySelector('[aria-hidden="true"]')?.className).toContain(
      'translate-x-full'
    );
  });

  it('leaves this page alone when the other language is opened somewhere else', async () => {
    const onNavigate = vi.fn();
    const { container } = render(<LocaleSwitch label="Language" current="en" onNavigate={onNavigate} />);
    const ja = screen.getByRole('radio', { name: '日本語' });
    document.cookie = 'portfolio.locale=en; path=/';

    // A new tab, a new window, a middle click: this page is staying put.
    fireEvent.click(ja, { metaKey: true });
    fireEvent.click(ja, { ctrlKey: true });
    fireEvent.click(ja, { shiftKey: true });
    fireEvent.click(ja, { button: 1 });

    expect(onNavigate).not.toHaveBeenCalled();
    expect(document.cookie).toContain('portfolio.locale=en');
    expect(window.sessionStorage.getItem('portfolio.localeFrom')).toBeNull();
    expect(container.querySelector('[aria-hidden="true"]')?.className).toContain('translate-x-0');
  });

  it('takes its name from the page, so /ja is not announced in English', () => {
    render(<LocaleSwitch label="言語" current="ja" />);

    expect(screen.getByRole('radiogroup', { name: '言語' })).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup', { name: 'Language' })).toBeNull();
  });

  it('answers Space, the key a radio is chosen with', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<LocaleSwitch label="Language" current="en" onNavigate={onNavigate} />);

    screen.getByRole('radio', { name: '日本語' }).focus();
    await user.keyboard(' ');

    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(document.cookie).toContain('portfolio.locale=ja');
  });

  it('finishes the slide on the page it lands on', () => {
    window.sessionStorage.setItem('portfolio.localeFrom', 'en');

    const { container } = render(<LocaleSwitch label="Language" current="ja" />);
    const pill = container.querySelector('[aria-hidden="true"]');

    expect(pill).toHaveAttribute('data-slide-from', 'en');
    expect(pill?.className).toContain('translate-x-full');
    // Read once: reloading the page it landed on must not replay the slide.
    expect(window.sessionStorage.getItem('portfolio.localeFrom')).toBeNull();
  });

  it('does not slide on an ordinary visit', () => {
    const { container } = render(<LocaleSwitch label="Language" current="ja" />);

    expect(container.querySelector('[aria-hidden="true"]')).not.toHaveAttribute('data-slide-from');
  });

  it('records where the visitor came from, for the switch on the next page', async () => {
    const user = userEvent.setup();
    render(<LocaleSwitch label="Language" current="en" />);

    await user.click(screen.getByRole('radio', { name: '日本語' }));

    expect(window.sessionStorage.getItem('portfolio.localeFrom')).toBe('en');
  });

  it('remembers a deliberate choice, so the geo redirect cannot override it', async () => {
    const user = userEvent.setup();
    render(<LocaleSwitch label="Language" current="en" />);

    await user.click(screen.getByRole('radio', { name: '日本語' }));

    expect(document.cookie).toContain(`${localeCookie}=ja`);
  });
  it('names Japanese in Japanese, since that is who the label is for', () => {
    render(<LocaleSwitch label="Language" current="en" />);

    const ja = screen.getByRole('radio', { name: '日本語' });
    expect(ja).toHaveAttribute('lang', 'ja');
    expect(ja).toHaveAttribute('hreflang', 'ja');
    expect(screen.queryByRole('radio', { name: 'JA' })).toBeNull();
  });

  it('gives both labels a column of the same width, so the pill lands on one', () => {
    // The pill is one element at calc(50% - 2px) that moves by its own width.
    // Equal grid columns are what make that half exactly one label; side by
    // side, the wider Japanese label would slide it past its own column.
    const { container } = render(<LocaleSwitch label="Language" current="en" />);
    const group = screen.getByRole('radiogroup', { name: 'Language' });

    expect(group).toHaveClass('inline-grid', 'grid-cols-2');
    expect(group.className).not.toMatch(/(^|\s)gap-/);
    container.querySelectorAll('a').forEach((link) => {
      expect(link).toHaveClass('w-full');
    });
  });

  it('keeps the reader on the page they are reading when they switch language', () => {
    render(<LocaleSwitch label="Language" current="en" hrefs={{ en: '/resume', ja: '/ja/resume' }} />);

    expect(screen.getByRole('radio', { name: 'EN' })).toHaveAttribute('href', '/resume');
    expect(screen.getByRole('radio', { name: '日本語' })).toHaveAttribute(
      'href',
      '/ja/resume'
    );
  });
});
