import { afterEach, describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { LocaleMemory } from '@/components/site/LocaleMemory';
import { localeCookie, localeCookieMaxAge } from '@/lib/site';

afterEach(() => {
  document.cookie = `${localeCookie}=; path=/; max-age=0`;
});

describe('LocaleMemory', () => {
  it('remembers the language of the page being read', () => {
    render(<LocaleMemory locale="ja" />);

    expect(document.cookie).toContain(`${localeCookie}=ja`);
  });

  it('remembers English too, so a reader in Japan who switches stays switched', () => {
    render(<LocaleMemory locale="en" />);

    expect(document.cookie).toContain(`${localeCookie}=en`);
  });

  it('follows the reader when the language changes under it', () => {
    const { rerender } = render(<LocaleMemory locale="en" />);
    rerender(<LocaleMemory locale="ja" />);

    expect(document.cookie).toContain(`${localeCookie}=ja`);
  });

  it('renders nothing', () => {
    const { container } = render(<LocaleMemory locale="en" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('keeps the choice for a year, not for the tab', () => {
    // A session cookie would forget the language the moment the browser
    // closed, which is the one case this whole feature exists for.
    expect(localeCookieMaxAge).toBeGreaterThanOrEqual(31536000);
  });
});
