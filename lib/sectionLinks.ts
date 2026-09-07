import type { Copy, NavLink } from './types';

/**
 * The five in-page sections, in document order.
 *
 * `id` is the element the dock *watches*; `href` is where the link *goes*. For
 * every entry but the first they are the same element. Introduction is watched
 * as #intro, a real section an IntersectionObserver can answer for, and goes to
 * #top — the document top, where the wordmark and the footer's "Back to top"
 * also go. #top itself can never be the watched element: it wraps the whole
 * page, so it always intersects and would pin the active section to the first
 * one forever.
 *
 * Deliberately not derived from copy.nav: that list adds the resume PDF and
 * leaves out Background, so no filter of it produces this set. The footer and
 * the section dock both navigate exactly these, and both read them from here —
 * a second hand-written copy is how the header ended up calling #work "Work"
 * while the footer calls it "Selected Work".
 *
 * Section ids are English in both locales because hash links depend on them;
 * only the labels are translated.
 */
export function sectionLinks(copy: Copy): NavLink[] {
  return [
    { id: 'intro', label: copy.sections.intro, href: '#top' },
    { id: 'experience', label: copy.sections.experience, href: '#experience' },
    { id: 'work', label: copy.sections.work, href: '#work' },
    { id: 'background', label: copy.sections.background, href: '#background' },
    { id: 'contact', label: copy.sections.contact, href: '#contact' },
  ];
}

/** The element a link scrolls to, which is not always the id it is known by. */
export function targetId(link: NavLink): string {
  return link.href.startsWith('#') ? link.href.slice(1) : link.id;
}
