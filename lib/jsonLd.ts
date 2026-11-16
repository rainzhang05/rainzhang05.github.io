import { site } from './site';
import type { Copy } from './types';

/**
 * Person structured data for the page, built entirely from facts the page
 * already states — the current role, the school, the skill lists — so the
 * markup can never claim more than the visible copy does. Driven by `copy`,
 * so /ja describes the same person in Japanese.
 *
 * A job title and an employer are named only for a role marked `current`. The
 * first row is the most recent one, which is not the same thing: once its
 * dates have an end, the page no longer says it is held.
 */
export function personJsonLd(copy: Copy): string {
  const current = copy.experiences.find((item) => item.current);
  const knowsAbout = [...new Set(copy.skills.flatMap((group) => group.items))];

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': site.url + '#person',
    name: site.name,
    url: site.url,
    email: 'mailto:' + site.email,
    image: site.url + site.ogImage,
    description: copy.meta.description,
    jobTitle: current?.role,
    worksFor: current ? { '@type': 'Organization', name: current.org } : undefined,
    alumniOf: { '@type': 'CollegeOrUniversity', name: copy.education.school },
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.location.locality,
      addressRegion: site.location.region,
      addressCountry: site.location.country,
    },
    knowsAbout,
    sameAs: [site.github, site.linkedin],
  };

  // A "<" in any content string would otherwise be able to close the script tag.
  return JSON.stringify(person).replace(/</g, '\\u003c');
}
