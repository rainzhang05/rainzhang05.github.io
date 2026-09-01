import type {
  AboutParagraph,
  EducationItem,
  Experience,
  FooterElsewhereLink,
  NavItem,
  Project,
  ProjectType,
  SkillGroup,
} from "@/lib/types";
import type { Locale } from "@/lib/i18n/config";

/**
 * Every user-facing string that lives in a component rather than in a data
 * file. Both locales implement this interface, so a missing key is a type
 * error rather than a silently untranslated string.
 */
export interface Copy {
  nav: {
    /** aria-label on the desktop <nav> element. */
    sectionsLabel: string;
    openMenu: string;
    closeMenu: string;
    /** Heading shown at the top of the mobile menu panel. */
    menuTitle: string;
  };
  theme: {
    toLight: string;
    toDark: string;
  };
  language: {
    /** aria-label on the language toggle group. */
    groupLabel: string;
  };
  preloader: {
    loading: string;
  };
  hero: {
    photoAlt: string;
    tagField: string;
    tagLocation: string;
    tagRole: string;
    intro: AboutParagraph;
    resume: string;
    getInTouch: string;
    emailCopied: string;
  };
  about: {
    title: string;
    kicker: string;
    paragraphs: AboutParagraph[];
  };
  experience: {
    title: string;
    kicker: string;
    logoAlt: string;
    scope: string;
    outcomes: string;
    technologies: string;
    related: string;
  };
  /**
   * Display labels for the `tagType` union. Content modules keep the semantic
   * English key so project/experience data stays comparable across locales.
   */
  tagLabels: Record<ProjectType, string>;
  projects: {
    title: string;
    kicker: string;
    /** alt text for a project thumbnail, given the project title. */
    previewAlt: (title: string) => string;
    live: string;
    code: string;
    readMore: string;
    collapse: string;
    role: string;
    tools: string;
    impact: string;
    technologies: string;
  };
  skills: {
    title: string;
    kicker: string;
  };
  education: {
    title: string;
    kicker: string;
  };
  contact: {
    title: string;
    intro: string;
    formLabel: string;
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    errors: {
      required: string;
      invalidEmail: string;
    };
    submit: string;
    sending: string;
    sentTitle: string;
    sentBody: string;
    sendFailed: string;
    emailCopied: string;
    copiedBadge: string;
  };
  footer: {
    tagline: string;
    navigateLabel: string;
    contactLabel: string;
    emailCopied: string;
    copiedBadge: string;
    credit: string;
    backToTop: string;
  };
  metadata: {
    title: string;
    description: string;
  };
}

/** Portfolio content that has a translated counterpart. */
export interface SiteContent {
  navItems: NavItem[];
  footerNav: NavItem[];
  footerElsewhere: FooterElsewhereLink[];
  projects: Project[];
  experiences: Experience[];
  skillGroups: SkillGroup[];
  education: EducationItem[];
}

export interface Dictionary {
  locale: Locale;
  copy: Copy;
  content: SiteContent;
}
