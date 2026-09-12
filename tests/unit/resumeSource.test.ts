import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { resumeEn } from '@/lib/content/resume.en';
import { resumeJa } from '@/lib/content/resume.ja';
import type { ResumeCopy } from '@/lib/types';

/**
 * The resume exists twice: as the page (lib/content/resume.*.ts) and as the
 * source the PDF is printed from (resume/resume.*.html). AGENTS.md's rule is
 * that the two say the same thing word for word — this is what enforces it, so
 * rewording one and forgetting the other fails here rather than shipping a
 * download that contradicts the page.
 *
 * It compares text only. Everything about how the PDF is *set* — its geometry,
 * its line breaks, its one-page budget — lives in resume/ and is checked by
 * resume/compare.py against the shipped file.
 */

/*
 * Two differences between the documents are deliberate and not drift: the PDFs
 * are set with typewriter apostrophes where the page uses typographic ones, and
 * the PDFs close a bracket straight onto a middle dot where the page always
 * spaces it. Normalise both away and compare the words.
 */
const norm = (s: string | null | undefined) =>
  (s ?? '')
    .replace(/[’‘]/g, "'")
    .replace(/\s*·\s*/g, '·')
    .replace(/\s+/g, ' ')
    .trim();

function parse(locale: 'en' | 'ja') {
  const html = readFileSync(resolve(process.cwd(), `resume/resume.${locale}.html`), 'utf8');
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const all = (sel: string, root: ParentNode = doc) =>
    [...root.querySelectorAll(sel)].map((el) => norm(el.textContent));
  const entries = (block: number) =>
    [...doc.querySelectorAll(`.col-main .block:nth-of-type(${block}) .entry`)].map((el) => ({
      title: norm(el.querySelector('h3')?.textContent),
      meta: norm(el.querySelector('.org, .stack')?.textContent),
      dates: norm(el.querySelector('.dates')?.textContent),
      bullets: all('.bullets li', el),
    }));
  return {
    tagline: norm(doc.querySelector('.tagline')?.textContent),
    contact: all('.contact p'),
    experience: entries(1),
    projects: entries(2),
    skillLabels: all('.skill dt'),
    skillItems: all('.skill dd'),
    school: norm(doc.querySelector('.school')?.textContent),
    schoolLines: all('.school-lines p'),
    schoolNotes: all('.school-notes p'),
  };
}

const join = (parts: { text: string }[]) => norm(parts.map((p) => p.text).join(' · '));

describe.each(['en', 'ja'] as const)('the %s PDF source says what its page says', (locale) => {
  const copy: ResumeCopy = locale === 'en' ? resumeEn : resumeJa;
  const src = parse(locale);

  it('sets the same tagline', () => {
    expect(src.tagline).toBe(norm(copy.tagline));
  });

  it('sets the same contact block', () => {
    expect(src.contact).toEqual(copy.contact.map(join));
  });

  it.each([
    ['experience', 'experience'],
    ['projects', 'projects'],
  ] as const)('sets the same %s entries', (_label, key) => {
    expect(src[key]).toEqual(
      copy[key].map((entry) => ({
        title: norm(entry.title),
        meta: join(entry.meta),
        dates: norm(entry.dates),
        bullets: entry.bullets.map(norm),
      }))
    );
  });

  it('sets the same skills', () => {
    expect(src.skillLabels).toEqual(copy.skills.map((g) => norm(g.label)));
    expect(src.skillItems).toEqual(copy.skills.map((g) => norm(g.items)));
  });

  it('sets the same education', () => {
    expect(src.school).toBe(norm(copy.education.school));
    expect(src.schoolLines).toEqual(copy.education.lines.map(norm));
    expect(src.schoolNotes).toEqual(copy.education.notes.map(norm));
  });
});
