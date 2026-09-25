import { NotFound } from '@/components/site/NotFound';
import { themeScript } from '@/lib/theme';
import { albert, albertExt } from './fonts';
import './globals.css';

/**
 * Unmatched paths have no locale layout. This route-level 404 supplies its
 * own document, stylesheet, fonts and theme before rendering the shared page.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={albert.variable + ' ' + albertExt.variable}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <NotFound />
      </body>
    </html>
  );
}
