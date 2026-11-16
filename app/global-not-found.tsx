import type { Metadata, Viewport } from 'next';
import { NotFound } from '@/components/site/NotFound';
import { ThemeMemory } from '@/components/site/ThemeMemory';
import { site } from '@/lib/site';
import { themeScript } from '@/lib/theme';
import { siteViewport } from '@/lib/viewport';
import { albert, albertExt } from './fonts';
import './globals.css';

/**
 * Without these the tab reads as the raw address and the browser's chrome is
 * left on its default colour: no locale layout wraps this page, so nothing
 * else supplies a title or a theme-color. Next adds `noindex` by itself.
 */
export const metadata: Metadata = {
  title: 'Page not found — ' + site.name,
  description: 'There is no page at this address.',
};

export const viewport: Viewport = siteViewport;

/**
 * Unmatched paths have no locale layout. This route-level 404 supplies its
 * own document, stylesheet, fonts and theme before rendering the shared page.
 *
 * The theme script writes data-theme on <html> before React sees it, which is
 * what the suppression is for; ThemeMemory then points the theme-color metas
 * at an explicit choice, as it does under the locale layout.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={albert.variable + ' ' + albertExt.variable} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeMemory />
        <NotFound />
      </body>
    </html>
  );
}
