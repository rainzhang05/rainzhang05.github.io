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
    id: "project-demo",
    period: "Nov — Dec 2025",
    title: "Authentication & Security Demo Platform",
    role: "Full-Stack Developer · FEITIAN Technologies Co., Ltd.",
    summary:
      "Unified web platform showcasing modern authentication flows — passwords, OTPs, and hardware security keys integrated into one passwordless experience, with post-quantum cryptography support and isolated Linux server deployment.",
    tags: ["Python", "React.js", "TypeScript", "Tailwind CSS"],
    impacts: [
      { title: "Complete Authentication", body: "Built a full user platform that cleanly integrates traditional passwords, OTPs, and modern hardware security keys into one smooth experience." },
      { title: "Next-Gen Security", body: "Integrated advanced post-quantum encryption (ML-DSA via liboqs) to future-proof the platform against emerging computing threats." },
      { title: "Secure Deployments", body: "Automated the deployment system so servers build independently and securely without external internet access." },
    ],
    stack: ["Python (Flask)", "React.js", "TypeScript", "Tailwind CSS", "liboqs (ML-DSA)", "Docker", "Google Cloud"],
    links: [{ label: "Live", href: "https://demo.ftsafe.com" }],
  },
  {
    id: "project-fido2",
    period: "Oct — Nov 2025",
    title: "Software FIDO2 Authenticator",
    role: "Backend & Systems Developer · FEITIAN Technologies Co., Ltd.",
    summary:
      "A software solution built in Rust that simulates a physical security key — full CTAP2 conformance, post-quantum credential support, and browser integration over virtual HID on Linux.",
    tags: ["Rust", "Linux", "Systems"],
    impacts: [
      { title: "Hardware Simulation", body: "Engineered a software solution that simulates a physical security token, allowing browsers to authenticate without a USB device." },
      { title: "System Integration", body: "Safely integrated advanced cryptographic libraries into the core Rust application, granting it next-generation security capabilities." },
      { title: "Standardized Storage", body: "Created a credential storage mechanism that conforms exactly to industry FIDO2 / CTAP2 specifications, validated against real-world relying parties." },
    ],
    stack: ["Rust", "C / FFI", "Trussed", "liboqs (ML-DSA)", "Linux UHID"],
    links: [{ label: "GitHub", href: "https://github.com/feitiantech/fidosoftwareauthenticator" }],
  },
  {
    id: "project-webauthn",
    period: "Sep — Oct 2025",
    title: "Web Authentication Developer Platform",
    role: "Full-Stack Developer · FEITIAN Technologies Co., Ltd.",
    summary:
      "A comprehensive developer tools platform for testing modern authentication flows and quantum-resistant security — 20+ COSE algorithms, FIDO Metadata Service integration, isolated session sandboxes, and post-quantum credential support.",
    tags: ["Python", "JavaScript", "HTML", "CSS"],
    impacts: [
      { title: "Developer Tooling", body: "Built advanced tools that decode complex authentication data, helping other developers instantly test and verify security signatures." },
      { title: "Global Synchronization", body: "Connected the platform to a worldwide database, seamlessly syncing the system with over 400 global authenticators." },
      { title: "Safe Workspaces", body: "Designed an isolated session system allowing hundreds of developers to test concurrently without risking privacy or data overlaps." },
    ],
    stack: ["Python (Flask)", "JavaScript", "HTML", "CSS", "python-fido2", "liboqs (ML-DSA)", "Google Cloud"],
    links: [
      { label: "Live", href: "https://webauthnlab.tech" },
      { label: "GitHub", href: "https://github.com/feitiantech/postquantum-webauthn-platform" },
    ],
  },
  {
    id: "project-travel",
    period: "Jan — Apr 2025",
    title: "Travel Advisor Website",
    role: "UI/UX Designer & Frontend Developer · Simon Fraser University",
    summary:
      "Automated trip-planning website integrating OpenAI and Tripadvisor APIs — AI-generated itineraries, multi-step booking flows, and a floating chat assistant. Built as the SFU CMPT 276 capstone in a group of 4.",
    tags: ["Python", "React.js", "Tailwind CSS"],
    impacts: [
      { title: "AI Trip Architect", body: "Integrated the backend OpenAI endpoints into the React frontend, cleanly presenting AI-generated destination recommendations to users." },
      { title: "End-to-End Workflows", body: "Designed and engineered the complete frontend step-by-step forms, dynamically caching and validating dates, travelers, and locations." },
      { title: "Floating AI Assistant", body: "Architected the frontend UI components and UX for an interactive conversational widget that bridges the frontend with backend services." },
    ],
    stack: ["Python", "React.js", "Tailwind CSS", "JavaScript", "Express", "Vercel"],
    links: [
      { label: "Live", href: "https://travel-advisor-project.vercel.app/" },
      { label: "GitHub", href: "https://github.com/f4ncy1zach/travel-advisor" },
    ],
  },
  {
    id: "project-portfolio",
    period: "Feb 2025",
    title: "Personal Portfolio Website",
    role: "UI/UX Designer & Frontend Developer",
    summary:
      "Personal portfolio website with a minimalist UI/UX — built with semantic HTML, CSS, and vanilla JavaScript. Zero-dependency engine, macOS-inspired interactions, dark mode, and a clean component-style architecture.",
    tags: ["HTML", "CSS", "JavaScript"],
    impacts: [
      { title: "Zero-Dependency Engine", body: "Architected the entire site's logic and styling natively without heavy frameworks, guaranteeing fast load times and minimal surface area." },
      { title: "Dynamic UI Capabilities", body: "Built deeply interactive macOS-inspired navigation, functional dark-mode toggles, and seamless CSS modal expansions." },
      { title: "Maintainable Systems", body: "Designed clean, component-style HTML and CSS tokens to ensure the platform easily scales as new projects and case studies are added." },
    ],
    stack: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    links: [
      { label: "Live", href: "https://rainzhang.me/" },
      { label: "GitHub", href: "https://github.com/rainzhang05/rainzhang05.github.io" },
    ],
  },
];
