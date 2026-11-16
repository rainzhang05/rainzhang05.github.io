import type { ReactNode } from 'react';
import { Eyebrow } from '@/components/ui/Eyebrow';

/**
 * A whole screen given to one message: the 404, and the two error pages. They
 * are the only pages with no header and no footer, because none of them can
 * count on the tree those live in — so each is a label, a heading, a sentence
 * and the way back, set on the same container and in the same type as the
 * first screen of the site.
 *
 * `dvh`, not `vh`: on a phone 100vh is the height with the browser's toolbar
 * away, so the message sat below the middle and the page scrolled.
 */
export function FullPageMessage({
  label,
  heading,
  body,
  children,
}: {
  label: string;
  heading: string;
  body: string;
  /** The way out: a link home, and on an error a button to try again. */
  children: ReactNode;
}) {
  return (
    <main className="mx-auto box-border flex min-h-dvh w-full max-w-container flex-col justify-center px-gutter-mobile sm:px-gutter">
      <Eyebrow as="p">{label}</Eyebrow>
      <h1 className="mt-4 max-w-measure text-hero font-light text-ink">{heading}</h1>
      <p className="mt-5 max-w-measure text-body-lg text-ink-2">{body}</p>
      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-body-15">
        {children}
      </div>
    </main>
  );
}
