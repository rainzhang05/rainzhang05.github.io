import { afterEach, describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeMemory } from '@/components/site/ThemeMemory';
import { themeKey } from '@/lib/theme';

const root = document.documentElement;

afterEach(() => {
  window.localStorage.clear();
  root.removeAttribute('data-theme');
});

describe('ThemeMemory', () => {
  it('puts the chosen theme back on a freshly mounted <html>', () => {
    // What a locale change leaves behind: the choice is stored, but the
    // attribute the inline script wrote went with the old tree.
    window.localStorage.setItem(themeKey, 'dark');
    render(<ThemeMemory />);

    expect(root.getAttribute('data-theme')).toBe('dark');
  });

  it('leaves System as no attribute', () => {
    render(<ThemeMemory />);

    expect(root.hasAttribute('data-theme')).toBe(false);
  });

  it('renders nothing', () => {
    const { container } = render(<ThemeMemory />);

    expect(container).toBeEmptyDOMElement();
  });
});
