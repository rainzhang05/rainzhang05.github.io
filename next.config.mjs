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
  "form-action 'self'",
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

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Only the portrait and the project screenshots go through next/image.
    // Technology marks and company logos stay inline <img> with explicit
    // sizes (14-28px, several are SVG), so SVG handling stays off here.
    formats: ['image/webp'],
  },
  async rewrites() {
    // English lives at "/" while sharing one [locale] tree with Japanese.
    return [{ source: '/', destination: '/en' }];
  },
  async redirects() {
    // "/en" is an implementation detail; keep one canonical URL per language.
    return [{ source: '/en', destination: '/', permanent: true }];
  },
  async headers() {
    // Declared here rather than in vercel.json so `next start` and the
    // Playwright matrix see exactly what production sends.
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
