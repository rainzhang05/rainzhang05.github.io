import type { DsAccent, DsColor, DsRadiusRow, DsSpacingRow, DsTypeRow } from "@/lib/types";

export const DS_ACCENTS: DsAccent[] = [
  {
    name: "Teal",
    key: "teal",
    base: "#14b8a6",
    strong: "#0d9488",
    soft: "#5eead4",
    role: "Primary (default)",
  },
  {
    name: "Cyan",
    key: "cyan",
    base: "#06b6d4",
    strong: "#0891b2",
    soft: "#67e8f9",
    role: "Alt cool",
  },
  {
    name: "Indigo",
    key: "indigo",
    base: "#6366f1",
    strong: "#4f46e5",
    soft: "#a5b4fc",
    role: "Alt cool",
  },
  {
    name: "Blue",
    key: "blue",
    base: "#3b82f6",
    strong: "#2563eb",
    soft: "#93c5fd",
    role: "Alt cool",
  },
];

export const DS_LIGHT: DsColor[] = [
  { name: "Background", var: "--bg", hex: "#fafbfc" },
  { name: "Surface", var: "--surface", hex: "#ffffff" },
  { name: "Surface 2", var: "--surface-2", hex: "#f1f5f9" },
  { name: "Border", var: "--border", hex: "#e6ebf2" },
  { name: "Border strong", var: "--border-strong", hex: "#cbd5e1" },
  { name: "Text subtle", var: "--text-subtle", hex: "#94a3b8" },
  { name: "Text muted", var: "--text-muted", hex: "#475569" },
  { name: "Text", var: "--text", hex: "#0b1220" },
];

export const DS_DARK: DsColor[] = [
  { name: "Background", var: "--bg", hex: "#07090d" },
  { name: "Surface", var: "--surface", hex: "#0c1014" },
  { name: "Surface 2", var: "--surface-2", hex: "#131820" },
  { name: "Border", var: "--border", hex: "#1c2330" },
  { name: "Border strong", var: "--border-strong", hex: "#2a3444" },
  { name: "Text subtle", var: "--text-subtle", hex: "#64748b" },
  { name: "Text muted", var: "--text-muted", hex: "#94a3b8" },
  { name: "Text", var: "--text", hex: "#e6edf6" },
];

export const DS_TYPE: DsTypeRow[] = [
  {
    name: "Display",
    size: "72 / 5.5rem",
    line: "0.94",
    track: "-0.045em",
    weight: "500",
    example: "Rain Zhang.",
    className: "text-[5.5rem] leading-[0.94] tracking-[-0.045em] font-medium",
  },
  {
    name: "H1",
    size: "56 / 3.5rem",
    line: "1.02",
    track: "-0.035em",
    weight: "500",
    example: "Selected work",
    className: "text-[3.5rem] leading-[1.02] tracking-[-0.035em] font-medium",
  },
  {
    name: "H2",
    size: "40 / 2.5rem",
    line: "1.08",
    track: "-0.025em",
    weight: "500",
    example: "Let's build something",
    className: "text-[2.5rem] leading-[1.08] tracking-[-0.025em] font-medium",
  },
  {
    name: "H3",
    size: "24 / 1.5rem",
    line: "1.2",
    track: "-0.015em",
    weight: "500",
    example: "Authentication & Security Demo",
    className: "text-[1.5rem] leading-[1.2] tracking-[-0.015em] font-medium",
  },
  {
    name: "Body L",
    size: "18 / 1.125rem",
    line: "1.55",
    track: "0",
    weight: "400",
    example: "Computer Science at SFU, building post-quantum auth platforms.",
    className: "text-[1.125rem] leading-[1.55]",
  },
  {
    name: "Body",
    size: "16 / 1rem",
    line: "1.6",
    track: "0",
    weight: "400",
    example: "Full-stack engineer building rigorously across modern stacks.",
    className: "text-base leading-[1.6]",
  },
  {
    name: "Body S",
    size: "14 / 0.875rem",
    line: "1.5",
    track: "0",
    weight: "400",
    example: "Recent roles and what shipped.",
    className: "text-sm leading-[1.5]",
  },
  {
    name: "Mono kicker",
    size: "11 / 0.6875rem",
    line: "1.4",
    track: "0.15em",
    weight: "500",
    example: "01 — EXPERIENCE",
    className: "text-[11px] tracking-[0.15em] uppercase font-mono",
  },
];

export const DS_SPACING: DsSpacingRow[] = [
  { token: "--space-1", px: 4 },
  { token: "--space-2", px: 8 },
  { token: "--space-3", px: 12 },
  { token: "--space-4", px: 16 },
  { token: "--space-6", px: 24 },
  { token: "--space-8", px: 32 },
  { token: "--space-12", px: 48 },
  { token: "--space-16", px: 64 },
  { token: "--space-24", px: 96 },
  { token: "--space-32", px: 128 },
];

export const DS_RADII: DsRadiusRow[] = [
  { token: "--r-sm", soft: 8, sharp: 2 },
  { token: "--r-md", soft: 14, sharp: 4 },
  { token: "--r-lg", soft: 22, sharp: 8 },
];

export const DS_LINKS = [
  { id: "foundations", label: "Foundations" },
  { id: "colors", label: "Colors" },
  { id: "type", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "components", label: "Components" },
  { id: "tweaks", label: "Tweaks" },
];

export const DS_FOUNDATIONS = [
  {
    t: "Editorial restraint",
    d: "Generous white space, oversized typographic statements, single accent. The interface gets out of the way of the work.",
  },
  {
    t: "Cool & calm",
    d: "Near-neutral cool greys with a teal-family accent. No saturated competing hues. Premium without flash.",
  },
  {
    t: "Structure made visible",
    d: "Mono kickers, numbered sections, and clear hierarchy. Like reading well-typeset documentation.",
  },
  {
    t: "Motion as feedback",
    d: "Reveals on scroll, magnetic hovers, smooth crossfades on theme change — every motion explains state.",
  },
  {
    t: "Dual native",
    d: "Light and dark are not theme afterthoughts. Both are first-class with calibrated contrast and surfaces.",
  },
  {
    t: "Adaptable",
    d: "Eight tweak controls let the system flex between editorial and dense, sharp and soft, without losing identity.",
  },
];

export const DS_DENSITY = [
  { name: "Comfy", card: 32, section: 120, role: "Default — editorial breathing room" },
  { name: "Compact", card: 24, section: 84, role: "Information dense — recruiter scan" },
];

export const DS_TWEAKS = [
  { name: "Theme", desc: "Light / Dark · auto detects system" },
  { name: "Accent", desc: "Teal · Cyan · Indigo · Blue" },
  { name: "Font pair", desc: "Manrope / Inter / Geist / Instrument" },
  { name: "Density", desc: "Comfy · Compact" },
  { name: "Radius", desc: "Soft · Sharp" },
  { name: "Hero variant", desc: "Editorial · Split · Centered" },
  { name: "Navigation", desc: "Pill · Minimal · Side dots" },
  { name: "Background", desc: "Grid · Dots · Noise · None" },
];
