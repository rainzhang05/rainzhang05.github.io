'use client';

import { useEffect } from 'react';
import { FullPageMessage } from '@/components/site/FullPageMessage';
import { ThemeMemory } from '@/components/site/ThemeMemory';
import { Button } from '@/components/ui/Button';
import { TextLink } from '@/components/ui/TextLink';
import { errorCopy } from '@/lib/content/error';
import { albert, albertExt } from './fonts';
import './globals.css';

/**
 * The last resort: an error in the layout itself, which app/[locale]/error.tsx
 * sits inside and so cannot catch. It replaces the whole document, which is
 * why it carries its own <html>, stylesheet and fonts, as the 404 does.
 *
 * English only, for the 404's reason: with the layout gone there is no locale
 * left to read. And no inline theme script — this is rendered in the browser,
 * where a script React inserts never runs — so ThemeMemory puts an explicit
 * Light or Dark back on <html> before the page is painted instead.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const copy = errorCopy.en;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={albert.variable + ' ' + albertExt.variable} suppressHydrationWarning>
      <body>
        <title>{'Error — Rain Zhang'}</title>
        <ThemeMemory />
        <FullPageMessage label={copy.label} heading={copy.heading} body={copy.body}>
          <Button onClick={reset}>{copy.retry}</Button>
          <TextLink href="/">{copy.home}</TextLink>
        </FullPageMessage>
      </body>
    </html>
  );
}
