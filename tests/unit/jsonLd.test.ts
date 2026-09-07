import { describe, expect, it } from 'vitest';
import { personJsonLd } from '@/lib/jsonLd';
import { content } from '@/lib/content';
import { locales, site } from '@/lib/site';

describe.each(locales)('%s Person JSON-LD', (locale) => {
  const copy = content[locale];
  const raw = personJsonLd(copy);
  const data = JSON.parse(raw);

  it('is a Person tied to the canonical URL', () => {
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('Person');
    expect(data['@id']).toBe(site.url + '#person');
    expect(data.name).toBe(site.name);
    expect(data.url).toBe(site.url);
    expect(data.email).toBe('mailto:' + site.email);
    expect(data.image).toBe(site.url + site.ogImage);
  });

  it('claims only what the page itself says', () => {
    expect(data.description).toBe(copy.meta.description);
    expect(data.jobTitle).toBe(copy.experiences[0].role);
    expect(data.worksFor.name).toBe(copy.experiences[0].org);
    expect(data.alumniOf.name).toBe(copy.education.school);
    expect(data.knowsAbout).toEqual([...new Set(copy.skills.flatMap((g) => g.items))]);
    expect(data.sameAs).toEqual([site.github, site.linkedin]);
  });

  it('makes no claim about language proficiency or status', () => {
    expect(data.knowsLanguage).toBeUndefined();
    expect(data.nationality).toBeUndefined();
  });

  it('cannot close its own script tag', () => {
    expect(raw).not.toContain('<');
  });
});
