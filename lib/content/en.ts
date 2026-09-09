import type { Copy } from '../types';

/**
 * All English copy and content. Facts come from the repositories
 * (see the Phase 1 audit); wording is the design system's voice.
 */
export const en: Copy = {
  locale: 'en',
  meta: {
    title: 'Rain Zhang — Software Engineer, Vancouver',
    description:
      'Fourth-year computer science student at SFU. I build and maintain web systems, from design through to production — Python, TypeScript and Rust.',
    ogAlt:
      'Rain Zhang — software engineer in Vancouver, BC. I build complete web systems and software end to end: interfaces, APIs, databases and CI/CD.',
  },
  nav: [
    {
      id: 'experience',
      label: 'Experience',
      href: '#experience',
    },
    {
      id: 'work',
      label: 'Work',
      href: '#work',
    },
    {
      id: 'contact',
      label: 'Contact',
      href: '#contact',
    },
    {
      id: 'resume',
      label: 'Resume',
      href: '/resume',
    },
  ],
  intro: {
    eyebrow: 'Computer science · Simon Fraser University · Vancouver, BC, Canada',
    heading: 'I build and maintain web systems, from design through to production.',
    body: 'I’m Rain, a fourth-year computer science student at SFU. In the past year I’ve built and run production systems for a security-key company and a property management firm, mostly in Python, TypeScript and Rust.',
    resume: 'Resume',
    copyEmail: 'Copy email',
  },
  sections: {
    intro: 'Introduction',
    experience: 'Experience',
    work: 'Selected Work',
    otherWork: 'Other Work',
    background: 'Background',
    contact: 'Contact',
  },
  labels: {
    technologies: 'Technologies',
    relatedWork: 'Related work',
    stack: 'Stack',
    status: 'Status',
    expand: 'Show details',
    collapse: 'Hide details',
    skipToContent: 'Skip to content',
    sectionNav: 'On this page',
  },
  experiences: [
    {
      id: 'exp-mnt',
      dates: 'Aug 2026 – Present',
      role: 'Software and IT Systems Specialist',
      org: 'MNT Realty',
      orgLine: 'MNT Realty · Vancouver, BC, Canada',
      mark: {
        src: '/logos/mnt-realty.svg',
        width: 28,
        height: 28,
        scale: 1.45,
      },
      summary:
        'The only engineer at a property and strata management company. I build and run the internal systems the office works from, and connect them to the company’s Microsoft 365 accounts and data.',
      groups: [
        {
          label: 'Work',
          items: [
            'Designed and built MNT Control Center, an internal platform that replaces the separate tools the office used before.',
            'Set up organisation sign-in and role-based access with Microsoft Entra ID, the Graph API and OAuth 2.0.',
            'Built the internal web applications behind it in Next.js, Node.js and PostgreSQL.',
            'Automated recurring office work: sorting incoming email, looking up owner records, and an internal assistant that answers staff questions from company documents.',
          ],
        },
        {
          label: 'Operations',
          items: [
            'Run hosting, deployment, domains and DNS, and the release workflow on Vercel and GitHub Actions.',
            'Write the tests and the documentation myself, so the systems can be handed over later.',
          ],
        },
      ],
      tech: [
        'Python',
        'TypeScript',
        'Next.js',
        'React',
        'Node.js',
        'Tailwind CSS',
        'PostgreSQL',
        'Microsoft 365',
        'Microsoft Entra ID',
        'Microsoft Graph API',
        'OAuth 2.0',
        'Docker',
        'Vercel',
        'GitHub Actions',
      ],
      related: ['work-mnt-platform'],
    },
    {
      id: 'exp-feitian',
      dates: 'Sep – Dec 2025',
      role: 'Full-Stack Engineer Intern',
      org: 'FEITIAN Technologies',
      orgLine: 'FEITIAN Technologies · International Department · Beijing, China',
      mark: {
        src: '/logos/feitian.svg',
        width: 336,
        height: 60,
      },
      summary:
        'Built three systems for FEITIAN’s post-quantum FIDO2 work and ran them end to end: a public WebAuthn developer platform, a software security key in Rust, and a customer demo site.',
      groups: [
        {
          label: 'Work',
          items: [
            'Built the company’s first WebAuthn/FIDO2 developer platform: one place to register, sign in, inspect and debug credentials, in place of the third-party tools the team had been using.',
            'Wrote a CTAP2 authenticator in Rust that Linux presents as a virtual USB security key, so browsers and libfido2 could test ML-DSA credentials before hardware existed.',
            'Built a self-service demo site so customers could try passwordless sign-in and security keys without going through support.',
          ],
        },
        {
          label: 'Delivery',
          items: [
            'Deployed with Docker on Linux servers and Google Cloud Run, with GitHub Actions running the tests, the builds and a daily FIDO metadata refresh.',
            'Worked with FEITIAN’s hardware and security engineers so the tools matched the real devices and the data they returned.',
            'The internship ended in December; I still maintain all three.',
          ],
        },
      ],
      tech: [
        'Python',
        'Flask',
        'JavaScript',
        'HTML',
        'Rust',
        'TypeScript',
        'React',
        'Tailwind CSS',
        'Docker',
        'Google Cloud',
        'GitHub Actions',
        'WebAuthn / FIDO2',
        'CTAP2.1',
        'ML-DSA',
        'liboqs',
      ],
      related: ['work-webauthn', 'work-demo', 'work-authenticator'],
    },
  ],
  featured: [
    {
      id: 'work-mnt-platform',
      dates: 'Aug 2026 – Present',
      title: 'MNT Realty Platform',
      summary:
        'One Next.js application serving three sites for a property management company: a public website, an owner portal for residents, and an admin console for staff.',
      primary: ['Next.js', 'TypeScript', 'React'],
      sections: [
        {
          label: 'What it is',
          text: 'The system MNT Realty runs on. Prospective clients see the public website. Residents of the stratas MNT manages sign in to the owner portal to read notices, book amenities and download documents. Staff run all of it from the admin console.',
        },
        {
          label: 'How it works',
          text: 'Three sites, three subdomains, one build. A proxy routes each subdomain to its own pages — admin to the console, owners to the portal — and the public site answers those same paths with a not-found page. Each keeps its own layout and its own host-only session cookie. Public pages are prerendered; the console and the portal render per request. Every read and write goes through one store interface, so what staff enter reaches residents at once and the store behind it can be swapped for the drafted PostgreSQL schema without touching a screen.',
        },
        {
          label: 'Technical challenges',
          text: 'Access is defined once, in a table that the navigation, the page guards and the file route all read. A section outside your role returns not-found rather than forbidden, so the portal never reveals what another role can see. Each strata is a hard boundary: while one is open, nothing from another is reachable. MNT’s own business facts — company details, the strata-document fee schedule, the amenity slot template — are versioned data an administrator edits under Settings rather than values in the source, with every saved version restorable.',
        },
      ],
      image: {
        src: '/projects/mnt-platform.webp',
        alt: 'The MNT Realty home page, with the service line and the proposal and owner-portal entry points',
        width: 1600,
        height: 800,
      },
      stack: [
        'Next.js',
        'React',
        'TypeScript',
        'Tailwind CSS',
        'Node.js',
        'PostgreSQL',
        'Vitest',
        'Vercel',
        'GitHub Actions',
      ],
      status:
        'All three are built and deployed; cloud data and backend workflows are next. The source belongs to MNT Realty and is not public.',
      links: [
        {
          label: 'mntrealty.vercel.app',
          href: 'https://mntrealty.vercel.app',
        },
      ],
    },
    {
      id: 'work-webauthn',
      dates: 'Sep 2025 – Present',
      title: 'WebAuthn Developer Platform',
      summary:
        'A public tool for testing FIDO2/WebAuthn flows, including post-quantum ML-DSA credentials.',
      primary: ['Python', 'Flask', 'JavaScript'],
      sections: [
        {
          label: 'What it is',
          text: 'A Flask web app for developers building on FIDO2. Register and sign in with real or virtual authenticators, edit the raw WebAuthn request as JSON, decode what comes back, and look up any authenticator in the FIDO Alliance metadata service. Built during my internship at FEITIAN, and I still maintain it.',
        },
        {
          label: 'How it works',
          text: 'Four tabs: simple sign-in, an advanced mode with an editable request, a codec for attestation objects and CBOR/CTAP structures, and a metadata explorer with root-certificate checks. The server is a modified copy of Yubico’s python-fido2 with ML-DSA-44, -65 and -87 added through liboqs. Each visitor gets an isolated session store, on local disk or Google Cloud Storage, cleaned up after 14 days of inactivity.',
        },
        {
          label: 'Technical challenges',
          text: 'python-fido2 had no post-quantum support, so I added the COSE identifiers, the key handling and the attestation checks for ML-DSA without disturbing the classical paths. Shipping liboqs in the image made Cloud Run slow to start, which led to a lazy warm-up and a one-worker gunicorn build. The FIDO metadata goes stale, so a daily GitHub Action re-verifies the snapshot and commits it — nobody has to remember.',
        },
      ],
      image: {
        src: '/projects/webauthn-platform.webp',
        alt: 'The advanced tab of the WebAuthn developer platform, with an editable request and a decoded response',
        width: 1600,
        height: 800,
      },
      stack: [
        'Python',
        'Flask',
        'JavaScript',
        'Docker',
        'Google Cloud',
        'GitHub Actions',
        'python-fido2',
        'liboqs',
        'Jinja',
        'pytest',
        'Vitest',
      ],
      status:
        'Live at webauthnlab.tech and maintained under FeitianTech. About 120 server test files, plus frontend and post-quantum tests, run in CI.',
      links: [
        {
          label: 'webauthnlab.tech',
          href: 'https://webauthnlab.tech',
        },
        {
          label: 'Repository',
          href: 'https://github.com/feitiantech/postquantum-webauthn-platform',
        },
      ],
    },
    {
      id: 'work-demo',
      dates: 'Nov – Dec 2025',
      title: 'Authentication Demo Platform',
      summary: 'A customer-facing site for trying FEITIAN’s passwordless and post-quantum sign-in.',
      primary: ['React', 'Python'],
      sections: [
        {
          label: 'What it is',
          text: 'A demo for FEITIAN’s customers and sales team. The developer platform is built for engineers; this one is for people evaluating the products. Register a security key, sign in, and watch a post-quantum credential work, without reading a specification.',
        },
        {
          label: 'How it works',
          text: 'A React front end over the same authentication service and ML-DSA support as the developer platform, with a guided interface in place of raw requests and responses.',
        },
      ],
      image: {
        src: '/projects/security-demo.webp',
        alt: 'The authentication demo platform sign-in screen',
        width: 1600,
        height: 800,
      },
      stack: ['React', 'JavaScript', 'Python', 'Flask', 'WebAuthn / FIDO2', 'ML-DSA', 'liboqs'],
      status: 'Live at demo.ftsafe.com. The source belongs to FEITIAN and is not public.',
      links: [
        {
          label: 'demo.ftsafe.com',
          href: 'https://demo.ftsafe.com',
        },
      ],
    },
    {
      id: 'work-authenticator',
      dates: 'Oct – Nov 2025',
      title: 'FIDO2 Software Authenticator',
      summary:
        'A CTAP2 security key in software. Linux presents it as a USB device, so browsers can test post-quantum credentials without hardware.',
      primary: ['Rust', 'Linux'],
      sections: [
        {
          label: 'What it is',
          text: 'A Rust workspace that behaves like a FIDO2 security key, in software. FEITIAN’s engineers and partners needed to develop against ML-DSA credentials before the hardware was ready. It started as my own repository and is now maintained under FeitianTech.',
        },
        {
          label: 'How it works',
          text: 'An authenticator core implements CTAP2.1 on the Trussed framework with littlefs2 storage: credential management, PIN/UV protocols 1 and 2, and reset. A runner registers a virtual USB HID device through Linux uhid and speaks CTAPHID, so Chrome, Firefox and libfido2 see an ordinary key. It advertises ES256 and ML-DSA-44, -65 and -87, and ships a small command-line tool (attach, detach, status, reset, pin) that can run as a daemon.',
        },
        {
          label: 'Technical challenges',
          text: 'Browsers are strict about what they will talk to, so the HID transport and the CTAP state machine had to be exact before Chrome or Firefox accepted the device. CTAP and COSE structures were designed around classical keys, and post-quantum ones do not fit them neatly. The first version called liboqs over a C FFI; it later moved to the pure-Rust fips204 crate, with secret keys zeroised on drop.',
        },
      ],
      stack: ['Rust', 'Linux UHID', 'Trussed', 'littlefs2', 'CTAP2.1', 'fips204', 'liboqs', 'clap'],
      status:
        'Works on Linux and is used alongside the developer platform. CI runs rustfmt, clippy and the test suite.',
      links: [
        {
          label: 'Repository',
          href: 'https://github.com/feitiantech/fidosoftwareauthenticator',
        },
      ],
    },
  ],
  other: [
    {
      id: 'work-site',
      dates: 'Feb 2025 – Present',
      title: 'Personal Portfolio Website',
      summary:
        'A statically generated portfolio in English and Japanese, built on one small design system shared with my resume and cover letter.',
      primary: ['Next.js', 'TypeScript'],
      sections: [
        {
          label: 'What it is',
          text: 'My portfolio, at rainzhang.me. One scrolling page in two languages, on its own small design system: one typeface, ivory paper, one accent colour, no borders or shadows. My resume and cover letter use the same system, so the three read as one piece of work.',
        },
        {
          label: 'How it works',
          text: 'Next.js App Router prerenders both languages at build time from one typed content model, so /en and /ja stay structurally identical and only the prose differs. Tailwind reads the design system’s tokens rather than raw values, Albert Sans is self-hosted through next/font, and middleware sends a first-time visitor in Japan to the Japanese route unless they have chosen otherwise.',
        },
        {
          label: 'Features',
          text: 'Experience and project rows expand in place, a language switch whose pill slides between English and Japanese, a first-screen entrance in pure CSS, a contact form that posts to Formspree behind a honeypot and a request timeout, and a copy-to-clipboard email. Everything renders without JavaScript and every duration honours prefers-reduced-motion.',
        },
      ],
      stack: [
        'Next.js',
        'TypeScript',
        'React',
        'Tailwind CSS',
        'Playwright',
        'Vitest',
        'Vercel',
        'GitHub Actions',
      ],
      status:
        'Live at rainzhang.me. Unit tests in Vitest and an end-to-end suite in Playwright across Chromium, Firefox, Safari and mobile run in CI.',
      links: [
        {
          label: 'rainzhang.me',
          href: 'https://rainzhang.me',
        },
        {
          label: 'Repository',
          href: 'https://github.com/rainzhang05/rainzhang05.github.io',
        },
      ],
    },
    {
      id: 'work-travel',
      dates: 'Jan – Apr 2025',
      title: 'Travel Advisor',
      summary:
        'A course project with three classmates: a trip planner that picks a destination from your passport and visas, then fills in hotels, restaurants and an itinerary.',
      primary: ['React', 'Tailwind CSS'],
      sections: [
        {
          label: 'What it is',
          text: 'A CMPT 276 group project. You answer a short questionnaire or pick a place, choose dates, and get hotels, restaurants, attractions and a day-by-day plan, with a chat assistant for follow-up questions.',
        },
        {
          label: 'My part',
          text: 'I built the React and Tailwind front end, the passport and visa questionnaire that asks OpenAI for a destination, the date steps and their validation, and the chat widget. A teammate wrote the Express service that fronts the Tripadvisor API.',
        },
        {
          label: 'Looking back',
          text: 'The OpenAI key is called from the browser. Today I would put it behind the backend.',
        },
      ],
      image: {
        src: '/projects/travel-advisor.webp',
        alt: 'The Travel Advisor results page with hotels, restaurants and attractions',
        width: 1600,
        height: 800,
      },
      stack: [
        'React',
        'JavaScript',
        'Tailwind CSS',
        'Vite',
        'OpenAI API',
        'Tripadvisor API',
        'Cypress',
        'Vercel',
      ],
      status: 'Finished in April 2025 and still live.',
      links: [
        {
          label: 'travel-advisor-project.vercel.app',
          href: 'https://travel-advisor-project.vercel.app',
        },
        {
          label: 'Repository',
          href: 'https://github.com/f4ncy1zach/travel-advisor',
        },
      ],
    },
  ],
  education: {
    dates: 'Sep 2023 – Apr 2027',
    school: 'Simon Fraser University',
    meta: 'BSc, Computer Science · Vancouver, BC, Canada · Graduating April 2027',
    detail: 'CGPA 3.44 / 4.33. Dean’s Honour Roll in Fall 2024 and Summer 2025.',
  },
  skills: [
    {
      label: 'Languages',
      items: ['Python', 'TypeScript', 'JavaScript', 'Rust', 'C', 'C++', 'Java'],
    },
    {
      label: 'Web',
      items: ['React', 'Next.js', 'Node.js', 'Flask', 'Tailwind CSS', 'HTML', 'CSS', 'PostgreSQL'],
    },
    {
      label: 'Infrastructure and tools',
      items: [
        'Docker',
        'Google Cloud',
        'Vercel',
        'GitHub Actions',
        'Git',
        'GitHub',
        'Linux',
        'WebAuthn / FIDO2',
        'Microsoft 365',
        'Microsoft Entra ID',
      ],
    },
  ],
  contact: {
    lead: 'If you’re hiring, or want to talk about any of this, please write to me.',
    copy: 'Copy',
    copied: 'Email copied',
    channels: {
      email: 'Email',
      linkedin: 'LinkedIn',
      github: 'GitHub',
    },
    form: {
      name: 'Name',
      email: 'Email',
      message: 'Message',
      submit: 'Send message',
      sending: 'Sending',
      sentTitle: 'Message sent.',
      sentBody: 'Thanks — I’ll get back to you as soon as I can.',
      another: 'Send another',
      required: 'Required',
      invalidEmail: 'That doesn’t look like an email address.',
      failed: 'Couldn’t reach the server — try emailing me directly.',
    },
  },
  footer: {
    tagline: 'Full-Stack Engineer and Computer Science Student in Vancouver.',
    navigate: 'Navigate',
    elsewhere: 'Elsewhere',
    backToTop: 'Back to top',
    credit: 'Designed and Built by Rain Zhang',
    links: [
      {
        id: 'github',
        label: 'GitHub',
        href: 'https://github.com/rainzhang05',
        external: true,
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/rainzhang05',
        external: true,
      },
      {
        id: 'resume',
        label: 'Resume',
        href: '/resume',
      },
    ],
  },
};
