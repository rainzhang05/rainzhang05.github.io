import type { Copy, NavLink } from './types';

/**
 * The four in-page sections, in document order.
 *
 * Deliberately not derived from copy.nav: that list adds the resume PDF and
 * leaves out Background, so no filter of it produces this set. The footer and
 * the section dock both navigate exactly these four, and both read them from
 * here — a third hand-written copy is how the header ended up calling #work
 * "Work" while the footer calls it "Selected Work".
 *
 * Section ids are English in both locales because hash links depend on them;
 * only the labels are translated.
 */
export function sectionLinks(copy: Copy): NavLink[] {
  return [
    { id: 'experience', label: copy.sections.experience, href: '#experience' },
    { id: 'work', label: copy.sections.work, href: '#work' },
    { id: 'background', label: copy.sections.background, href: '#background' },
    { id: 'contact', label: copy.sections.contact, href: '#contact' },
  ];
}
