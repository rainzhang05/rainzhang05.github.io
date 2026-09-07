import type { ResumeCopy } from '../types';

/**
 * The English resume, transcribed from public/rain-zhang-resume.pdf.
 *
 * Verbatim: every line is the PDF's own wording, in the PDF's own order.
 * Nothing is added, reworded or left out, and it is deliberately not derived
 * from lib/content/en.ts — the portfolio and the resume are two documents that
 * say different things. When the PDF changes, this file changes with it.
 */
export const resumeEn: ResumeCopy = {
  locale: 'en',
  meta: {
    title: 'Resume — Rain Zhang',
    description:
      'The resume of Rain Zhang, full-stack engineer and computer science student in Vancouver, BC. Read it here or download the PDF.',
  },
  tagline: 'Full-stack engineer · Computer Science, Simon Fraser University',
  contact: [
    [{ text: 'Vancouver, BC, Canada' }],
    [
      { text: '+1 (236) 333-7191', href: 'tel:+12363337191' },
      { text: 'rainzhang.zty@gmail.com', href: 'mailto:rainzhang.zty@gmail.com' },
    ],
    [
      { text: 'rainzhang.me', href: 'https://rainzhang.me' },
      { text: 'github.com/rainzhang05', href: 'https://github.com/rainzhang05' },
    ],
    [
      {
        text: 'linkedin.com/in/rainzhang05',
        href: 'https://www.linkedin.com/in/rainzhang05',
      },
    ],
  ],
  download: 'Download PDF',
  headings: {
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Skills',
    education: 'Education',
  },
  experience: [
    {
      id: 'resume-mnt',
      title: 'Software and IT Systems Specialist',
      meta: [{ text: 'MNT Realty' }, { text: 'Vancouver, BC, Canada' }],
      dates: 'Aug 2026 – present',
      bullets: [
        'Sole software engineer for the company, responsible for every internal system from architecture to hosting, deployment and ongoing maintenance.',
        'Redesigned and rebuilt the MNT Realty platform from the ground up: a new public website, an owner portal for residents, and a staff admin console in one application.',
        'Built MNT Control Center, an internal platform that brings the office’s scattered tools into one place, in Next.js, Node.js and PostgreSQL.',
        'Set up organization sign-in and role-based access with Microsoft Entra ID, the Graph API and OAuth 2.0.',
        'Automated recurring office work: sorting incoming email, looking up owner information, and answering staff questions from company documents.',
      ],
    },
    {
      id: 'resume-feitian',
      title: 'Full-Stack Engineer Intern',
      meta: [
        { text: 'FEITIAN Technologies' },
        { text: 'International Dept.' },
        { text: 'Beijing' },
      ],
      dates: 'Sep – Dec 2025',
      bullets: [
        'Built and ran three production systems for the post-quantum FIDO2 program: a public developer platform, a Rust software security key, and a customer demo site.',
        'Wrote a CTAP2.1 authenticator in Rust that Linux presents as a virtual USB security key, letting browsers test ML-DSA credentials before hardware existed.',
        'Deployed with Docker on Linux servers and Google Cloud Run; GitHub Actions ran tests, builds and a daily FIDO metadata refresh.',
        'Worked with hardware and security engineers so the tools matched real devices; still maintaining all three after the internship ended.',
      ],
    },
  ],
  projects: [
    {
      id: 'resume-mnt-platform',
      title: 'MNT Realty Platform',
      meta: [
        { text: 'Next.js' },
        { text: 'TypeScript' },
        { text: 'Node.js' },
        { text: 'PostgreSQL' },
        { text: 'Vercel' },
        { text: 'mntrealty.vercel.app', href: 'https://mntrealty.vercel.app' },
      ],
      dates: 'Aug 2026 – present',
      bullets: [
        'One application serving three surfaces: the public website, an owner portal for residents, and a staff admin console, each on its own subdomain.',
        'Host-based routing gives each surface its own chrome and session cookie; every read and write goes through one data-store contract.',
        'Navigation, page guards and file routes read one access table, so no role ever learns what another can see.',
      ],
    },
    {
      id: 'resume-webauthn',
      title: 'WebAuthn Developer Platform',
      meta: [
        { text: 'Python' },
        { text: 'Flask' },
        { text: 'Docker' },
        { text: 'liboqs' },
        { text: 'webauthnlab.tech', href: 'https://webauthnlab.tech' },
        {
          text: 'repository',
          href: 'https://github.com/feitiantech/postquantum-webauthn-platform',
        },
      ],
      dates: 'Sep 2025 – present',
      bullets: [
        'Public tool for FIDO2 developers: register and sign in with real or virtual authenticators, decode responses, and search the FIDO Alliance metadata service.',
        'Added ML-DSA-44, -65 and -87 to a fork of Yubico’s python-fido2 through liboqs, without breaking the classical paths.',
        'About 120 server test files plus frontend and post-quantum suites run in CI; a daily GitHub Action re-verifies the metadata snapshot.',
      ],
    },
  ],
  skills: [
    {
      id: 'languages',
      label: 'Languages',
      items: 'Python, TypeScript, JavaScript, Rust, C, C++, Java',
    },
    {
      id: 'web',
      label: 'Web',
      items: 'React, Next.js, Node.js, Flask, Tailwind CSS, HTML, CSS, REST APIs',
    },
    {
      id: 'data',
      label: 'Data and cloud',
      items: 'PostgreSQL, Docker, Google Cloud, Vercel, GitHub Actions, Git, Linux',
    },
    {
      id: 'security',
      label: 'Security',
      items:
        'WebAuthn, FIDO2, CTAP2.1, OAuth 2.0, Microsoft Entra ID, post-quantum cryptography (ML-DSA, liboqs)',
    },
    {
      id: 'testing',
      label: 'Testing',
      items: 'pytest, Vitest, Playwright, CI on GitHub Actions',
    },
  ],
  education: {
    school: 'Simon Fraser University',
    lines: ['Bachelor of Science, Computer Science', 'Vancouver, BC, Canada'],
    notes: [
      'Sep 2023 – Apr 2027 · CGPA 3.44 / 4.33',
      'Dean’s Honour Roll, Fall 2024 and Summer 2025',
    ],
  },
};
