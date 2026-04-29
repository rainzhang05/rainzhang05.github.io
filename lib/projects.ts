export type Project = {
  id: string;
  period: string;
  title: string;
  role: string;
  summary: string;
  tags: string[];
  impacts: { title: string; body: string }[];
  stack: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    id: "project-travel",
    period: "Jan — Apr 2025",
    title: "Travel Advisor Web App",
    role: "SFU CMPT 276 capstone · Frontend Developer · Team of 4",
    summary:
      "Automated trip-planning web application integrating OpenAI and TripAdvisor APIs — AI-generated itineraries, multi-step booking flows, and a floating chat assistant. Built as a final project for SFU.",
    tags: ["React", "Vite", "Tailwind", "Express"],
    impacts: [
      { title: "AI itinerary engine", body: "Wired the OpenAI endpoints into the React frontend, surfacing structured destination recommendations the moment users finish the planning form." },
      { title: "Multi-step workflows", body: "Designed step-by-step booking forms with cached state, validation, and graceful error recovery for dates, travelers, and locations." },
      { title: "Conversational assistant", body: "Architected the floating chat widget and component system that bridges the frontend with backend conversation services." },
    ],
    stack: ["React", "Vite", "Tailwind CSS", "JavaScript", "Express", "Vercel"],
    links: [
      { label: "Live", href: "https://travel-advisor-project.vercel.app/" },
      { label: "GitHub", href: "https://github.com/f4ncy1zach/travel-advisor" },
    ],
  },
  {
    id: "project-portfolio",
    period: "Feb 2025",
    title: "Personal Portfolio Website",
    role: "Designer & Frontend Developer",
    summary:
      "Personal portfolio with a minimalist, editorial UI — zero-dependency engine, macOS-inspired interactions, dark mode, and a clean component-style architecture.",
    tags: ["HTML", "CSS", "JavaScript"],
    impacts: [
      { title: "Zero-dependency build", body: "Engineered the entire site natively without heavy frameworks — guaranteeing fast load times and minimal surface area." },
      { title: "Dynamic UI surfaces", body: "Built macOS-inspired navigation, dark-mode toggles, and seamless modal expansions powered by pure CSS and vanilla JS." },
      { title: "Maintainable system", body: "Designed component-style HTML and CSS tokens so the platform scales as new projects and case studies are added." },
    ],
    stack: ["HTML", "CSS", "JavaScript", "GitHub Pages", "Vercel"],
    links: [
      { label: "Live", href: "https://rainzhang.me/" },
      { label: "GitHub", href: "https://github.com/rainzhang05/rainzhang05.github.io" },
    ],
  },
  {
    id: "project-demo",
    period: "Nov — Dec 2025",
    title: "Authentication & Security Demo Platform",
    role: "Full-Stack Developer · FEITIAN",
    summary:
      "End-to-end web product showcasing modern authentication flows — passwords, OTPs, and hardware security keys unified into one passwordless experience, deployed on a fully isolated Linux server.",
    tags: ["React", "TypeScript", "Python", "Tailwind", "Docker"],
    impacts: [
      { title: "Full-stack delivery", body: "Designed and shipped the entire product — React/TypeScript frontend, Flask backend, and isolated server deployment — solo." },
      { title: "Future-proof crypto", body: "Integrated post-quantum signatures (ML-DSA via liboqs) into the auth flow so the platform stays viable as the standards evolve." },
      { title: "Air-gapped deploys", body: "Automated build and deployment so production servers ship reproducibly without external internet access." },
    ],
    stack: ["React", "TypeScript", "Python (Flask)", "liboqs (ML-DSA)", "Docker", "Google Cloud"],
    links: [{ label: "Live", href: "https://demo.ftsafe.com" }],
  },
  {
    id: "project-fido2",
    period: "Oct — Nov 2025",
    title: "Software FIDO2 Authenticator",
    role: "Backend / Systems Developer · FEITIAN",
    summary:
      "Rust software authenticator that simulates a physical FIDO2 security key, with full CTAP2 conformance and post-quantum credential support. Integrates with browsers via virtual HID on Linux.",
    tags: ["Rust", "Linux", "Systems"],
    impacts: [
      { title: "Hardware in software", body: "Engineered a Rust application that emulates a physical security token via virtual HID — letting browsers authenticate without a USB device." },
      { title: "Cryptography integration", body: "Safely integrated advanced cryptographic libraries into a core systems-level Rust binary for next-generation security capabilities." },
      { title: "Standards-conformant", body: "Built credential storage that conforms exactly to industry FIDO2 / CTAP2 specifications, validated against real-world relying parties." },
    ],
    stack: ["Rust", "C/FFI", "Trussed", "liboqs (ML-DSA)", "Linux UHID"],
    links: [{ label: "GitHub", href: "https://github.com/feitiantech/fidosoftwareauthenticator" }],
  },
  {
    id: "project-webauthn",
    period: "Sep — Oct 2025",
    title: "Web Authentication Developer Platform",
    role: "Full-Stack Developer · FEITIAN",
    summary:
      "Comprehensive developer toolkit for testing modern authentication flows — 20+ COSE algorithms, FIDO Metadata Service integration, isolated session sandboxes, and quantum-resistant credential support.",
    tags: ["Python", "JavaScript", "Cloud"],
    impacts: [
      { title: "Developer tooling", body: "Built decoders and validators for complex authentication payloads, letting other engineers instantly test and verify security signatures." },
      { title: "Global metadata sync", body: "Connected the platform to the FIDO Metadata Service, syncing it with 400+ global authenticators in real time." },
      { title: "Multi-tenant sandboxes", body: "Designed an isolated session system so hundreds of developers can run tests concurrently without privacy or data overlap." },
    ],
    stack: ["Python (Flask)", "JavaScript", "python-fido2", "liboqs (ML-DSA)", "Google Cloud"],
    links: [
      { label: "Live", href: "https://webauthnlab.tech" },
      { label: "GitHub", href: "https://github.com/feitiantech/postquantum-webauthn-platform" },
    ],
  },
];
