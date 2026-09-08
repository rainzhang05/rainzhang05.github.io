import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { albert, albertExt } from '../fonts';
import { BootGate } from '@/components/site/BootGate';
import { EntranceRouter } from '@/lib/entrance';
import { bootScript } from '@/lib/boot';
import { content } from '@/lib/content';
import { personJsonLd } from '@/lib/jsonLd';
import { locales, site, type Locale } from '@/lib/site';
import '../globals.css';

/** Both languages are prerendered at build time. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

/**
 * There is one theme and it is light. Saying so keeps a dark-mode browser
 * from rendering the form controls, caret and scrollbars dark against ivory.
 * Exporting `viewport` replaces Next's default, so width and scale are
 * restated here; pinch-zoom is deliberately left alone.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: site.themeColor,
  colorScheme: 'light',
};

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
      images: [
        { url: site.ogImage, width: 1200, height: 630, alt: copy.meta.ogAlt, type: 'image/png' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.meta.title,
      description: copy.meta.description,
      images: [{ url: site.ogImage, alt: copy.meta.ogAlt }],
    },
  };
}

/**
 * The root layout. Albert Sans is preloaded for both languages; the Japanese
 * route carries data-locale="ja", which swaps in the Japanese type stack
 * declared in globals.css.
 *
 * data-scroll-behavior tells the App Router that html has scroll-behavior:
 * smooth, so it turns it off for the length of a route transition and a
 * cross-route jump to a section lands rather than flying. Next 15 assumes it;
 * Next 16 reads this attribute, and without it every "#work" from the resume
 * page becomes a long smooth scroll down the whole document.
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
    <html
      lang={locale}
      data-locale={locale}
      data-scroll-behavior="smooth"
      className={albert.variable + ' ' + albertExt.variable}
      /* The boot script writes data-boot on this element before React sees it,
         which React would otherwise report as a hydration mismatch. The
         suppression covers this element's own attributes and nothing below
         it. */
      suppressHydrationWarning
    >
      <body>
        {/* First, and before #boot exists: see lib/boot.ts. The sheet is
            hidden until this raises it, so a reader with JavaScript off simply
            never has one. Rendering this as a child of <html> would not work —
            the parser moves it into <head> and hydration then disagrees about
            the element it is attached to. */}
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <div id="boot" aria-hidden="true">
          <div className="boot-inner">
            <span className="boot-mark">{site.name}</span>
            <span className="boot-rule">
              <span />
            </span>
          </div>
        </div>
        <BootGate />
        <EntranceRouter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: personJsonLd(content[locale]) }}
        />
        {children}
      </body>
    </html>
  );
}
