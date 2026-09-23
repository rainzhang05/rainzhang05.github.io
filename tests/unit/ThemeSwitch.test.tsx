import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeSwitch } from '@/components/site/ThemeSwitch';
import { en, ja } from '@/lib/content';
import { themeKey } from '@/lib/theme';

const root = document.documentElement;

afterEach(() => {
  window.localStorage.clear();
  root.removeAttribute('data-theme');
});

describe('ThemeSwitch', () => {
  it('offers System, Light and Dark as one radio group, System first and chosen', () => {
    render(<ThemeSwitch labels={en.labels.theme} />);

    const group = screen.getByRole('radiogroup', { name: 'Theme' });
    const radios = screen.getAllByRole('radio');
    expect(group).toContainElement(radios[0]);
    expect(radios.map((radio) => radio.getAttribute('aria-label'))).toEqual([
      'System',
      'Light',
      'Dark',
    ]);
    expect(screen.getByRole('radio', { name: 'System' })).toHaveAttribute('aria-checked', 'true');
  });

  it('settles on the stored choice once mounted', () => {
    window.localStorage.setItem(themeKey, 'dark');
    render(<ThemeSwitch labels={en.labels.theme} />);

    expect(screen.getByRole('radio', { name: 'Dark' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'System' })).toHaveAttribute('aria-checked', 'false');
  });

  it('repaints and remembers on a click', async () => {
    const user = userEvent.setup();
    render(<ThemeSwitch labels={en.labels.theme} />);

    await user.click(screen.getByRole('radio', { name: 'Dark' }));

    expect(root.getAttribute('data-theme')).toBe('dark');
    expect(window.localStorage.getItem(themeKey)).toBe('dark');
    expect(screen.getByRole('radio', { name: 'Dark' })).toHaveAttribute('aria-checked', 'true');
  });

  it('goes back to following the device when System is chosen', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(themeKey, 'light');
    root.setAttribute('data-theme', 'light');
    render(<ThemeSwitch labels={en.labels.theme} />);

    await user.click(screen.getByRole('radio', { name: 'System' }));

    expect(root.hasAttribute('data-theme')).toBe(false);
    expect(window.localStorage.getItem(themeKey)).toBeNull();
  });

  it('slides one decorative pill, positioned from <html> rather than from state', () => {
    const { container } = render(<ThemeSwitch labels={en.labels.theme} />);
    const pill = container.querySelector('[aria-hidden="true"]');

    expect(pill?.className).toContain('theme-pill');
    expect(pill?.className).toContain('transition-transform');
    expect(pill?.className).not.toMatch(/translate-x/);
  });

  it('names every option in the page language', () => {
    render(<ThemeSwitch labels={ja.labels.theme} />);

    expect(screen.getByRole('radiogroup', { name: 'テーマ' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'ダーク' })).toBeInTheDocument();
  });

  it('shares the language switch track: three equal columns and no gap', () => {
    const { container } = render(<ThemeSwitch labels={en.labels.theme} />);
    const group = container.firstElementChild as HTMLElement;

    expect(group.className).toContain('inline-grid');
    expect(group.className).toContain('grid-cols-3');
    expect(group.className).not.toMatch(/\bgap-/);
  });
});
