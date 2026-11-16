/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';

/*
 * One policy for every response. Next inlines its own bootstrap script and
 * Tailwind inlines critical CSS, so script-src and style-src allow inline;
 * a nonce would need middleware on every request, which would take both
 * pages out of the static prerender the site is built on. Everything else is
 * same-origin, apart from the Formspree endpoint the contact form posts to.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' https://formspree.io${isDev ? ' ws:' : ''}`,
  "form-action 'self' https://formspree.io",
  "frame-ancestors 'none'",
  // No upgrade-insecure-requests: every subresource is same-origin and
  // relative, HSTS already forces https on the domain, and WebKit applies the
  // directive to loopback too — which breaks `next start` and the Safari and
  // mobile Playwright projects, where the origin is plain http.
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  // preload is deliberately left off: it is hard to undo.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const resumePdf = '/rain-zhang-resume.pdf';

/*
 * Addresses earlier versions of this site answered at. The resume was
 * "/Rain Zhang Resume.pdf" until May 2026 and "/Resume.pdf" before that, and
 * both went out in applications; a link in one of those must still open the
 * resume. These files are never coming back, so the redirect is permanent.
 * The source is written percent-encoded because that is what is matched, and
 * matching ignores case, so "/Resume.pdf" answers for "/resume.pdf" as well.
 */
const formerAddresses = [
  { source: '/Rain%20Zhang%20Resume.pdf', destination: resumePdf, permanent: true },
  { source: '/Resume.pdf', destination: resumePdf, permanent: true },
  { source: '/index.html', destination: '/', permanent: true },
];

/*
 * Addresses the site never had but that are the obvious thing to type. They
 * are temporary: nothing has ever been promised at them, so they stay free
 * to mean something else later.
 */
const guessedAddresses = [
  { source: '/cv.pdf', destination: resumePdf, permanent: false },
  { source: '/cv', destination: '/resume', permanent: false },
  { source: '/ja/resume.pdf', destination: '/rain-zhang-resume-ja.pdf', permanent: false },
  { source: '/ja/cv', destination: '/ja/resume', permanent: false },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    globalNotFound: true,
  },
  images: {
    // Only the project screenshots go through next/image. Technology marks
    // and company logos stay inline <img> with explicit sizes (12-18px,
    // several are SVG), so SVG handling stays off here.
    formats: ['image/webp'],
  },
  async rewrites() {
    // English lives at "/" while sharing one [locale] tree with Japanese. The
    // rewrite is also what keeps "/resume" from being read as the [locale]
    // segment and 404ing under dynamicParams: false.
    return [
      { source: '/', destination: '/en' },
      { source: '/resume', destination: '/en/resume' },
    ];
  },
  async redirects() {
    // "/en" is an implementation detail; keep one canonical URL per language.
    // One entry per route rather than "/en/:path*", which would turn a clean
    // 404 into a redirect to another 404.
    return [
      { source: '/en', destination: '/', permanent: true },
      { source: '/en/resume', destination: '/resume', permanent: true },
      ...formerAddresses,
      ...guessedAddresses,
    ];
  },
  async headers() {
    // Declared here rather than in vercel.json so `next start` and the
    // Playwright matrix see exactly what production sends.
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
