import { NotFound } from '@/components/site/NotFound';
import { albert } from './fonts';
import './globals.css';

/**
 * The 404 for every unmatched path. dynamicParams is false, so an unknown
 * locale is rejected by the router before app/[locale] renders — which means
 * this one boundary answers "/nope" and "/no/such/page" alike.
 *
 * There is no app/layout.tsx in this repo (app/[locale]/layout.tsx is the root
 * layout), so Next wraps this in a bare html/body of its own and the page has
 * to bring the stylesheet and the typeface itself. It uses next/font's own
 * class rather than the --font-albert variable: globals.css builds --font-sans
 * on :root, where that variable would still be undefined.
 */
export default function GlobalNotFound() {
  return (
    <div className={albert.className + ' bg-paper text-ink'}>
      <NotFound />
    </div>
  );
}
