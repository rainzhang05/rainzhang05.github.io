import { describe, expect, it } from 'vitest';
import { personJsonLd } from '@/lib/jsonLd';
import { content, en } from '@/lib/content';
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
    expect(data.alumniOf.name).toBe(copy.education.school);
    expect(data.knowsAbout).toEqual([...new Set(copy.skills.flatMap((g) => g.items))]);
    expect(data.sameAs).toEqual([site.github, site.linkedin]);
  });

  it('names a job and an employer only for a role the page marks as current', () => {
    const current = copy.experiences.find((item) => item.current);

    expect(data.jobTitle).toBe(current?.role);
    expect(data.worksFor?.name).toBe(current?.org);
  });

  it('makes no claim about language proficiency or status', () => {
    expect(data.knowsLanguage).toBeUndefined();
    expect(data.nationality).toBeUndefined();
  });

  it('cannot close its own script tag', () => {
    expect(raw).not.toContain('<');
  });
});

describe('the current role in the Person JSON-LD', () => {
  const [latest, earlier] = en.experiences;

  it('is the one marked current, not simply the first row', () => {
    const held = { ...earlier, current: true };
    const data = JSON.parse(personJsonLd({ ...en, experiences: [latest, held] }));

    expect(data.jobTitle).toBe(held.role);
    expect(data.worksFor).toEqual({ '@type': 'Organization', name: held.org });
  });

  it('is left out altogether when no role is marked current', () => {
    const past = en.experiences.map((item) => ({ ...item, current: false }));
    const data = JSON.parse(personJsonLd({ ...en, experiences: past }));

    expect(data).not.toHaveProperty('jobTitle');
    expect(data).not.toHaveProperty('worksFor');
  });
});
