import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ResumePage } from '@/components/site/ResumePage';
import { content, resume } from '@/lib/content';
import { locales, resumePage, site, type Locale } from '@/lib/site';

/** Both languages are prerendered, exactly as the home page is. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

function assertLocale(value: string): Locale {
  if (!locales.includes(value as Locale)) notFound();
  return value as Locale;
}

/**
 * Metadata merges one top-level key at a time, so a key this page sets
 * replaces the layout's copy of it outright. alternates, openGraph and twitter
 * are therefore restated in full: without that, both resume pages would claim
 * the home page as their canonical URL and share its og:url.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const copy = content[locale];
  const page = resume[locale];
  const path = resumePage[locale];

  return {
    title: page.meta.title,
    description: page.meta.description,
    alternates: {
      canonical: path,
      languages: { 'en-CA': resumePage.en, ja: resumePage.ja },
    },
    openGraph: {
      type: 'profile',
      locale: locale === 'en' ? 'en_CA' : 'ja_JP',
      url: site.url + path,
      title: page.meta.title,
      description: page.meta.description,
      siteName: site.name,
      images: [
        { url: site.ogImage, width: 1200, height: 630, alt: copy.meta.ogAlt, type: 'image/png' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.meta.title,
      description: page.meta.description,
      images: [{ url: site.ogImage, alt: copy.meta.ogAlt }],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = assertLocale((await params).locale);

  return <ResumePage copy={content[locale]} resume={resume[locale]} locale={locale} />;
}
