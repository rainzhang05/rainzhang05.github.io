import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocaleSwitch } from '@/components/site/LocaleSwitch';
import { localeCookie } from '@/lib/site';

afterEach(() => {
  document.cookie = `${localeCookie}=; path=/; max-age=0`;
  window.sessionStorage.clear();
});

describe('LocaleSwitch', () => {
  it('marks the current language and offers the other', () => {
    render(<LocaleSwitch current="en" />);

    expect(screen.getByRole('radio', { name: 'EN' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'JA' })).toHaveAttribute('aria-checked', 'false');
  });

  it('points each language at its own URL, so both are crawlable', () => {
    render(<LocaleSwitch current="ja" />);

    expect(screen.getByRole('radio', { name: 'EN' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('radio', { name: 'JA' })).toHaveAttribute('href', '/ja');
  });

  it('reflects the Japanese page', () => {
    render(<LocaleSwitch current="ja" />);

    expect(screen.getByRole('radio', { name: 'JA' })).toHaveAttribute('aria-checked', 'true');
  });

  it('slides one pill between the labels instead of repainting them', () => {
    const { container, rerender } = render(<LocaleSwitch current="en" />);
    const thumb = container.querySelector('[aria-hidden="true"]');

    expect(thumb?.className).toContain('translate-x-0');
    expect(thumb?.className).toContain('transition-transform');

    rerender(<LocaleSwitch current="ja" />);
    expect(thumb?.className).toContain('translate-x-full');
  });

  it('moves the pill on the click, before the other language has loaded', async () => {
    const user = userEvent.setup();
    const { container } = render(<LocaleSwitch current="en" />);

    await user.click(screen.getByRole('radio', { name: 'JA' }));

    expect(container.querySelector('[aria-hidden="true"]')?.className).toContain(
      'translate-x-full'
    );
  });

  it('finishes the slide on the page it lands on', () => {
    window.sessionStorage.setItem('portfolio.localeFrom', 'en');

    const { container } = render(<LocaleSwitch current="ja" />);
    const pill = container.querySelector('[aria-hidden="true"]');

    expect(pill).toHaveAttribute('data-slide-from', 'en');
    expect(pill?.className).toContain('translate-x-full');
    // Read once: reloading the page it landed on must not replay the slide.
    expect(window.sessionStorage.getItem('portfolio.localeFrom')).toBeNull();
  });

  it('does not slide on an ordinary visit', () => {
    const { container } = render(<LocaleSwitch current="ja" />);

    expect(container.querySelector('[aria-hidden="true"]')).not.toHaveAttribute('data-slide-from');
  });

  it('records where the visitor came from, for the switch on the next page', async () => {
    const user = userEvent.setup();
    render(<LocaleSwitch current="en" />);

    await user.click(screen.getByRole('radio', { name: 'JA' }));

    expect(window.sessionStorage.getItem('portfolio.localeFrom')).toBe('en');
  });

  it('remembers a deliberate choice, so the geo redirect cannot override it', async () => {
    const user = userEvent.setup();
    render(<LocaleSwitch current="en" />);

    await user.click(screen.getByRole('radio', { name: 'JA' }));

    expect(document.cookie).toContain(`${localeCookie}=ja`);
  });
});
