/** Facts that appear in more than one place. Nothing here is copy. */
export const site = {
  name: 'Rain Zhang',
  url: 'https://rainzhang.me',
  email: 'rainzhang.zty@gmail.com',
  resumeHref: '/rain-zhang-resume.pdf',
  /** Share card, 1200x630. Served from public/. */
  ogImage: '/og.png',
  /** Mirrors --paper in app/globals.css; tests/unit/site.test.ts keeps them equal. */
  themeColor: '#f7f5ef',
  /** Where the work described on the page happens. */
  location: { locality: 'Vancouver', region: 'BC', country: 'CA' },
  github: 'https://github.com/rainzhang05',
  linkedin: 'https://www.linkedin.com/in/rainzhang05',
  /** Formspree form that receives the contact form. Override with an env var. */
  formspreeEndpoint:
    process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? 'https://formspree.io/f/xoveaaqo',
  /** Milliseconds before a hanging submit is aborted. */
  formTimeoutMs: 15000,
} as const;

export const locales = ['en', 'ja'] as const;
export type Locale = (typeof locales)[number];

export const localeCookie = 'portfolio.locale';
export const localeHome: Record<Locale, string> = { en: '/', ja: '/ja' };
