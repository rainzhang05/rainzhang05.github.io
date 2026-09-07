import type { TechName } from './tech';

export interface DetailGroup {
  /** Eyebrow above the group, e.g. "Work". */
  label: string;
  items: string[];
}

export interface CompanyMark {
  src: string;
  width: number;
  height: number;
  /**
   * Optical adjustment against the shared cap height, when matching the ink
   * exactly does not make two marks weigh the same. 1 leaves it alone.
   */
  scale?: number;
}

export interface Experience {
  id: string;
  dates: string;
  role: string;
  /** Accessible name for the company mark. */
  org: string;
  /** Organisation, department and place, joined with middle dots. */
  orgLine: string;
  mark?: CompanyMark;
  summary: string;
  groups: DetailGroup[];
  tech: TechName[];
  /** Project ids opened by the "Related work" links. */
  related: string[];
}

export interface ProjectSection {
  label: string;
  text: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  id: string;
  dates: string;
  title: string;
  summary: string;
  /** One to three marks shown while the row is collapsed. */
  primary: TechName[];
  sections: ProjectSection[];
  image?: ProjectImage;
  stack: TechName[];
  status: string;
  /** Live site and repository, at the end of the collapsed row. */
  links: { label: string; href: string }[];
}

export interface SkillGroup {
  label: string;
  items: TechName[];
}

export interface Education {
  dates: string;
  school: string;
  meta: string;
  detail: string;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
  external?: boolean;
}

export interface Copy {
  locale: string;
  meta: {
    title: string;
    description: string;
    /** Alt text for the share card in public/og.png. */
    ogAlt: string;
  };
  nav: NavLink[];
  intro: {
    eyebrow: string;
    heading: string;
    body: string;
    resume: string;
    copyEmail: string;
  };
  sections: {
    intro: string;
    experience: string;
    work: string;
    otherWork: string;
    background: string;
    contact: string;
  };
  labels: {
    technologies: string;
    relatedWork: string;
    stack: string;
    status: string;
    expand: string;
    collapse: string;
    skipToContent: string;
    /** Accessible name for the section dock. Must not collide with "Primary". */
    sectionNav: string;
  };
  experiences: Experience[];
  featured: Project[];
  other: Project[];
  education: Education;
  skills: SkillGroup[];
  contact: {
    lead: string;
    copy: string;
    copied: string;
    /** Row labels down the left of the contact list. */
    channels: { email: string; linkedin: string; github: string };
    form: {
      name: string;
      email: string;
      message: string;
      submit: string;
      sending: string;
      sentTitle: string;
      sentBody: string;
      another: string;
      required: string;
      invalidEmail: string;
      failed: string;
    };
  };
  footer: {
    tagline: string;
    navigate: string;
    elsewhere: string;
    backToTop: string;
    credit: string;
    links: NavLink[];
  };
}

/**
 * The resume page. A verbatim transcription of the PDF for that language —
 * two independently written documents, not a translation of one another and
 * not derived from the portfolio's own experiences, projects or skills, which
 * say different things. Nothing here is reworded, added or left out; if the
 * PDF changes, this changes with it.
 */

/** One segment of a middle-dot separated line. `href` makes it a link. */
export interface ResumePart {
  text: string;
  href?: string;
}

/** A role or a project: title, a meta line, a date range, and its bullets. */
export interface ResumeEntry {
  id: string;
  title: string;
  /** The organisation line, or a project's stack and links. */
  meta: ResumePart[];
  dates: string;
  bullets: string[];
}

/** One labelled group in the skills column, its items left as written. */
export interface ResumeGroup {
  id: string;
  label: string;
  items: string;
}

export interface ResumeCopy {
  locale: string;
  meta: {
    title: string;
    description: string;
  };
  /** The line under the name. */
  tagline: string;
  /** The masthead's right-hand block, one array per line. */
  contact: ResumePart[][];
  /** The one string here the PDF does not contain. */
  download: string;
  headings: {
    experience: string;
    projects: string;
    skills: string;
    education: string;
  };
  experience: ResumeEntry[];
  projects: ResumeEntry[];
  skills: ResumeGroup[];
  /** The education block, one line each, as the PDF sets them. */
  education: string[];
}
