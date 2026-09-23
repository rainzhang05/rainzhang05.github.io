import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { site } from '@/lib/site';
import { chooseTheme, isTheme, readTheme, showTheme, themeKey, themeScript } from '@/lib/theme';

const root = document.documentElement;

function runScript() {
  // The inline script is a string for <script>; this is the browser running it.
  new Function(themeScript)();
}

function addThemeColorMetas() {
  for (const scheme of ['light', 'dark'] as const) {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.media = `(prefers-color-scheme: ${scheme})`;
    meta.content = site.themeColor[scheme];
    document.head.appendChild(meta);
  }
}

const metaContents = () =>
  [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')].map(
    (meta) => meta.content
  );

beforeEach(() => {
  window.localStorage.clear();
  root.removeAttribute('data-theme');
});

afterEach(() => {
  vi.restoreAllMocks();
  document.head.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.remove());
  window.localStorage.clear();
  root.removeAttribute('data-theme');
});

describe('isTheme', () => {
  it('accepts the three choices and nothing else', () => {
    expect(['system', 'light', 'dark'].every(isTheme)).toBe(true);
    expect(isTheme('sepia')).toBe(false);
    expect(isTheme(null)).toBe(false);
  });
});

describe('themeScript', () => {
  it('puts a stored Dark on <html> before the page is parsed', () => {
    window.localStorage.setItem(themeKey, 'dark');
    runScript();

    expect(root.getAttribute('data-theme')).toBe('dark');
  });

  it('puts a stored Light there too, so it wins over a dark device', () => {
    window.localStorage.setItem(themeKey, 'light');
    runScript();

    expect(root.getAttribute('data-theme')).toBe('light');
  });

  it('leaves System as no attribute at all', () => {
    runScript();

    expect(root.hasAttribute('data-theme')).toBe(false);
  });

  it('ignores a value it does not recognise', () => {
    window.localStorage.setItem(themeKey, 'sepia');
    runScript();

    expect(root.hasAttribute('data-theme')).toBe(false);
  });

  it('never throws when storage is denied — it runs before the page exists', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });

    expect(runScript).not.toThrow();
    expect(root.hasAttribute('data-theme')).toBe(false);
  });

  it('reads the same key the switch writes', () => {
    expect(themeScript).toContain(JSON.stringify(themeKey));
  });
});

describe('readTheme', () => {
  it('is System when nothing is stored, the value is unknown, or storage is denied', () => {
    expect(readTheme()).toBe('system');

    window.localStorage.setItem(themeKey, 'sepia');
    expect(readTheme()).toBe('system');

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });
    expect(readTheme()).toBe('system');
  });

  it('returns an explicit choice', () => {
    window.localStorage.setItem(themeKey, 'dark');
    expect(readTheme()).toBe('dark');
  });
});

describe('showTheme', () => {
  it('sets an explicit choice and clears it for System', () => {
    showTheme('dark');
    expect(root.getAttribute('data-theme')).toBe('dark');

    showTheme('system');
    expect(root.hasAttribute('data-theme')).toBe(false);
  });

  it('points both theme-color metas at an explicit choice, and back at their own for System', () => {
    addThemeColorMetas();

    showTheme('light');
    expect(metaContents()).toEqual([site.themeColor.light, site.themeColor.light]);

    showTheme('dark');
    expect(metaContents()).toEqual([site.themeColor.dark, site.themeColor.dark]);

    showTheme('system');
    expect(metaContents()).toEqual([site.themeColor.light, site.themeColor.dark]);
  });

  it('does not remember anything', () => {
    showTheme('dark');
    expect(window.localStorage.getItem(themeKey)).toBeNull();
  });
});

describe('chooseTheme', () => {
  it('remembers Light and Dark, and forgets for System', () => {
    chooseTheme('dark');
    expect(window.localStorage.getItem(themeKey)).toBe('dark');
    expect(root.getAttribute('data-theme')).toBe('dark');

    chooseTheme('system');
    expect(window.localStorage.getItem(themeKey)).toBeNull();
    expect(root.hasAttribute('data-theme')).toBe(false);
  });

  it('withdraws transitions for the swap and gives them back after', () => {
    const seen: (string | null)[] = [];
    const set = root.setAttribute.bind(root);
    vi.spyOn(root, 'setAttribute').mockImplementation((name, value) => {
      if (name === 'data-theme') seen.push(root.getAttribute('data-theme-switching'));
      set(name, value);
    });

    chooseTheme('light');

    expect(seen).toEqual(['']);
    expect(root.hasAttribute('data-theme-switching')).toBe(false);
  });

  it('still repaints when storage is denied', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('denied');
    });

    expect(() => chooseTheme('dark')).not.toThrow();
    expect(root.getAttribute('data-theme')).toBe('dark');
  });
});

/**
 * The dark palette is written twice in globals.css — once for System, once
 * for an explicit Dark — because CSS cannot share one block between a media
 * query and a selector. These keep the two copies one palette.
 */
describe('the dark palette in app/globals.css', () => {
  const css = readFileSync(resolve(__dirname, '../../app/globals.css'), 'utf8');

  function block(selector: string) {
    const start = css.indexOf(selector + ' {');
    expect(start, `${selector} is missing`).toBeGreaterThan(-1);
    const open = css.indexOf('{', start);
    return css.slice(open + 1, css.indexOf('}', open)).trim();
  }

  const names = (body: string) => [...body.matchAll(/(--[\w-]+):/g)].map((m) => m[1]);

  const system = block(":root:not([data-theme='light'])");
  const explicit = block(":root[data-theme='dark']");

  it('is the same in both places', () => {
    expect(explicit).toBe(system);
  });

  it('gives every colour token a dark value', () => {
    const light = css.slice(css.indexOf(':root {'), css.indexOf('/* Type'));
    const missing = names(light).filter((name) => !names(system).includes(name));

    expect(names(light)).toContain('--paper');
    expect(missing).toEqual([]);
  });

  it('carries the toast shadow and tells the browser the ground is dark', () => {
    expect(names(system)).toContain('--shadow-toast');
    expect(system).toMatch(/color-scheme:\s*dark;/);
  });

  it('only ever applies to a screen, so a printed page stays on ivory', () => {
    expect(css).toContain(
      "@media screen and (prefers-color-scheme: dark) {\n  :root:not([data-theme='light'])"
    );
    expect(css).toContain("@media screen {\n  :root[data-theme='dark']");
  });
});
