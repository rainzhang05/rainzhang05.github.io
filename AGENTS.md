# AGENTS.md

## Project Snapshot
- Next.js 14 (App Router) + React 18 + TypeScript portfolio at `https://rainzhang.me/`.
- Deployed on Vercel (auto-build from `main`); CI runs lint + build + Playwright e2e on every push and PR.
- Single-page app: one route (`/`) composed of vertically stacked sections with anchor links.

## Architecture (Read First)
- `app/layout.tsx` — root layout. Loads `globals.css`, declares page metadata, and wires Inter / Instrument Serif / JetBrains Mono via `next/font/google` (exposed as CSS variables `--f-sans-next`, `--f-serif-next`, `--f-mono-next`).
- `app/page.tsx` — composes the home page in render order: `Nav → Hero → Marquee → About → Skills → Experience → Projects → Education → Contact → Footer`. Adding a section means adding an anchor (`<section id="…">`) and importing it here.
- `app/globals.css` — single CSS file with design tokens at the top (`:root { --bg, --ink, --accent, --r-md, --f-serif, … }`) and component styles below. There is no Tailwind, CSS modules, or CSS-in-JS.

## Component Map (`components/`)
- `Nav.tsx` — sticky top bar. IntersectionObserver in this file watches `#about, #skills, #work, #projects, #education` and toggles `.is-active` on the matching nav link.
- `Hero.tsx` — landing block: eyebrow, name (split into `.word` spans for character-level reveal), lede, primary/secondary buttons, portrait `next/image`, and a fact card.
- `Marquee.tsx` — passive horizontal strip. Items are duplicated and animated via the `@keyframes scroll` rule in `globals.css`.
- `About.tsx`, `Skills.tsx`, `Experience.tsx`, `Education.tsx`, `Contact.tsx`, `Footer.tsx` — section components.
- `Projects.tsx` — accordion-style project list. Reads from `lib/projects.ts`. Each row has `role="button"`, supports keyboard toggle (Enter/Space), and ignores clicks that originate inside `<a>` so external links don't expand the row.
- `ui.tsx` — shared primitives:
  - `useReveal<T>()`: returns a generic ref. After mount, IntersectionObserver finds every `.reveal` and `.word` descendant and adds `.is-in` once visible. CSS handles the actual transition.
  - `Arrow`, `Download`, `CheckCircle`: inline SVG icon components.

## Conventions to Preserve
- **`useReveal` ref contract.** Only call it once per section. Children that should fade in must have the class `reveal` (and optionally `data-delay="1..5"`); animated headline words use `.word` with a nested `<span>`. Don't add new motion classes — extend these.
- **`use client` rule.** Sections that use `useReveal`, `useState`, or any DOM API need the `"use client"` directive at the top. `Marquee`, `Footer`, and `app/page.tsx` are pure server components — keep them that way unless you need state.
- **Class contract.** `.reveal`, `.is-in`, `.word`, `.is-open`, `.is-active`, `.pill`, `.btn`, `.section-head`, `.wrap` — CSS in `globals.css` keys off these names. Don't rename without updating the CSS.
- **Section IDs.** Anchor IDs in `Nav.tsx` (`#about`, `#skills`, `#work`, `#projects`, `#education`, `#contact`) must match the `id` props on the corresponding `<section>` elements. `#top` is the hero target for "Back to top".
- **Project links.** Add cross-section anchors via `id={p.id}` (e.g. `#project-demo` from `Experience.tsx`). The IDs live in `lib/projects.ts`.

## Project Data Shape (`lib/projects.ts`)
```ts
type Project = {
  id: string;            // also serves as the anchor id
  period: string;        // "Nov — Dec 2025"
  title: string;
  role: string;
  summary: string;
  tags: string[];        // shown in the row head
  impacts: { title: string; body: string }[];  // expanded view
  stack: string[];       // pills shown after impacts
  links: { label: string; href: string }[];
};
```
Order in the array is order on the page (currently newest first).

## Contact Form
- `components/Contact.tsx` POSTs `FormData` to `https://formspree.io/f/xoveaaqo` (Formspree). The form ID is hardcoded; rotating it requires editing `FORMSPREE_ENDPOINT`.
- States: `idle | sending | sent | error`. Success and error states auto-clear after 5 seconds.
- Success message: "Thank you for your message! I'll get back to you as soon as possible."

## Styling Notes
- Light theme only by design. There is currently no dark-mode override; if you reintroduce one, do it via `prefers-color-scheme` overriding the `:root` tokens — don't add component-level dark styles.
- Body content (`p, li, h1–h6, dt, dd`, plus form fields and a few specific selectors) is text-selectable; chrome (nav, buttons, marquee, fact-card labels) is not. See the `user-select` block in `globals.css` near the body reset.
- Reduced motion: `@media (prefers-reduced-motion: reduce)` near the bottom of `globals.css` neutralizes `.reveal` and `.word`. Honor it when adding new motion.

## Local Workflow
- `npm run dev` — http://localhost:3000.
- `npm run lint` — Next.js / ESLint.
- `npm run build` — production build.
- `npm test` — Playwright (boots `npm run start` automatically; specs in `tests/e2e/`).
- `npm run test:ui` — Playwright UI mode for debugging.

## CI / Deploy
- `.github/workflows/test.yml` — runs lint, build, and Playwright on push and PR.
- Vercel deploys `main` automatically. Preview deployments come from PR branches; the URL appears in the PR check.
- The contact form's Formspree free tier has a monthly submission cap; if it gets exhausted, submissions fail and the error fallback appears.

## When Editing
- For section copy, edit the matching `components/*.tsx` directly.
- For project entries, edit `lib/projects.ts` (preserve the `Project` type).
- For metadata (title, description, OG, theme color), edit `app/layout.tsx`.
- For visual styles, edit `app/globals.css` — keep changes scoped to existing variables before introducing new ones.
- After any structural change, run `npm run build` to catch typing/route issues, and `npm test` to catch UI regressions.
