import { site } from '@/lib/site';

/**
 * Light, dark, or whatever the reader's device says.
 *
 * The palette lives entirely in app/globals.css: the light tokens on :root,
 * and the same tokens for the dark ground in two identical blocks — one under
 * `prefers-color-scheme: dark`, one under `html[data-theme='dark']`. So System
 * needs no JavaScript at all. It is simply the absence of `data-theme`, which
 * is also what a reader without JavaScript, or with storage denied, gets. Only
 * an explicit Light or Dark is written down, and only this module writes it.
 */
export const themes = ['system', 'light', 'dark'] as const;
export type Theme = (typeof themes)[number];

/** localStorage, beside portfolio.locale (a cookie) and portfolio.booted. */
export const themeKey = 'portfolio.theme';

export function isTheme(value: unknown): value is Theme {
  return themes.includes(value as Theme);
}

/**
 * Runs as the first child of <body>, beside the boot script, so an explicit
 * choice is on <html> before a single element of the page is parsed and the
 * first paint is already in the right theme. It has to be a script: the pages
 * are prerendered, so the server never knows the choice.
 *
 * It writes `data-theme` and nothing else. The theme-color metas are React's,
 * and changing them before hydration is a hydration mismatch; showTheme()
 * points them at the choice once React has them.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  themeKey
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;

/** The stored choice. Anything unreadable or unrecognised is System. */
export function readTheme(): Theme {
  try {
    const value = window.localStorage.getItem(themeKey);
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    return 'system';
  }
}

/**
 * Put the page in a theme without remembering it.
 *
 * The attribute is set here as well as by the inline script because a locale
 * change remounts <html> and takes every attribute a script wrote with it —
 * the same thing that happens to data-boot. ThemeMemory calls this before
 * paint on every mount, so the other language arrives in the same theme.
 *
 * The browser's own chrome follows too: each theme-color meta carries a media
 * query for System, and an explicit choice overrides both with its own paper.
 */
export function showTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);

  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    const own = meta.media.includes('dark') ? site.themeColor.dark : site.themeColor.light;
    meta.content = theme === 'system' ? own : site.themeColor[theme];
  });
}

/**
 * The switch in the header. Remembers the choice — System by forgetting it —
 * and repaints in one frame: transitions are withdrawn for the swap and style
 * is flushed before they come back, so no link or control fades its colour
 * behind a background that has already changed (see the rule at the foot of
 * the theme block in globals.css).
 */
export function chooseTheme(theme: Theme) {
  try {
    if (theme === 'system') window.localStorage.removeItem(themeKey);
    else window.localStorage.setItem(themeKey, theme);
  } catch {
    // Storage denied: the choice holds for this page and is forgotten after.
  }

  const root = document.documentElement;
  root.setAttribute('data-theme-switching', '');
  showTheme(theme);
  // A layout read flushes style for the whole document, not just one element,
  // so every colour has already changed by the time transitions return — and a
  // value that has already arrived has nothing to transition from.
  void document.body.offsetHeight;
  root.removeAttribute('data-theme-switching');
}
