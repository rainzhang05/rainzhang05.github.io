/** @type {import('next').NextConfig} */
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
};

export default nextConfig;
