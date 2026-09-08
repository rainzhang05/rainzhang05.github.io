/** Facts that appear in more than one place. Nothing here is copy. */
export const site = {
  name: 'Rain Zhang',
  url: 'https://rainzhang.me',
  email: 'rainzhang.zty@gmail.com',
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

/**
 * The language this browser was last reading the site in. The middleware
 * reads it on arrival and sends the reader straight back to that language;
 * only the first visit of all is decided by where the reader is.
 */
export const localeCookie = 'portfolio.locale';

/** A year. Long enough that a reader who visits twice a year is still known. */
export const localeCookieMaxAge = 31536000;

/** Whether a cookie value is a language this site actually has. */
export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/**
 * Write the cookie. Deliberately not HttpOnly and set from the browser: the
 * two things that write it — the switch in the header and the page itself on
 * arrival — are both client-side, and nothing but the choice of language is
 * kept in it. `lax` so the cookie still travels on a link followed from
 * somewhere else, which is exactly the arrival it has to survive.
 */
export function rememberLocale(locale: Locale) {
  document.cookie =
    localeCookie + '=' + locale + '; path=/; max-age=' + localeCookieMaxAge + '; samesite=lax';
}

export const localeHome: Record<Locale, string> = { en: '/', ja: '/ja' };

/**
 * The resume, in two parts. Each language has its own PDF and its own page:
 * the page is what every "Resume" link on the site opens, and the PDF is
 * downloaded from that page and nowhere else.
 */
export const resumePage: Record<Locale, string> = { en: '/resume', ja: '/ja/resume' };
export const resumeFile: Record<Locale, string> = {
  en: '/rain-zhang-resume.pdf',
  ja: '/rain-zhang-resume-ja.pdf',
};
