import type { Copy } from '../types';

/**
 * All English copy and content. Facts come from the repositories
 * (see the Phase 1 audit); wording is the design system's voice.
 */
export const en: Copy = {
  locale: 'en',
  meta: {
    title: 'Rain Zhang — Full-Stack Developer, Vancouver',
    description:
      'Fourth-year computer science student at Simon Fraser University. I build and maintain web applications and developer tools, mostly in Python, TypeScript and Rust.',
    ogAlt:
      'Portfolio card for Rain Zhang, software engineer in Vancouver, BC, who builds web systems with Python, TypeScript, Rust, Next.js and React.',
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
    eyebrow: 'Full-Stack Developer · Simon Fraser University · Vancouver, BC, Canada',
    heading: 'Hello, I’m Rain Zhang.',
    body: 'I’m a fourth-year computer science student at SFU. Over the past year I’ve built and maintained software for a security-key company and a property management company. I work mostly in Python, TypeScript and Rust.',
    resume: 'Resume',
    copyEmail: 'Copy email',
    github: 'GitHub',
    linkedin: 'LinkedIn',
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
    theme: { group: 'Theme', system: 'System', light: 'Light', dark: 'Dark' },
    navigation: { primary: 'Primary', menu: 'Menu', closeMenu: 'Close menu' },
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
        'I’m responsible for software and IT at a property and strata management company. I work with staff to understand what the office needs, then build and maintain the internal systems they use, connected to the company’s Microsoft 365 accounts and data.',
      groups: [
        {
          label: 'Work',
          items: [
            'Planned and rebuilt the MNT Realty platform from scratch as one application for three sites: a public website, an owner portal for residents, and an admin console for staff.',
            'Designed and built MNT Control Center, an internal platform in Next.js, Node.js and PostgreSQL that replaces the separate tools the office used before.',
            'Set up organization sign-in and role-based access with Microsoft Entra ID, the Graph API and OAuth 2.0.',
            'Automated the recurring office tasks that took staff the most time: sorting incoming email, looking up owner information, and answering staff questions from company documents with an internal assistant.',
          ],
        },
        {
          label: 'Operations',
          items: [
            'Manage hosting, deployment, domains and DNS, and the release process on Vercel and GitHub Actions.',
            'Write tests and documentation so that someone else can take over the systems later.',
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
        src: '/logos/feitian.png',
        width: 1748,
        height: 428,
      },
      summary:
        'I planned, built and ran three systems for FEITIAN’s post-quantum FIDO2 work: a public WebAuthn developer platform, a software security key in Rust, and a customer demo site.',
      groups: [
        {
          label: 'Work',
          items: [
            'Built the company’s first WebAuthn/FIDO2 developer platform, because the team’s third-party tools could not show post-quantum credentials. Developers can register, sign in, inspect and debug credentials in one place.',
            'Wrote a CTAP2 authenticator in Rust that Linux presents as a virtual USB security key, so browsers and libfido2 could test ML-DSA credentials before the hardware was ready.',
            'Built a self-service demo site where customers can try passwordless sign-in and security keys without contacting support.',
            'Worked with FEITIAN’s hardware and security engineers so the tools matched the real devices and the data they returned.',
          ],
        },
        {
          label: 'Operations',
          items: [
            'Deployed with Docker on Linux servers and Google Cloud Run, with GitHub Actions running tests, builds and a daily update of the FIDO metadata.',
            'Still maintain all three systems after the internship ended in December 2025.',
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
      related: ['work-authenticator', 'work-webauthn', 'work-demo'],
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
          text: 'MNT Realty’s website and online services. Prospective clients see the public website. Residents of the stratas MNT manages sign in to the owner portal to read notices, book amenities and download documents. Staff manage all of it from the admin console.',
        },
        {
          label: 'How it works',
          text: 'The three sites come from one build, each on its own subdomain. A proxy sends each subdomain to its own pages (admin to the console, owners to the portal), and the public site returns a not-found page for those paths. Each site has its own layout and its own host-only session cookie. Public pages are prerendered, and the console and the portal are rendered on each request. All reads and writes go through one data store interface, so changes staff make show up for residents right away, and the store can later be switched to the drafted PostgreSQL schema without changing any screens.',
        },
        {
          label: 'Technical challenges',
          text: 'Access rules are defined once, in a table that the navigation, the page guards and the file route all read. A section outside a user’s role returns not-found rather than forbidden, so the portal does not reveal what other roles can see. Each strata is kept separate: while one is open, nothing from another can be reached. MNT’s own business details, such as company information, the fee schedule for strata documents and the template for amenity booking slots, are versioned data that an administrator edits under Settings, not values in the code. Any saved version can be restored.',
        },
      ],
      image: {
        src: '/projects/mnt-platform.webp',
        alt: 'The MNT Realty home page, with the Owner portal and Request a proposal buttons above a photo of the Vancouver skyline',
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
        'All three sites are built and deployed. The next steps are cloud data storage and backend workflows. The source code belongs to MNT Realty and is not public.',
      links: [
        {
          label: 'mntrealty.vercel.app',
          href: 'https://mntrealty.vercel.app',
        },
      ],
    },
    {
      id: 'work-authenticator',
      dates: 'Oct 2025 – Present',
      title: 'FIDO2 Software Authenticator',
      summary:
        'A CTAP2 security key that runs in software. Linux presents it as a USB device, so browsers can test post-quantum credentials without real hardware.',
      primary: ['Rust', 'Linux'],
      sections: [
        {
          label: 'What it is',
          text: 'A Rust workspace that works like a FIDO2 security key, but in software. FEITIAN’s engineers and partners needed to build and test software that uses ML-DSA credentials before the hardware was ready. It started in my own repository and has since moved to FEITIAN’s GitHub organization, where I still maintain it.',
        },
        {
          label: 'How it works',
          text: 'The authenticator core implements CTAP2.1 (credential management, PIN/UV protocols 1 and 2, and reset) on the Trussed framework with littlefs2 storage. A runner creates a virtual USB HID device through Linux uhid and uses the CTAPHID protocol, so Chrome, Firefox and libfido2 treat it as an ordinary security key. It supports ES256 and ML-DSA-44, -65 and -87, and comes with a small command-line tool (attach, detach, status, reset, pin) that can run in the background.',
        },
        {
          label: 'Technical challenges',
          text: 'Browsers only accept devices that follow the protocol closely, so the HID transport and the CTAP state machine had to be exact before Chrome or Firefox would use the key. CTAP and COSE structures were designed for classical keys, and post-quantum keys do not fit them easily. The first version called liboqs through a C FFI; it later moved to the pure-Rust fips204 crate, with secret keys zeroized when they are dropped.',
        },
      ],
      stack: ['Rust', 'Linux UHID', 'Trussed', 'littlefs2', 'CTAP2.1', 'fips204', 'liboqs', 'clap'],
      status:
        'Works on Linux and is used alongside the developer platform. It is still in active development, and CI runs rustfmt, clippy and the test suite.',
      links: [
        {
          label: 'Repository',
          href: 'https://github.com/feitiantech/fidosoftwareauthenticator',
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
          text: 'A Flask web application for developers who work with FIDO2. The third-party tools the team used could not show post-quantum credentials, so I built one that could. Developers can register and sign in with real or virtual authenticators, edit the raw WebAuthn request as JSON, decode the response, and look up any authenticator in the FIDO Alliance metadata service. I started it during my internship at FEITIAN and still maintain it.',
        },
        {
          label: 'How it works',
          text: 'It has four tabs: simple sign-in, an advanced mode with an editable request, a codec for attestation objects and CBOR/CTAP structures, and a metadata explorer that checks root certificates. The server uses a modified copy of Yubico’s python-fido2 library, with ML-DSA-44, -65 and -87 added through liboqs. Each visitor gets a separate session store, on local disk or in Google Cloud Storage, and a store that goes unused for 14 days is deleted.',
        },
        {
          label: 'Technical challenges',
          text: 'python-fido2 had no post-quantum support, so I added the COSE identifiers, key handling and attestation checks for ML-DSA while keeping the classical algorithms working. Including liboqs in the container image made Cloud Run slow to start, so I added a lazy warm-up and set gunicorn to run a single worker. The FIDO metadata goes out of date, so a daily GitHub Action re-verifies the snapshot and commits it automatically.',
        },
      ],
      image: {
        src: '/projects/webauthn-platform.webp',
        alt: 'The Advanced Authentication tab of the WebAuthn developer platform, with registration settings beside a JSON editor for the credential creation options',
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
        'Live at webauthnlab.tech and maintained in FEITIAN’s GitHub organization. CI runs about 120 server test files, plus front-end and post-quantum tests.',
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
      summary:
        'A demo site where FEITIAN’s customers can try passwordless and post-quantum sign-in.',
      primary: ['React', 'Python'],
      sections: [
        {
          label: 'What it is',
          text: 'A demo for FEITIAN’s customers and sales team. The developer platform is for engineers; this site is for people evaluating FEITIAN’s products. Visitors can register a security key, sign in, and see a post-quantum credential work without reading a specification.',
        },
        {
          label: 'How it works',
          text: 'A React front end on top of the same authentication service and ML-DSA support as the developer platform. Instead of raw requests and responses, it guides visitors through each step.',
        },
      ],
      image: {
        src: '/projects/security-demo.webp',
        alt: 'The Info page of the authentication demo platform, with a Password section and an Add Security Key button',
        width: 1600,
        height: 800,
      },
      stack: ['React', 'JavaScript', 'Python', 'Flask', 'WebAuthn / FIDO2', 'ML-DSA', 'liboqs'],
      status: 'Live at demo.ftsafe.com. The source code belongs to FEITIAN and is not public.',
      links: [
        {
          label: 'demo.ftsafe.com',
          href: 'https://demo.ftsafe.com',
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
        'A statically generated portfolio site in English and Japanese. It shares a small design system with my resume and cover letter.',
      primary: ['Next.js', 'TypeScript'],
      sections: [
        {
          label: 'What it is',
          text: 'My portfolio at rainzhang.me: a home page and a resume page, both in English and Japanese. It uses its own small design system: one typeface, one accent colour, no borders or shadows, and a light and a dark theme. My resume and cover letter use the same design, so the three look like one set.',
        },
        {
          label: 'How it works',
          text: 'The Next.js App Router prerenders both languages at build time from one typed content model, so the English and Japanese home pages have the same structure and only the text differs. Tailwind reads the design system’s tokens instead of raw values, and Albert Sans is self-hosted through next/font. Middleware shows a first-time visitor from Japan the Japanese version, and after that the site remembers the language each reader last used.',
        },
        {
          label: 'Features',
          text: 'Experience and project rows expand in place. The site also has a language switch, a theme switch (System, Light and Dark), a short entrance animation in plain CSS, a contact form that sends through Formspree with a honeypot field and a request timeout, and a button that copies my email address. The pages still load and their links still work without JavaScript, and every animation follows the reader’s reduced-motion setting.',
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
        'Live at rainzhang.me. CI runs Vitest unit tests and Playwright end-to-end tests in Chromium, Firefox and WebKit, plus an emulated iPhone.',
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
        'A course project with three classmates: a trip planner that suggests a destination based on a traveller’s passport and visas, then fills in hotels, restaurants and an itinerary.',
      primary: ['React', 'Tailwind CSS'],
      sections: [
        {
          label: 'What it is',
          text: 'A group project for CMPT 276. Users answer a short questionnaire or choose a place, pick their dates, and get hotels, restaurants, attractions and a day-by-day plan. A chat assistant answers follow-up questions.',
        },
        {
          label: 'My part',
          text: 'I built the React and Tailwind front end, the passport and visa questionnaire that asks OpenAI for a destination, the date steps and their validation, and the chat widget. A teammate wrote the Express service that connects to the Tripadvisor API.',
        },
        {
          label: 'Looking back',
          text: 'The app calls the OpenAI API directly from the browser. If I built it again, I would move that call to the backend.',
        },
      ],
      image: {
        src: '/projects/travel-advisor.webp',
        alt: 'The Travel Advisor start page, with a short description and a Start Your Journey button',
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
    dates: 'Sep 2023 – Dec 2027',
    school: 'Simon Fraser University',
    mark: {
      src: '/logos/sfu.png',
      width: 2560,
      height: 1280,
    },
    meta: 'BSc, Computer Science · Vancouver, BC, Canada · Expected to graduate in December 2027',
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
    lead: 'If you’re hiring or would like to talk about my work, I’d be glad to hear from you.',
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
      sentBody: 'Thank you. I’ll reply as soon as I can.',
      another: 'Send another',
      required: 'Required',
      invalidEmail: 'That doesn’t look like an email address.',
      failed: 'Couldn’t reach the server. Please email me directly instead.',
    },
  },
  footer: {
    tagline: 'Full-stack developer and computer science student in Vancouver.',
    navigate: 'Navigate',
    elsewhere: 'Elsewhere',
    backToTop: 'Back to top',
    credit: 'Designed and built by Rain Zhang',
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
