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
