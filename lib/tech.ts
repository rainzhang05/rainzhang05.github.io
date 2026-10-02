import type { IconName } from '@/components/ui/Icon';

/**
 * The line glyph drawn for each technology (components/ui/techGlyphs.tsx), in
 * the same stroke as every other icon on the site and in the colour of the text
 * beside it, so there is nothing to tint or rescue on the dark ground.
 * A name mapped to `null` renders as a plain pill. Adding a technology: draw a
 * glyph in techGlyphs.tsx and add a line here.
 */
export const TECH_ICONS = {
  C: 'c',
  'C++': 'cpp',
  CSS: 'css',
  'CTAP2.1': null,
  Cypress: null,
  Docker: 'docker',
  Flask: 'flask',
  Git: 'git',
  GitHub: 'github',
  'GitHub Actions': 'githubactions',
  'Google Cloud': 'googlecloud',
  HTML: 'html',
  Java: 'java',
  JavaScript: 'javascript',
  Jinja: null,
  Linux: 'linux',
  'Linux UHID': 'linux',
  'ML-DSA': null,
  'Microsoft 365': 'microsoft365',
  'Microsoft Entra ID': 'entra',
  'Microsoft Graph API': 'graph',
  'Next.js': 'nextjs',
  'Node.js': 'nodejs',
  'OAuth 2.0': 'oauth',
  'OpenAI API': null,
  Playwright: null,
  PostgreSQL: 'postgresql',
  Python: 'python',
  React: 'react',
  Rust: 'rust',
  'Tailwind CSS': 'tailwind',
  'Tripadvisor API': null,
  Trussed: null,
  TypeScript: 'typescript',
  Vercel: 'vercel',
  Vite: null,
  Vitest: null,
  'WebAuthn / FIDO2': 'fido2',
  clap: null,
  fips204: null,
  liboqs: null,
  littlefs2: null,
  pytest: null,
  'python-fido2': null,
} satisfies Record<string, IconName | null>;

export type TechName = keyof typeof TECH_ICONS;

export function techIcon(name: TechName): IconName | null {
  return TECH_ICONS[name];
}
