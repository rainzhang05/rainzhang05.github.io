import type { Experience } from "@/lib/types";

export const EXPERIENCES: Experience[] = [
  {
    id: "feitian",
    role: "Full-Stack Engineer Intern",
    org: "FEITIAN Technologies Co., Ltd.",
    dept: "International Department",
    location: "Beijing, China",
    period: "Sep — Dec 2025",
    tagType: "Internship",
    summary:
      "Owned end-to-end development of three production systems for FEITIAN's Post-Quantum Cryptography (PQC) initiative: a user-oriented authentication demo platform, a public Web Authentication developer tools platform, and a Rust-based FIDO2 software authenticator. Responsible for architecture, full-stack implementation, cloud/server deployment, CI/CD pipelines, and cross-team coordination with hardware engineers.",
    outcomes: [
      "Created the company's first developer-tools platform, replacing scattered third-party tools and centralizing authentication testing, validation, and debugging in one system.",
      "Developed secure web systems supporting authentication product testing — WebAuthn, FIDO2, CTAP2, and emerging post-quantum cryptography (ML-DSA) workflows.",
      "Enabled early post-quantum authenticator development by integrating ML-DSA algorithms into testing platforms and virtual authenticators before production hardware was available.",
      "Deployed applications on Linux servers using Docker-based workflows and CI pipelines — improving reliability and repeatability of testing and demos.",
      "Worked closely with security engineers and product teams to adapt platform behavior, data output, and testing flows to real product development needs.",
      "Reduced user-support burden through the self-service authentication demo platform.",
    ],
    stack: [
      "Python",
      "Rust",
      "TypeScript",
      "React.js",
      "Flask",
      "JavaScript",
      "HTML",
      "ML-DSA / ML-KEM",
      "liboqs",
      "WebAuthn / FIDO2",
      "CTAP2",
      "Docker",
      "Google Cloud",
      "GitHub Actions",
      "Tailwind CSS",
    ],
    related: ["webauthn-platform", "mldsa-authenticator", "security-demo"],
  },
];
