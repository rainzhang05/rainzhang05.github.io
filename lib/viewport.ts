import type { Viewport } from 'next';
import { site } from './site';

/**
 * Two grounds, ivory and charcoal, and System — the device's own preference —
 * picks between them unless the reader has chosen (see lib/theme.ts). The
 * theme-color pair follows the same preference; an explicit choice repoints
 * both once the page is hydrated. Exporting `viewport` replaces Next's
 * default, so width and scale are restated here; pinch-zoom is deliberately
 * left alone.
 *
 * One object for every document the site can answer with — the locale layout
 * and the two that stand outside it, the 404 and the last-resort error page —
 * so the browser's own chrome is the same colour whichever one it is drawing.
 */
export const siteViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: site.themeColor.light },
    { media: '(prefers-color-scheme: dark)', color: site.themeColor.dark },
  ],
  colorScheme: 'light dark',
};
