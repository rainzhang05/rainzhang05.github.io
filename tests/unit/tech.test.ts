import { describe, expect, it } from 'vitest';
import { Icon, type IconName } from '@/components/ui/Icon';
import { TECH_GLYPHS } from '@/components/ui/techGlyphs';
import { TECH_ICONS, techIcon, type TechName } from '@/lib/tech';

const names = Object.keys(TECH_ICONS) as TechName[];

describe('techIcon', () => {
  it('resolves a mapped name to its glyph', () => {
    expect(techIcon('Rust')).toBe('rust');
    expect(techIcon('Next.js')).toBe('nextjs');
    expect(techIcon('GitHub')).toBe('github');
  });

  it('returns null for a name with no glyph', () => {
    expect(techIcon('Cypress')).toBeNull();
  });
});

describe('TECH_ICONS', () => {
  it('points every glyph at one that is actually drawn', () => {
    const drawn = new Set<string>([...Object.keys(TECH_GLYPHS), 'github']);
    const missing = names
      .map((name) => techIcon(name))
      .filter((glyph): glyph is IconName => glyph !== null)
      .filter((glyph) => !drawn.has(glyph));

    expect(missing).toEqual([]);
  });

  it('draws no glyph that nothing uses', () => {
    const used = new Set(names.map((name) => techIcon(name)));
    const unused = Object.keys(TECH_GLYPHS).filter((glyph) => !used.has(glyph as IconName));

    expect(unused).toEqual([]);
  });

  it('is rendered by the same component as every other icon', () => {
    expect(typeof Icon).toBe('function');
  });
});
