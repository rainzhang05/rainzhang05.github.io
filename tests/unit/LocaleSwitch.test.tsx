import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocaleSwitch } from '@/components/site/LocaleSwitch';
import { localeCookie } from '@/lib/site';

afterEach(() => {
  document.cookie = `${localeCookie}=; path=/; max-age=0`;
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

  it('remembers a deliberate choice, so the geo redirect cannot override it', async () => {
    const user = userEvent.setup();
    render(<LocaleSwitch current="en" />);

    await user.click(screen.getByRole('radio', { name: 'JA' }));

    expect(document.cookie).toContain(`${localeCookie}=ja`);
  });
});
