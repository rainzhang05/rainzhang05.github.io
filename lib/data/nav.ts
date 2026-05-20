import type { FooterElsewhereLink, NavItem } from "@/lib/types";

export const NAV_ITEMS: NavItem[] = [
  { id: "intro", label: "Intro" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export const FOOTER_NAV: NavItem[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export const FOOTER_ELSEWHERE: FooterElsewhereLink[] = [
  { href: "https://github.com/rainzhang05", label: "GitHub", icon: "github" },
  { href: "https://www.linkedin.com/in/rainzhang05/", label: "LinkedIn", icon: "linkedin" },
  { href: "mailto:rainzhang.zty@gmail.com", label: "Email", icon: "mail" },
  { href: "/rain-zhang-resume.pdf", label: "Resume", icon: "file" },
];
