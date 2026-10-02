import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { PortfolioPage } from '@/components/site/PortfolioPage';
import { ResumePage } from '@/components/site/ResumePage';
import { content, resume } from '@/lib/content';
import { locales } from '@/lib/site';

/** Every link that leaves the site, as the reader would meet it. */
const offSite = (container: HTMLElement) =>
  [...container.querySelectorAll<HTMLAnchorElement>('a[href]')].filter((a) =>
    /^https?:\/\//.test(a.getAttribute('href') ?? '')
  );

describe('links to other websites', () => {
  for (const locale of locales) {
    it(`open in a new tab on the ${locale} home page`, () => {
      const { container } = render(<PortfolioPage copy={content[locale]} locale={locale} />);
      const links = offSite(container);

      expect(links.length).toBeGreaterThan(0);
      for (const link of links) {
        expect(link, link.getAttribute('href') ?? '').toHaveAttribute('target', '_blank');
        expect(link, link.getAttribute('href') ?? '').toHaveAttribute(
          'rel',
          expect.stringContaining('noreferrer')
        );
      }
    });

    it(`open in a new tab on the ${locale} resume page`, () => {
      const { container } = render(
        <ResumePage copy={content[locale]} resume={resume[locale]} locale={locale} />
      );
      const links = offSite(container);

      expect(links.length).toBeGreaterThan(0);
      for (const link of links) {
        expect(link, link.getAttribute('href') ?? '').toHaveAttribute('target', '_blank');
        expect(link, link.getAttribute('href') ?? '').toHaveAttribute(
          'rel',
          expect.stringContaining('noreferrer')
        );
      }
    });
  }

  it('leaves the site’s own pages in the same tab', () => {
    const { container } = render(<PortfolioPage copy={content.en} locale="en" />);
    const own = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="/"], a[href^="#"]')];

    expect(own.length).toBeGreaterThan(0);
    for (const link of own) expect(link).not.toHaveAttribute('target', '_blank');
  });
});
