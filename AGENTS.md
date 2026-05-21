# AGENTS.md

A quick-start guide for AI agents working in this repository. Read this end-to-end before touching code so you can get productive on your first turn.

---

## Workflow rules (read first)

**When you finish a task, commit and push to the current working branch in small, gradual commits.**

- **Small, gradual commits** — split the work into logically scoped commits (e.g. one commit per concern: data change, component change, test change). Avoid a single mega-commit at the end.
- **Subject line only** — no commit body / message detail. Pass `-m "..."` once; do not include a HEREDOC body or a second `-m`.
- **No co-author trailer** — do not append `Co-Authored-By:` or any "Generated with Claude Code" footer.
- **Push to the current branch** — `git push` (no force). Do not switch branches, open PRs, or push to `main` from a feature branch unless explicitly asked.
- Use the result of `git branch --show-current` if you need to confirm the branch.

Example of an acceptable commit invocation:

```sh
git add path/to/changed-file.tsx
git commit -m "Refactor Hero CTA spacing"
git push
```

That's it. No body. No trailer. No `--amend` on already-pushed commits.

---

## Project at a glance

- **What it is:** Rain Zhang's personal portfolio website (live at https://rainzhang.me).
- **Two routes:** `/` (portfolio home) and `/design-system` (design tokens / showcase page).
- **Framework:** Next.js 15 App Router + React 18 + TypeScript (strict) + Tailwind CSS 3.
- **Deployed on:** Vercel (`vercel.json` pins `framework: nextjs`).
- **Forms:** Contact form posts to Formspree (`https://formspree.io/f/xoveaaqo`) — endpoint is hardcoded inside [Contact.tsx](sections/portfolio/Contact.tsx).
- **Node:** `>=20` (CI uses Node 20).

---

## Directory layout

```
app/                       # Next.js App Router (server components by default)
  layout.tsx               # Root layout: fonts (Manrope + JetBrains Mono), ThemeScript, <head>
  page.tsx                 # Portfolio home (sets data-route="portfolio")
  design-system/page.tsx   # Design system page (sets data-route="design-system")
  globals.css              # CSS variables, themes, base styles, reveal/scroll utilities

components/
  atoms/                   # Reusable primitives: Card, Icon, Tag, TechTag, MicroLabel,
                           # SectionTitle, ScrollReveal, ProjectThumbnail
  chrome/                  # Top-level page chrome: Nav, MobileMenu, ThemeToggle,
                           # GridBackground, CursorGlow
  theme/                   # ThemeScript (inline <head> script that prevents FOUC)

sections/
  portfolio/               # Home-page sections: PortfolioShell, Hero, About, Experience,
                           # Projects, ProjectCard, Skills, Education, Contact, Footer
  design-system/           # /design-system sections: DesignSystemShell + content blocks
                           # (FoundationSection, ColorsSection, TypeSection, SpacingSection,
                           #  ComponentsSection, TweaksSection, DesignSystemHeader,
                           #  DSBlock, DSSubhead)

lib/
  types.ts                 # All shared TypeScript types (Project, Experience, NavItem, etc.)
  data/                    # Static content: projects, experiences, skills, education, nav,
                           # tech-icons, design-system
  hooks/                   # useTheme (portfolio, persisted), useDsTheme (design-system,
                           # NOT persisted), useScrollSpy
  utils/                   # smoothScroll, validateContact

public/                    # Static assets: portfolio-photo.png, resume PDF, /icons, /projects

tests/
  setup/vitest.setup.ts    # jest-dom matchers + in-memory localStorage polyfill for happy-dom
  unit/*.test.ts(x)        # Vitest + React Testing Library
  e2e/*.spec.ts            # Playwright (excluded from tsconfig + vitest)

.github/workflows/ci.yml   # CI: lint + typecheck + unit + E2E matrix (chromium/firefox/safari/mobile)
```

---

## Path aliases

`@/*` → repo root, configured in [tsconfig.json](tsconfig.json) and mirrored in [vitest.config.ts](vitest.config.ts).

Always import via the alias, e.g.:

```ts
import { Card } from "@/components/atoms/Card";
import { PROJECTS } from "@/lib/data/projects";
import type { Project } from "@/lib/types";
```

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server on `http://localhost:3000` |
| `npm run build` | Production build (used in CI before E2E) |
| `npm run start` | Production server (used by Playwright in CI) |
| `npm run lint` | ESLint (`next/core-web-vitals` + `next/typescript`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest unit tests (one-shot) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Vitest with v8 coverage (`coverage/` output) |
| `npm run test:e2e` | Playwright across all configured projects |
| `npm run test:e2e:ui` | Playwright UI mode |

**Before claiming a task is done**, run at minimum: `npm run lint && npm run typecheck && npm run test`. Add `npm run test:e2e` if your change is observable in the browser (DOM, routing, interactions, theme, etc.).

---

## Design system & theming

Design tokens live in [app/globals.css](app/globals.css) as CSS variables. They are the single source of truth for the look-and-feel — do not introduce one-off hex values in components.

- **Color tokens:** `--bg`, `--surface`, `--surface-2`, `--text`, `--text-muted`, `--text-subtle`, `--border`, `--border-strong`, plus per-route `--accent`, `--accent-strong`, `--accent-soft`.
- **Radius tokens:** `--r-sm` (10), `--r-md` (18), `--r-lg` (28). Applied as `rounded-[calc(var(--r-md)*1px)]`.
- **Spacing tokens:** `--gap-card` (32px), `--gap-section` (120px), `--content-max-w` (1200px).
- **Fonts:** `--font-sans` (Manrope) and `--font-mono` (JetBrains Mono), loaded via `next/font/google` in [app/layout.tsx](app/layout.tsx).

**Theme system** is attribute-driven via `data-theme="light|dark"` on `<html>`:

- **FOUC prevention:** [components/theme/ThemeScript.tsx](components/theme/ThemeScript.tsx) is an inline script in `<head>` that synchronously reads `localStorage["portfolio.theme"]` and sets `data-theme` before paint.
- **Portfolio (`/`)** uses [useTheme](lib/hooks/useTheme.ts) which **persists** the chosen theme to `localStorage["portfolio.theme"]`.
- **Design-system (`/design-system`)** uses [useDsTheme](lib/hooks/useDsTheme.ts) which **does NOT persist** — it always resets to `prefers-color-scheme` on mount. An E2E test in [tests/e2e/theme.spec.ts](tests/e2e/theme.spec.ts) guards this contract; do not "fix" it by adding persistence.

**Per-route accent** is scoped via `data-route` on the page wrapper (`portfolio` → cyan, `design-system` → teal). See `[data-route=...]` blocks in `globals.css`.

---

## Routing & navigation

- Single-page scroll layout. Each section on `/` has an `id` matching an entry in [lib/data/nav.ts](lib/data/nav.ts).
- The fixed nav pill uses smooth-scroll anchor jumps via [smoothScrollTo](lib/utils/smoothScroll.ts) — `scroll-padding-top` in `globals.css` accounts for the header height (96px on portfolio, 84px on design-system).
- Active section is tracked by [useScrollSpy](lib/hooks/useScrollSpy.ts) (IntersectionObserver with rootMargin tuned for mid-viewport detection).
- Projects can be opened/expanded; the card scrolls into view via [scrollToProject](lib/utils/smoothScroll.ts).

---

## Data architecture

All page content (projects, experiences, skills, education, nav items) lives in [lib/data/](lib/data/) as typed TypeScript modules. Updating site content = editing one of these files, **not** the JSX. Types are in [lib/types.ts](lib/types.ts).

When adding a new project, experience, or skill: edit the corresponding data file. The components iterate over the exported arrays automatically.

---

## Testing

### Unit tests — Vitest + React Testing Library

- Live in `tests/unit/`, run with `npm run test`.
- Environment: `happy-dom`. The setup file in [tests/setup/vitest.setup.ts](tests/setup/vitest.setup.ts) installs an in-memory `localStorage` polyfill (happy-dom v20 ships without one) and runs `cleanup()` + `removeAttribute("data-theme")` between tests.
- Coverage scope: `components/**`, `sections/**`, `lib/**`, `app/**` (configured in [vitest.config.ts](vitest.config.ts)).

### E2E tests — Playwright

- Live in `tests/e2e/`, run with `npm run test:e2e`.
- Configured in [playwright.config.ts](playwright.config.ts) for four projects: `chromium`, `firefox`, `safari` (WebKit), `mobile` (iPhone 13 WebKit).
- `webServer` starts `npm run dev` locally, `npm run start` in CI.
- **`tsconfig.json` excludes `tests/e2e`** — Playwright uses its own tsconfig. If you add a Playwright test, you don't need to add it to the main TS project.
- **Don't rely on `window.scrollY` checks** — they're flaky in headless browsers. Use `expect(locator).toBeInViewport()` instead (see [tests/e2e/nav.spec.ts](tests/e2e/nav.spec.ts)).
- **Wait for the preloader to fully unmount** before interacting with the page: `await page.waitForFunction(() => !document.querySelector("[data-preloader]"))`. Its scroll-lock listeners stay attached until unmount.

---

## CI/CD

[.github/workflows/ci.yml](.github/workflows/ci.yml) runs on every PR and push to `main`:

1. **`quick-checks` job:** `npm ci` → `npm run lint` → `npm run typecheck` → `npm run test`.
2. **`e2e` matrix:** four parallel runs (chromium / firefox / safari / mobile), each does `npm run build`, installs the matching Playwright browser, runs `npx playwright test --project=<name>`. Reports upload on failure.

A change that breaks CI on one matrix entry will block the whole PR. Don't disable a project to make CI green; fix the test or the underlying code.

---

## Deployment

- Vercel auto-deploys from `main` (production) and creates preview deployments for branches.
- Project config: [vercel.json](vercel.json) → `{ "framework": "nextjs" }`.
- The `.vercel/` directory is gitignored.
- No environment variables are required for the build — the Formspree endpoint is hardcoded.

---

## Conventions & gotchas

- **Strict TypeScript** — no `any` (the lone exception is the Footer's small `any` icon prop; don't follow that pattern). Prefer importing types from [lib/types.ts](lib/types.ts).
- **Prettier:** double quotes, semicolons, trailing commas (`es5`), `printWidth: 100`, 2-space indent. See [.prettierrc.json](.prettierrc.json).
- **ESLint:** `@typescript-eslint/no-unused-vars` is warn-only with `argsIgnorePattern: "^_"`. `@next/next/no-img-element` is disabled — `<img>` is permitted; `next/image` is used selectively (e.g. in the Hero photo). When you use a raw `<img>`, leave the existing `eslint-disable-next-line` comments in place.
- **Client vs server components:** server by default; add `"use client"` at the top only when the file uses hooks, browser APIs, or event handlers. The shells (`PortfolioShell`, anything under `chrome/`, most interactive sections) are client; static sections (`About`, `Education`, `Skills`) are server.
- **Hash anchors:** every top-level section on `/` must keep its `id` aligned with [lib/data/nav.ts](lib/data/nav.ts) — `useScrollSpy` and smooth-scroll both depend on this.
- **`select-none` on body** — text is unselectable globally; inputs/textareas opt back in via the CSS in `globals.css`. If you add a content surface where copy should be selectable, give it `user-select: text` explicitly.
- **Preloader:** the portfolio has a 3.5s max-wait loader that locks scroll via wheel/touch/keydown listeners. Don't introduce competing scroll-lock mechanisms or `overflow: hidden` on `<body>` — they cause layout shift (see commit `6b7a434`).
- **Honeypot field:** the contact form has a hidden `confirm_username` input. Don't unhide it or remove the bot-trap branch in [Contact.tsx](sections/portfolio/Contact.tsx).
- **No emojis in source** unless explicitly asked.
- **No new docs files** (READMEs, NOTES, etc.) unless explicitly asked.

---

## Common tasks — where to look

- **Add or edit a project card:** [lib/data/projects.ts](lib/data/projects.ts) (image goes in `/public/projects/`).
- **Add or edit an experience:** [lib/data/experiences.ts](lib/data/experiences.ts).
- **Add a skill or tech tag:** [lib/data/skills.ts](lib/data/skills.ts) + an icon in [lib/data/tech-icons.ts](lib/data/tech-icons.ts) (drop the asset in `/public/icons/`).
- **Add a nav item:** [lib/data/nav.ts](lib/data/nav.ts) — the section's `id` and the `NavItem.id` must match.
- **Change a token (color, radius, spacing):** [app/globals.css](app/globals.css) `:root` block. Update [lib/data/design-system.ts](lib/data/design-system.ts) so the showcase page reflects reality.
- **Tweak the design-system page:** [sections/design-system/](sections/design-system/) — each subsection is its own file.
- **Update the contact form:** [sections/portfolio/Contact.tsx](sections/portfolio/Contact.tsx) and validation in [lib/utils/validateContact.ts](lib/utils/validateContact.ts).
- **Add an icon name:** extend the `IconName` union in [lib/types.ts](lib/types.ts) and the `ICON_PATHS` map in [components/atoms/Icon.tsx](components/atoms/Icon.tsx) — both must stay in sync.
