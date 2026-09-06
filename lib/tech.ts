/**
 * Technology marks, in their original colours, from public/tech.
 * Marks are never tinted or greyscaled (design system rule).
 * Adding a technology: drop the file in public/tech and add a line here.
 */
export const TECH_ICONS = {
  C: 'c.png',
  'C++': 'cpp.png',
  CSS: 'css.png',
  'CTAP2.1': null,
  Cypress: null,
  Docker: 'docker.png',
  Flask: 'flask.svg',
  Git: 'git.png',
  GitHub: 'github.png',
  'GitHub Actions': 'githubactions.svg',
  'Google Cloud': 'google-cloud.png',
  HTML: 'html.png',
  Java: 'java.png',
  JavaScript: 'js.png',
  Jinja: null,
  Linux: 'linux.png',
  'Linux UHID': 'linux.png',
  'ML-DSA': null,
  'Microsoft 365': 'microsoft365.svg',
  'Microsoft Entra ID': 'entra-id.svg',
  'Microsoft Graph API': 'microsoft-graph.svg',
  'Next.js': 'nextjs.svg',
  'Node.js': 'nodejs.svg',
  'OAuth 2.0': 'oauth.svg',
  'OpenAI API': null,
  Playwright: null,
  PostgreSQL: 'postgresql.svg',
  Python: 'python.png',
  React: 'react.png',
  Rust: 'rust.png',
  'Tailwind CSS': 'tailwind.png',
  'Tripadvisor API': null,
  Trussed: null,
  TypeScript: 'typescript.png',
  Vercel: 'vercel.svg',
  Vite: null,
  Vitest: null,
  'WebAuthn / FIDO2': 'fido2.svg',
  clap: null,
  fips204: null,
  liboqs: null,
  littlefs2: null,
  pytest: null,
  'python-fido2': null,
} satisfies Record<string, string | null>;

export type TechName = keyof typeof TECH_ICONS;

export function techIcon(name: TechName): string | null {
  const file = TECH_ICONS[name];
  return file ? '/tech/' + file : null;
}
