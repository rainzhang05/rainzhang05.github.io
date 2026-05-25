import type { Project } from "@/lib/types";

export const PROJECTS: Project[] = [
  {
    id: "security-demo",
    title: "Authentication & Security Demo Platform",
    summary:
      "A unified platform that showcases passwordless authentication and FIDO2 security keys to users. Visitors can register, sign in, and manage their credentials end-to-end.",
    image: "/projects/security-demo.png",
    period: "Nov — Dec 2025",
    role: "Full-Stack Developer",
    tools: "React, Python, Docker, Google Cloud",
    stack: ["Python", "React", "TypeScript", "Tailwind CSS", "Flask", "Docker", "Google Cloud"],
    cryptoNote: "liboqs (ML-DSA)",
    links: { live: "https://demo.ftsafe.com" },
    impact: [
      {
        title: "Complete Authentication",
        body: "Built a full user platform that cleanly integrates traditional passwords, OTPs, and modern hardware security keys into one smooth experience.",
      },
      {
        title: "Next-Gen Security",
        body: "Integrated advanced post-quantum encryption to future-proof the company's security platform against emerging computing threats.",
      },
      {
        title: "Secure Deployments",
        body: "Automated the deployment system so servers build independently and highly securely without needing external internet access.",
      },
    ],
    featured: true,
    tagType: "Internship",
  },
  {
    id: "mldsa-authenticator",
    title: "Software FIDO2 Authenticator",
    summary:
      "A software security key built in Rust that simulates a physical FIDO2 token, with added support for post-quantum ML-DSA signatures.",
    hideThumbnail: true,
    period: "Oct — Nov 2025",
    role: "Backend / Systems Developer",
    tools: "Rust, Linux, Cryptographic Frameworks",
    stack: ["Rust", "C/FFI", "Trussed", "Linux UHID"],
    cryptoNote: "liboqs (ML-DSA)",
    links: { github: "https://github.com/feitiantech/fidosoftwareauthenticator" },
    impact: [
      {
        title: "Hardware Simulation",
        body: "Engineered a software solution that successfully simulates a physical security token, allowing products to securely authenticate right from the web browser.",
      },
      {
        title: "System Integration",
        body: "Safely integrated advanced cryptographic libraries into the core Rust application, granting it next-generation security capabilities.",
      },
      {
        title: "Standardized Storage",
        body: "Created a highly secure saving mechanism for user credentials that perfectly matches industry authentication standards.",
      },
    ],
    featured: true,
    tagType: "Internship",
  },
  {
    id: "webauthn-platform",
    title: "Web Authentication Developer Platform",
    summary:
      "A developer tools platform for testing WebAuthn and FIDO2 authentication flows, with support for quantum-resistant cryptography. Developers can run ceremonies, inspect responses, and try different authenticators in one place.",
    image: "/projects/webauthn-platform.png",
    period: "Sep — Oct 2025",
    role: "Full-Stack Developer",
    tools: "Python, JavaScript, Google Cloud",
    stack: ["Python", "JavaScript", "HTML", "CSS", "Flask", "Google Cloud"],
    cryptoNote: "python-fido2 · liboqs (ML-DSA)",
    links: {
      live: "https://webauthnlab.tech",
      github: "https://github.com/feitiantech/postquantum-webauthn-platform",
    },
    impact: [
      {
        title: "Developer Tooling",
        body: "Built advanced tools that decode complex authentication data, helping other developers instantly test and verify security signatures.",
      },
      {
        title: "Global Synchronization",
        body: "Connected the platform to a worldwide database, seamlessly syncing the system with over 400 global authenticators.",
      },
      {
        title: "Safe Workspaces",
        body: "Designed an isolated session system allowing hundreds of developers to test the product concurrently without risking privacy or data overlaps.",
      },
    ],
    featured: true,
    tagType: "Internship",
  },
  {
    id: "travel-advisor",
    title: "Travel Advisor Website",
    summary:
      "A trip planning website that uses the OpenAI and Tripadvisor APIs to recommend destinations, hotels, restaurants, and attractions based on a user's preferences and travel dates.",
    image: "/projects/travel-advisor.png",
    period: "Jan — Apr 2025",
    role: "Frontend Developer · Group of 4",
    tools: "React, Vite, Tailwind, Frontend API Integration",
    stack: ["Python", "React", "Tailwind CSS", "JavaScript"],
    cryptoNote: null,
    links: {
      live: "https://travel-advisor-project.vercel.app/",
      github: "https://github.com/f4ncy1zach/travel-advisor",
    },
    impact: [
      {
        title: "AI Trip Architect",
        body: "Integrated the backend OpenAI API endpoints into the frontend interface to cleanly present AI-generated destination recommendations to users.",
      },
      {
        title: "End-to-End Workflows",
        body: "Designed and engineered the complete frontend step-by-step forms, dynamically caching and validating dates, travelers, and locations.",
      },
      {
        title: "Floating AI Assistant",
        body: "Architected the frontend UI components and UX for an interactive conversational widget that connects to backend systems.",
      },
    ],
    tagType: "Academic",
  },
  {
    id: "portfolio",
    title: "Personal Portfolio Website",
    summary:
      "A dual-theme personal portfolio rebuilt on Next.js with a custom token-driven design system, fully typed components, and a Vitest + Playwright test suite that runs on every commit.",
    hideThumbnail: true,
    period: "Feb 2025 — May 2026",
    role: "Designer & Engineer",
    tools: "Next.js, TypeScript, Tailwind CSS, Vitest, Playwright, Vercel",
    stack: ["Next.js", "React.js", "TypeScript", "Tailwind CSS"],
    cryptoNote: null,
    links: {
      live: "https://rainzhang.me/",
      github: "https://github.com/rainzhang05/rainzhang05.github.io",
    },
    impact: [
      {
        title: "Token-Driven Design System",
        body: "Defined a calibrated set of color, typography, spacing, and radius tokens that drive both the portfolio and a separately published design-system showcase page.",
      },
      {
        title: "Type-Safe Rebuild",
        body: "Migrated from vanilla HTML, CSS, and JavaScript to a fully typed Next.js 15 + React 18 codebase, with strict TypeScript and ESLint enforcing clean component boundaries.",
      },
      {
        title: "Verified On Every Commit",
        body: "Set up Vitest + React Testing Library unit tests and Playwright end-to-end coverage running across Chromium, Firefox, and mobile WebKit in CI.",
      },
    ],
    tagType: "Personal",
  },
];
