import { notFound } from 'next/navigation';
import { PortfolioPage } from '@/components/site/PortfolioPage';
import { content } from '@/lib/content';
import { locales, type Locale } from '@/lib/site';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  return <PortfolioPage copy={content[locale as Locale]} locale={locale as Locale} />;
}
