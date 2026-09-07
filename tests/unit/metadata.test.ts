import { describe, expect, it, vi } from 'vitest';

// next/font/local is a build-time transform; under Vitest the import is a
// plain module, so the layout can only be loaded with it stubbed out.
vi.mock('next/font/local', () => ({
  default: (options: { variable: string }) => ({
    variable: options.variable,
    className: options.variable,
    style: { fontFamily: options.variable },
  }),
}));

import { generateMetadata, viewport } from '@/app/[locale]/layout';
import { content } from '@/lib/content';
import { locales, site } from '@/lib/site';

const metadataFor = (locale: string) => generateMetadata({ params: Promise.resolve({ locale }) });

describe('viewport', () => {
  it('declares the one theme, so dark-mode browsers leave the page alone', () => {
    expect(viewport.themeColor).toBe(site.themeColor);
    expect(viewport.colorScheme).toBe('light');
  });

  it('keeps the page zoomable', () => {
    expect(viewport.width).toBe('device-width');
    expect(viewport.initialScale).toBe(1);
    expect(viewport.maximumScale).toBeUndefined();
    expect(viewport.userScalable).toBeUndefined();
  });
});

describe.each(locales)('%s metadata', (locale) => {
  const copy = content[locale];

  it('shares the card image at the size the file actually is', async () => {
    const meta = await metadataFor(locale);
    const images = meta.openGraph?.images;

    expect(images).toEqual([
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: copy.meta.ogAlt,
        type: 'image/png',
      },
    ]);
  });

  it('asks Twitter for the large card, not a cropped square', async () => {
    const meta = await metadataFor(locale);

    expect(meta.twitter).toMatchObject({
      card: 'summary_large_image',
      images: [{ url: site.ogImage, alt: copy.meta.ogAlt }],
    });
  });

  it('keeps one canonical URL per language', async () => {
    const meta = await metadataFor(locale);

    expect(meta.alternates?.canonical).toBe(locale === 'en' ? '/' : '/ja');
    expect(meta.alternates?.languages).toEqual({ 'en-CA': '/', ja: '/ja' });
  });
});

describe('share card alt text', () => {
  it('is translated, not copied', () => {
    expect(content.ja.meta.ogAlt).not.toBe(content.en.meta.ogAlt);
  });
});
