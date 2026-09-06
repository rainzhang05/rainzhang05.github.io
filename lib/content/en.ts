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
      'Third-year computer science student at SFU. I build and maintain web systems, from design through to production — Python, TypeScript and Rust.',
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
      href: '/rain-zhang-resume.pdf',
      external: true,
    },
  ],
  intro: {
    eyebrow: 'Computer science · Simon Fraser University · Vancouver, BC',
    heading: 'I build and maintain web systems, from design through to production.',
    body: 'I’m Rain, a third-year computer science student at SFU. In the past year I’ve built and run production systems for a security-key company and a property management firm, mostly in Python, TypeScript and Rust.',
    availability: 'Open to software engineering internships and new-grad roles.',
    resume: 'Download resume',
    copyEmail: 'Copy email',
    portraitAlt: 'Rain Zhang',
  },
  sections: {
    experience: 'Experience',
    work: 'Selected work',
    otherWork: 'Other work',
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
  },
  experiences: [
    {
      id: 'exp-mnt',
      dates: 'Aug 2026 – present',
      role: 'Software and IT Systems Specialist',
      org: 'MNT Realty',
      orgLine: 'MNT Realty · Vancouver, BC',
      mark: {
        src: '/logos/mnt-realty.svg',
        width: 28,
        height: 28,
      },
      summary:
        'The only engineer at a property and strata management company. I build and run the internal systems the office works from, and connect them to the company’s Microsoft 365 accounts and data.',
      groups: [
        {
          label: 'Work',
          items: [
            'Designed and built MNT Control Center, an internal platform that brings the company’s scattered tools into one place.',
            'Set up organisation sign-in and role-based access with Microsoft Entra ID, the Graph API and OAuth 2.0.',
            'Built the internal web applications behind it in Next.js, Node.js and PostgreSQL.',
            'Automated recurring office work: sorting incoming email, looking up owner information, and answering staff questions from company documents through an internal assistant.',
          ],
        },
        {
          label: 'Operations',
          items: [
            'Look after hosting, deployment, domains and DNS, and the release workflow on Vercel and GitHub Actions.',
            'Test, maintain and document everything myself, so the systems can be handed over one day.',
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
      related: [],
    },
    {
      id: 'exp-feitian',
      dates: 'Sep – Dec 2025',
      role: 'Full-Stack Engineer Intern',
      org: 'FEITIAN Technologies',
      orgLine: 'FEITIAN Technologies · International Department · Beijing',
      mark: {
        src: '/logos/feitian.svg',
        width: 88,
        height: 22,
      },
      summary:
        'Built three systems for FEITIAN’s post-quantum FIDO2 work and ran them end to end: a public WebAuthn developer platform, a software security key in Rust, and a customer demo site.',
      groups: [
        {
          label: 'Work',
          items: [
            'Designed and built the company’s first WebAuthn/FIDO2 developer platform, replacing scattered third-party tools with one place to register, sign in, inspect and debug credentials.',
            'Wrote a CTAP2 authenticator in Rust that Linux presents as a virtual USB security key, so browsers and libfido2 could test ML-DSA credentials before hardware existed.',
            'Built a self-service demo site so customers could try passwordless sign-in and security keys without going through support.',
          ],
        },
        {
          label: 'Delivery',
          items: [
            'Deployed with Docker on Linux servers and Google Cloud Run; GitHub Actions for tests, builds and a daily FIDO metadata refresh.',
            'Worked with FEITIAN’s hardware and security engineers so the tools matched real devices and the data they needed.',
            'Kept maintaining all three after the internship ended.',
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
      related: ['work-webauthn', 'work-authenticator', 'work-demo'],
    },
  ],
  featured: [
    {
      id: 'work-webauthn',
      dates: 'Sep – Oct 2025',
      title: 'WebAuthn Developer Platform',
      summary:
        'A public tool for testing FIDO2/WebAuthn flows, including post-quantum ML-DSA credentials.',
      primary: ['Python', 'Flask', 'JavaScript'],
      quiet: {
        label: 'webauthnlab.tech',
        href: 'https://webauthnlab.tech',
      },
      sections: [
        {
          label: 'What it is',
          text: 'A Flask web app for developers building on FIDO2. Register and sign in with real or virtual authenticators, edit the raw WebAuthn request as JSON, decode what comes back, and look up any authenticator in the FIDO Alliance metadata service. Built at FEITIAN during my internship and still maintained.',
        },
        {
          label: 'How it works',
          text: 'Four tabs: simple sign-in, an advanced mode with an editable request, a codec for attestation objects and CBOR/CTAP structures, and a metadata explorer with root-certificate checks. The server is a modified copy of Yubico’s python-fido2 with ML-DSA-44, -65 and -87 added through liboqs. Each visitor gets an isolated session store, on local disk or Google Cloud Storage, cleaned up after 14 days of inactivity.',
        },
        {
          label: 'What was hard',
          text: 'Teaching the library algorithms it did not know: new COSE identifiers, key handling and attestation checks, without breaking the classical paths. Keeping Cloud Run cold starts short with liboqs in the image, which led to lazy warm-up and a one-worker gunicorn build. Keeping the metadata current without a person in the loop: a daily GitHub Action re-verifies and commits the snapshot.',
        },
      ],
      image: {
        src: '/projects/webauthn-platform.png',
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
          label: 'Repository',
          href: 'https://github.com/feitiantech/postquantum-webauthn-platform',
        },
        {
          label: 'Live site',
          href: 'https://webauthnlab.tech',
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
      quiet: {
        label: 'Repository',
        href: 'https://github.com/feitiantech/fidosoftwareauthenticator',
      },
      sections: [
        {
          label: 'What it is',
          text: 'A Rust workspace that behaves like a FIDO2 security key without the key. It exists so FEITIAN’s engineers and partners could develop against ML-DSA credentials before the hardware was ready. It started as my own repository and is now maintained under FeitianTech.',
        },
        {
          label: 'How it works',
          text: 'An authenticator core implements CTAP2.1 on the Trussed framework with littlefs2 storage: credential management, PIN/UV protocols 1 and 2, and reset. A runner registers a virtual USB HID device through Linux uhid and speaks CTAPHID, so Chrome, Firefox and libfido2 see an ordinary key. It advertises ES256 and ML-DSA-44, -65 and -87, and ships a small command-line tool (attach, detach, status, reset, pin) that can run as a daemon.',
        },
        {
          label: 'What was hard',
          text: 'Getting the HID transport and the CTAP state machine right enough that real browsers accept it. Fitting post-quantum keys into CTAP and COSE structures made for classical ones. The first version called liboqs over a C FFI; it later moved to the pure-Rust fips204 crate, with secret keys zeroised on drop.',
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
    {
      id: 'work-demo',
      dates: 'Nov – Dec 2025',
      title: 'Authentication Demo Platform',
      summary: 'A customer-facing site for trying FEITIAN’s passwordless and post-quantum sign-in.',
      primary: ['React', 'Python'],
      quiet: {
        label: 'demo.ftsafe.com',
        href: 'https://demo.ftsafe.com',
      },
      sections: [
        {
          label: 'What it is',
          text: 'A demo for FEITIAN’s customers and sales team. Where the developer platform is built for engineers, this one is for people evaluating the products: register a security key, sign in, and see a post-quantum credential work, without reading a specification.',
        },
        {
          label: 'How it works',
          text: 'A React front end over the same authentication service and ML-DSA support as the developer platform, with a guided interface in place of raw requests and responses.',
        },
      ],
      image: {
        src: '/projects/security-demo.png',
        alt: 'The authentication demo platform sign-in screen',
        width: 1600,
        height: 800,
      },
      stack: ['React', 'JavaScript', 'Python', 'Flask', 'WebAuthn / FIDO2', 'ML-DSA', 'liboqs'],
      status: 'Live at demo.ftsafe.com. The source belongs to FEITIAN and is not public.',
      links: [
        {
          label: 'Live site',
          href: 'https://demo.ftsafe.com',
        },
      ],
    },
  ],
  other: [
    {
      id: 'work-travel',
      dates: 'Jan – Apr 2025',
      title: 'Travel Advisor',
      summary:
        'A course project with three classmates: a trip planner that picks a destination from your passport and visas, then fills in hotels, restaurants and an itinerary.',
      primary: ['React', 'Tailwind CSS'],
      quiet: {
        label: 'Live site',
        href: 'https://travel-advisor-project.vercel.app',
      },
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
        src: '/projects/travel-advisor.png',
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
          label: 'Live site',
          href: 'https://travel-advisor-project.vercel.app',
        },
        {
          label: 'Repository',
          href: 'https://github.com/f4ncy1zach/travel-advisor',
        },
      ],
    },
    {
      id: 'work-site',
      dates: 'Feb 2025 – present',
      title: 'This Website',
      summary:
        'Next.js and TypeScript, built on one small design system shared with my resume and cover letter.',
      primary: ['Next.js', 'TypeScript'],
      quiet: {
        label: 'Repository',
        href: 'https://github.com/rainzhang05/rainzhang05.github.io',
      },
      sections: [
        {
          label: 'What it is',
          text: 'My portfolio, rebuilt in 2026 around a design system I made first: one typeface, ivory paper, one accent, no borders or shadows. The resume and cover letter use the same system, so everything a recruiter sees from me comes from one hand.',
        },
        {
          label: 'How it works',
          text: 'Next.js App Router with static generation, Tailwind reading the system’s tokens, self-hosted Albert Sans, English and Japanese routes. Everything is in the page before it renders; the first screen settles in once, in CSS, and nothing waits on a script.',
        },
      ],
      stack: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'Vercel', 'GitHub Actions'],
      status: 'Live at rainzhang.me.',
      links: [
        {
          label: 'Repository',
          href: 'https://github.com/rainzhang05/rainzhang05.github.io',
        },
      ],
    },
  ],
  education: {
    dates: 'Sep 2023 – Apr 2027',
    school: 'Simon Fraser University',
    meta: 'BSc, Computer Science · Burnaby, BC · graduating April 2027',
    detail: 'CGPA 3.43 / 4.33. Dean’s Honour Roll in Fall 2024 and Summer 2025.',
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
    lead: 'If you’re hiring, or want to talk about any of this, write to me.',
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
        id: 'email',
        label: 'rainzhang.zty@gmail.com',
        href: 'mailto:rainzhang.zty@gmail.com',
      },
      {
        id: 'resume',
        label: 'Resume (PDF)',
        href: '/rain-zhang-resume.pdf',
        external: true,
      },
    ],
  },
};
