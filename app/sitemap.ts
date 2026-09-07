import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

const languages = { 'en-CA': site.url, ja: site.url + '/ja' };
const resumeLanguages = { 'en-CA': site.url + '/resume', ja: site.url + '/ja/resume' };

/**
 * The four canonical URLs, each declaring its own language pair as alternates —
 * the same pairing generateMetadata emits as hreflang. "/en" and "/en/resume"
 * are left out: they redirect, so they are not URLs of their own. The PDFs are
 * left out too, so they do not compete with the pages that show them.
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
    {
      url: site.url + '/resume',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages: resumeLanguages },
    },
    {
      url: site.url + '/ja/resume',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: resumeLanguages },
    },
  ];
}
