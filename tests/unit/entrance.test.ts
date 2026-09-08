import { describe, expect, it } from 'vitest';
import { entranceFor, entranceFromHash } from '@/lib/entrance';
import { localeHome } from '@/lib/site';

/**
 * Which section arrives. The resume page links at every section of the home
 * page, so this is what decides whether the reader watches the first screen's
 * cascade or the one thing they actually asked for.
 */
describe('entranceFromHash', () => {
  it('names the section a link arrives at', () => {
    expect(entranceFromHash('#experience')).toBe('experience');
    expect(entranceFromHash('#work')).toBe('work');
    expect(entranceFromHash('#background')).toBe('background');
    expect(entranceFromHash('#contact')).toBe('contact');
  });

  it('treats the document top as the first screen', () => {
    // "#top" is where the wordmark and "Back to top" go: it is the page, not a
    // section, and arriving there is arriving at the intro.
    expect(entranceFromHash('#top')).toBe('intro');
    expect(entranceFromHash('')).toBe('intro');
    expect(entranceFromHash('#')).toBe('intro');
  });

  it('falls back to the first screen for a hash that is not a section', () => {
    expect(entranceFromHash('#intro')).toBe('intro');
    expect(entranceFromHash('#main')).toBe('intro');
    expect(entranceFromHash('#nonsense')).toBe('intro');
  });
});

describe('entranceFor', () => {
  it('reads the hash on either home page', () => {
    expect(entranceFor(localeHome.en, '#work')).toBe('work');
    expect(entranceFor(localeHome.ja, '#work')).toBe('work');
  });

  it('clears itself off the home page, so a stale value cannot silence the resume', () => {
    expect(entranceFor('/resume', '#work')).toBe('intro');
    expect(entranceFor('/ja/resume', '#contact')).toBe('intro');
  });
});
