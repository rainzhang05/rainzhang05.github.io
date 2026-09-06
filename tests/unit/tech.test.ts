import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { TECH_ICONS, techIcon, type TechName } from '@/lib/tech';

const names = Object.keys(TECH_ICONS) as TechName[];

describe('techIcon', () => {
  it('resolves a mapped name to a file under /tech', () => {
    expect(techIcon('Rust')).toBe('/tech/rust.png');
    expect(techIcon('Next.js')).toBe('/tech/nextjs.svg');
  });

  it('returns null for a name with no mark', () => {
    expect(techIcon('Cypress')).toBeNull();
  });
});

describe('TECH_ICONS', () => {
  it('points every mark at a file that exists in public/tech', () => {
    const missing = names
      .map((name) => techIcon(name))
      .filter((src): src is string => src !== null)
      .filter((src) => !existsSync(path.join(process.cwd(), 'public', src)));

    expect(missing).toEqual([]);
  });

  it('ships no unreferenced mark paths', () => {
    for (const name of names) {
      const file = TECH_ICONS[name];
      if (file !== null) expect(file).toMatch(/\.(png|svg)$/);
    }
  });
});
