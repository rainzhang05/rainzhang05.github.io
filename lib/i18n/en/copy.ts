import type { Copy } from "@/lib/i18n/types";

export const EN_COPY: Copy = {
  nav: {
    sectionsLabel: "Sections",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuTitle: "Menu",
  },
  theme: {
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
  },
  language: {
    groupLabel: "Language",
  },
  preloader: {
    loading: "Loading",
  },
  hero: {
    photoAlt: "Portrait of Rain Zhang",
    tagField: "Computer Science · SFU",
    tagLocation: "Vancouver, BC",
    tagRole: "Full-stack engineer",
    intro: {
      parts: [
        "I'm a ",
        { strong: "Computer Science student at Simon Fraser University" },
        ", based in Vancouver, BC. I build full-stack web applications across Python, React, and TypeScript, and I'm currently open to software engineering internship and new-grad opportunities.",
      ],
    },
    resume: "Resume",
    getInTouch: "Get in touch",
    emailCopied: "Email copied!",
  },
  about: {
    title: "About",
    kicker: "A short read on who I am and how I work.",
    paragraphs: [
      {
        parts: [
          "I'm a ",
          { strong: "Computer Science undergraduate at Simon Fraser University" },
          " who builds full-stack systems across modern technology stacks — including Python, React, and TypeScript.",
        ],
      },
      {
        parts: [
          "I've delivered multiple end-to-end projects by rapidly learning new frameworks, integrating APIs, and turning ideas into products. My work emphasizes ",
          { strong: "scalable backend design, responsive interfaces, and maintainable code" },
          ".",
        ],
      },
      {
        parts: [
          "I'm particularly interested in full-stack software engineering and technical project execution — taking ownership of scalable features and delivering reliable solutions in fast-moving environments.",
        ],
      },
    ],
  },
  experience: {
    title: "Experience",
    kicker: "Roles and the systems I shipped.",
    scope: "Scope",
    outcomes: "Key outcomes",
    technologies: "Technologies",
    related: "Related work",
  },
  tagLabels: {
    Internship: "Internship",
    Academic: "Academic",
    Personal: "Personal",
  },
  projects: {
    title: "Selected work",
    kicker: "Selected work — production systems and experiments.",
    previewAlt: (title) => `${title} preview`,
    live: "Live",
    code: "Code",
    readMore: "Read more",
    collapse: "Collapse",
    role: "Role",
    tools: "Tools",
    impact: "Contributions & impact",
    technologies: "Technologies",
  },
  skills: {
    title: "Stack",
    kicker: "Languages, frameworks, and tools I reach for.",
  },
  education: {
    title: "Education",
    kicker: "Where I've studied.",
  },
  contact: {
    title: "Let's connect.",
    intro:
      "I'm always glad to connect. Whether you're reaching out about a role or looking for someone to build a custom website or software, leave a message and I'll get back to you.",
    formLabel: "Contact form",
    nameLabel: "Name",
    emailLabel: "Email",
    messageLabel: "Message",
    errors: {
      required: "Required",
      invalidEmail: "Invalid email",
    },
    submit: "Send message",
    sending: "Sending…",
    sentTitle: "Message sent.",
    sentBody: "Thanks — I'll get back to you as soon as possible.",
    sendFailed: "Couldn't reach the server — try emailing me directly.",
    emailCopied: "Email copied!",
    copiedBadge: "Copied!",
  },
  footer: {
    tagline:
      "Full-stack engineer focused on shipping production systems end-to-end across modern stacks.",
    navigateLabel: "Navigate",
    contactLabel: "Contact",
    emailCopied: "Email copied!",
    copiedBadge: "Copied!",
    credit: "Designed & built by Rain Zhang",
    backToTop: "Back to top",
  },
  metadata: {
    title: "Rain Zhang — Portfolio",
    description:
      "Computer Science student at Simon Fraser University. Full-stack engineer building production systems across Python, React, and TypeScript.",
  },
};
