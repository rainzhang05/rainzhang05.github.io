import { describe, expect, it } from 'vitest';
import { resume, resumeEn, resumeJa } from '@/lib/content';
import { locales, resumeFile } from '@/lib/site';
import type { ResumeCopy } from '@/lib/types';

/**
 * The two resumes are separate documents, not translations of one another, so
 * only what they genuinely share is compared: which entries there are, how
 * many bullets each carries, and where every link goes. What they do not share
 * is left alone — the Japanese education block runs to one more note than the
 * English, and the two skills columns list different numbers of items.
 */
const shape = (r: ResumeCopy) => ({
  contact: r.contact.map((line) => line.map((part) => part.href ?? null)),
  experience: r.experience.map((e) => [e.id, e.meta.length, e.bullets.length]),
  projects: r.projects.map((p) => [
    p.id,
    p.meta.map((part) => part.href ?? null),
    p.bullets.length,
  ]),
  skills: r.skills.map((g) => g.id),
});

describe('resume content', () => {
  it('exposes exactly the locales the site routes', () => {
    expect(Object.keys(resume).sort()).toEqual([...locales].sort());
  });

  it('keeps English and Japanese structurally identical', () => {
    expect(shape(resumeJa)).toEqual(shape(resumeEn));
  });

  it('is written twice, not translated once', () => {
    expect(resumeJa.tagline).not.toBe(resumeEn.tagline);
    expect(resumeJa.headings.experience).not.toBe(resumeEn.headings.experience);
    expect(resumeJa.download).not.toBe(resumeEn.download);
    expect(resumeJa.education.school).not.toBe(resumeEn.education.school);
  });

  it('declares its own locale tag', () => {
    expect(resumeEn.locale).toBe('en');
    expect(resumeJa.locale).toBe('ja');
  });
});

describe.each(locales)('%s resume', (locale) => {
  const r = resume[locale];

  it('gives every entry a unique id', () => {
    const ids = [
      ...r.experience.map((e) => e.id),
      ...r.projects.map((p) => p.id),
      ...r.skills.map((g) => g.id),
    ];

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('links only to somewhere a browser can go', () => {
    const hrefs = [
      ...r.contact.flat(),
      ...r.experience.flatMap((e) => e.meta),
      ...r.projects.flatMap((p) => p.meta),
    ]
      .map((part) => part.href)
      .filter((href): href is string => Boolean(href));

    expect(hrefs.length).toBeGreaterThan(0);
    hrefs.forEach((href) => expect(href).toMatch(/^(https:\/\/|mailto:|tel:)/));
  });

  it('has no empty strings — a line dropped in transcription is a bug', () => {
    const empty = (JSON.stringify(r).match(/""/g) ?? []).length;

    expect(empty).toBe(0);
  });

  it('is the one-page document the PDF is', () => {
    expect(r.experience).toHaveLength(2);
    expect(r.projects).toHaveLength(2);
    expect(r.skills).toHaveLength(5);
    expect(r.education.lines).toHaveLength(2);
    r.experience.forEach((e) => expect(e.bullets.length).toBeGreaterThanOrEqual(4));
    r.projects.forEach((p) => expect(p.bullets).toHaveLength(3));
  });

  it('names a PDF this locale actually serves', () => {
    expect(resumeFile[locale]).toMatch(/^\/[a-z0-9-]+\.pdf$/);
  });
});
