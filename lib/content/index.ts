import type { Copy, ResumeCopy } from '../types';
import type { Locale } from '../site';
import { en } from './en';
import { ja } from './ja';
import { resumeEn } from './resume.en';
import { resumeJa } from './resume.ja';

export const content: Record<Locale, Copy> = { en, ja };
export { en, ja };

/**
 * The resume, kept out of Copy on purpose. PortfolioPage takes the whole copy
 * object as a prop, so anything in Copy is serialised into the home page's
 * payload — and the resume is a separate document only /resume reads.
 */
export const resume: Record<Locale, ResumeCopy> = { en: resumeEn, ja: resumeJa };
export { resumeEn, resumeJa };
