import type { ReactNode } from "react";

export type ThemeMode = "light" | "dark";

export type IconName =
  | "arrow-up-right"
  | "arrow-right"
  | "arrow-down"
  | "external"
  | "github"
  | "linkedin"
  | "mail"
  | "file"
  | "sun"
  | "moon"
  | "menu"
  | "x"
  | "check";

export interface NavItem {
  id: string;
  label: string;
}

export interface FooterElsewhereLink {
  href: string;
  label: string;
  icon: IconName;
}

export interface Experience {
  id: string;
  role: string;
  org: string;
  dept: string;
  location: string;
  period: string;
  tagType: string;
  summary: string;
  outcomes: string[];
  stack: string[];
  related: string[];
}

export interface ProjectImpact {
  title: string;
  body: string;
}

export interface ProjectLinks {
  live?: string;
  github?: string;
}

export type ProjectType = "Personal" | "Academic" | "Internship";

export interface Project {
  id: string;
  title: string;
  summary: string;
  image?: string;
  hideThumbnail?: boolean;
  period: string;
  role: string;
  tools: string;
  stack: string[];
  cryptoNote: string | null;
  links: ProjectLinks;
  impact: ProjectImpact[];
  tagType: ProjectType;
  featured?: boolean;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface EducationItem {
  school: string;
  location: string;
  period: string;
  expected: string | null;
  degree: string;
  notes: string[];
}

export interface AboutParagraph {
  parts: Array<string | { strong: string }>;
}

export interface DsAccent {
  name: string;
  key: string;
  base: string;
  strong: string;
  soft: string;
  role: string;
}

export interface DsColor {
  name: string;
  var: string;
  hex: string;
}

export interface DsTypeRow {
  name: string;
  size: string;
  line: string;
  track: string;
  weight: string;
  example: string;
  className: string;
}

export interface DsSpacingRow {
  token: string;
  px: number;
}

export interface DsRadiusRow {
  token: string;
  soft: number;
  sharp: number;
}

export interface ContactFormState {
  name: string;
  email: string;
  message: string;
}

export interface ContactErrors {
  name: string | null;
  email: string | null;
  message: string | null;
}

export type ContactStatus = "idle" | "sending" | "sent" | "error";

export type ReactChildrenProps = { children: ReactNode };
