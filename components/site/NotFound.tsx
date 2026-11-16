import { FullPageMessage } from './FullPageMessage';
import { TextLink } from '@/components/ui/TextLink';
import { site } from '@/lib/site';

/**
 * The body of the global 404 page. A missing URL carries no locale to read, so
 * this is one of the two places in the site with English copy of its own
 * rather than a key in the content files; app/global-error.tsx is the other.
 *
 * The way home is a plain anchor: this page is a document of its own, outside
 * the locale layout, so leaving it is a document load either way.
 */
export function NotFound() {
  return (
    <FullPageMessage
      label="404"
      heading="This page does not exist."
      body="The link may be out of date, or the address may have a typo in it."
    >
      <TextLink href="/">Back to {site.name}</TextLink>
    </FullPageMessage>
  );
}
