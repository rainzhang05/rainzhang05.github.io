import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { albert, albertExt } from '../fonts';
import { content } from '@/lib/content';
import { locales, site, type Locale } from '@/lib/site';
import '../globals.css';

/** Both languages are prerendered at build time. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

function assertLocale(value: string): Locale {
  if (!locales.includes(value as Locale)) notFound();
  return value as Locale;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const copy = content[locale];
  const path = locale === 'en' ? '/' : '/ja';

  return {
    metadataBase: new URL(site.url),
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: {
      canonical: path,
      languages: { 'en-CA': '/', ja: '/ja' },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_CA' : 'ja_JP',
      url: site.url + (locale === 'en' ? '' : '/ja'),
      title: copy.meta.title,
      description: copy.meta.description,
      siteName: site.name,
    },
  };
}

/**
 * The root layout. Albert Sans is preloaded for both languages; the Japanese
 * route carries data-locale="ja", which swaps in the Japanese type stack
 * declared in globals.css.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = assertLocale((await params).locale);

  return (
    <html lang={locale} data-locale={locale} className={albert.variable + ' ' + albertExt.variable}>
      <body>{children}</body>
    </html>
  );
}
