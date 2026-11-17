import localFont from 'next/font/local';

/**
 * Albert Sans, self-hosted and split the way the design system ships it:
 * a preloaded latin subset and a lazily fetched latin-ext subset, each one
 * variable file (300-600).
 *
 * Upright only. Nothing on the site is set in italic, and an italic face
 * declared here is preloaded with the upright one whether or not a single
 * glyph of it is drawn — 34KB on every first visit, which the boot gate then
 * waited for. If italic text is ever wanted, add the face back here; until
 * then a stray <em> is slanted by the browser, which is the right fallback.
 *
 * The two families are stacked in --font-sans (app/globals.css); the browser
 * falls back per character, so latin-ext glyphs resolve without preloading
 * a second file on every visit.
 */
export const albert = localFont({
  variable: '--font-albert',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
  declarations: [
    {
      prop: 'unicode-range',
      value:
        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    },
  ],
  src: [{ path: './fonts/AlbertSans-Upright-latin.woff2', weight: '300 600', style: 'normal' }],
});

export const albertExt = localFont({
  variable: '--font-albert-ext',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  declarations: [
    {
      prop: 'unicode-range',
      value:
        'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
    },
  ],
  src: [{ path: './fonts/AlbertSans-Upright-latin-ext.woff2', weight: '300 600', style: 'normal' }],
});
