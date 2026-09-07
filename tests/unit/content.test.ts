import { describe, expect, it } from 'vitest';
import { content, en, ja } from '@/lib/content';
import { TECH_ICONS, type TechName } from '@/lib/tech';
import { sectionLinks } from '@/lib/sectionLinks';
import { locales } from '@/lib/site';
import type { Copy, Project } from '@/lib/types';

const allProjects = (copy: Copy): Project[] => [...copy.featured, ...copy.other];

/** Everything structural: ids, links and technology names must be identical. */
const shape = (copy: Copy) => ({
  nav: copy.nav.map((n) => [n.id, n.href, n.external ?? false]),
  sectionLinks: sectionLinks(copy).map((n) => [n.id, n.href]),
  footerLinks: copy.footer.links.map((n) => [n.id, n.href, n.external ?? false]),
  experiences: copy.experiences.map((e) => [e.id, e.tech, e.related, e.mark?.src ?? null]),
  featured: copy.featured.map((p) => [p.id, p.primary, p.stack, p.image?.src ?? null]),
  other: copy.other.map((p) => [p.id, p.primary, p.stack, p.image?.src ?? null]),
  projectLinks: allProjects(copy).map((p) => p.links.map((l) => l.href)),
  skills: copy.skills.map((g) => g.items),
});

describe('content', () => {
  it('exposes exactly the locales the site routes', () => {
    expect(Object.keys(content).sort()).toEqual([...locales].sort());
  });

  it('keeps English and Japanese structurally identical', () => {
    expect(shape(ja)).toEqual(shape(en));
  });

  it('translates the prose — the two locales are not the same text', () => {
    expect(ja.intro.heading).not.toBe(en.intro.heading);
    expect(ja.sections.experience).not.toBe(en.sections.experience);
    expect(ja.meta.title).not.toBe(en.meta.title);
  });

  it('declares its own locale tag', () => {
    expect(en.locale).toBe('en');
    expect(ja.locale).toBe('ja');
  });
});

describe.each(locales)('%s content', (locale) => {
  const copy = content[locale];

  it('uses only technology names the icon map knows', () => {
    const used = new Set<string>();
    copy.experiences.forEach((e) => e.tech.forEach((t) => used.add(t)));
    allProjects(copy).forEach((p) => {
      p.primary.forEach((t) => used.add(t));
      p.stack.forEach((t) => used.add(t));
    });
    copy.skills.forEach((g) => g.items.forEach((t) => used.add(t)));

    const unknown = [...used].filter((name) => !(name in TECH_ICONS));
    expect(unknown).toEqual([]);
  });

  it('points every "related work" id at a project that exists', () => {
    const ids = new Set(allProjects(copy).map((p) => p.id));
    const dangling = copy.experiences.flatMap((e) => e.related).filter((id) => !ids.has(id));

    expect(dangling).toEqual([]);
  });

  it('gives every row a unique id, so the disclosure panels cannot collide', () => {
    const ids = [...copy.experiences.map((e) => e.id), ...allProjects(copy).map((p) => p.id)];

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('anchors every in-page nav link at a section the page renders', () => {
    const sections = new Set(['experience', 'work', 'background', 'contact', 'top']);
    // The header, the footer and the section dock all navigate in-page; the
    // last two share sectionLinks(), so this covers every one of them.
    const inPage = [...copy.nav, ...sectionLinks(copy)].filter((n) => n.href.startsWith('#'));

    expect(inPage.length).toBeGreaterThan(0);
    inPage.forEach((n) => expect(sections.has(n.href.slice(1))).toBe(true));
  });

  it('points the dock and the footer at every section, in document order', () => {
    expect(sectionLinks(copy).map((n) => n.id)).toEqual([
      'experience',
      'work',
      'background',
      'contact',
    ]);
  });

  it('names the section dock something the header nav does not answer to', () => {
    expect(copy.labels.sectionNav).toBeTruthy();
    expect(copy.labels.sectionNav).not.toBe('Primary');
    expect(copy.labels.sectionNav.toLowerCase()).not.toContain('navigation');
  });

  it('links the resume at the path the PDF is served from', () => {
    const resume = copy.nav.find((n) => n.id === 'resume');
    expect(resume?.href).toBe('/rain-zhang-resume.pdf');
  });
});

describe('Japanese content', () => {
  // Carried over from the previous site: /ja must never make a claim the
  // English page does not. A translation pass should not be able to add a
  // language certificate, a proficiency level or anything about immigration
  // status — adding one is a deliberate decision, made in both locales.
  const forbidden: Array<[string, RegExp]> = [
    ['a JLPT level', /JLPT|日本語能力試験/i],
    ['a language proficiency level', /日本語.{0,4}(ネイティブ|流暢|堪能|ビジネスレベル)/],
    ['a native-speaker claim', /母国語|ネイティブスピーカー/],
    [
      'a work visa or sponsorship claim',
      /就労ビザ|就労資格|ビザサポート|ビザ不要|ビザスポンサー|スポンサーシップ/,
    ],
    ['a residency claim', /永住|在留資格/],
  ];

  const japanese = JSON.stringify(ja);
  const english = JSON.stringify(en);

  it.each(forbidden)('makes no %s', (_label, pattern) => {
    expect(pattern.test(japanese)).toBe(false);
  });

  it.each(forbidden)('and neither does the English page — no %s', (_label, pattern) => {
    expect(pattern.test(english)).toBe(false);
  });
});
