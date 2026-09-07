import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

const languages = { 'en-CA': site.url, ja: site.url + '/ja' };

/**
 * The two canonical URLs, each declaring the other as its alternate — the same
 * pairing generateMetadata emits as hreflang. "/en" is left out: it redirects
 * to "/", so it is not a URL of its own.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: site.url,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages },
    },
    {
      url: site.url + '/ja',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages },
    },
  ];
}
