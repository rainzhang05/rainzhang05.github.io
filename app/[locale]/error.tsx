'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FullPageMessage } from '@/components/site/FullPageMessage';
import { Button } from '@/components/ui/Button';
import { TextLink } from '@/components/ui/TextLink';
import { errorCopy } from '@/lib/content/error';
import { isLocale, localeHome } from '@/lib/site';

/**
 * What a reader sees if a page throws while it renders. Without this file the
 * answer is Next's own "Application error: a client-side exception has
 * occurred" on a blank document — no way back, and nothing of the site.
 *
 * It replaces the page, not the layout, so the fonts, the theme and the
 * language on <html> are all still in place. The language comes from the
 * route, which is the one thing an error boundary is still able to read.
 *
 * The way home is a plain anchor rather than a router link: a document load is
 * the surest way out of a tree that has just thrown.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ locale?: string }>();
  const locale = isLocale(params?.locale) ? params.locale : 'en';
  const copy = errorCopy[locale];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <FullPageMessage label={copy.label} heading={copy.heading} body={copy.body}>
      <Button onClick={reset}>{copy.retry}</Button>
      <TextLink href={localeHome[locale]}>{copy.home}</TextLink>
    </FullPageMessage>
  );
}
