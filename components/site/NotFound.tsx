import Link from 'next/link';
import { site } from '@/lib/site';

/**
 * The body of the 404 page, shared by the global boundary and the one inside
 * the [locale] segment. A missing URL carries no locale to read, so this is
 * the one place in the site with English copy of its own rather than a key in
 * the content files.
 */
export function NotFound() {
  return (
    <main className="mx-auto box-border flex min-h-screen w-full max-w-container flex-col justify-center px-gutter-mobile sm:px-gutter">
      <p className="m-0 text-label font-medium uppercase tracking-label text-ink-3">404</p>
      <h1 className="mt-4 max-w-measure text-hero font-light leading-display-1 tracking-display-1 text-ink">
        This page does not exist.
      </h1>
      <p className="mt-5 max-w-measure text-body-lg text-ink-2">
        The link may be out of date, or the address may have a typo in it.
      </p>
      <p className="mt-8">
        <Link href="/" className="text-body-15">
          Back to {site.name}
        </Link>
      </p>
    </main>
  );
}
