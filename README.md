# Rain Zhang — Portfolio

Personal portfolio site for Rain Zhang. Built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Stack

- Next.js 15 (App Router) · React 18.3 (pinned via `overrides`)
- TypeScript (strict mode)
- Tailwind CSS · CSS custom properties for theming
- `next/font/google` for self-hosted Manrope + JetBrains Mono
- Vitest + React Testing Library (unit) · Playwright (e2e)
- Deployed via Vercel

## Routes

- `/` — main portfolio (Hero, About, Experience, Projects, Skills, Education, Contact)
- `/design-system` — design tokens, typography, components

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Production server (after `build`) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest unit tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Unit tests with coverage |
| `npm run test:e2e` | Playwright e2e tests |
| `npm run test:e2e:ui` | Playwright UI mode |

## Structure

```
app/                  # Next.js routes (page.tsx, design-system/page.tsx, layout.tsx, globals.css)
components/
  atoms/              # Tag, Card, Icon, SectionTitle, ProjectThumbnail, TechTag, MicroLabel
  chrome/             # Nav, MobileMenu, ThemeToggle, GridBackground, CursorGlow
  theme/              # ThemeScript (anti-FOUC)
sections/
  portfolio/          # Hero, About, Experience, Projects, ProjectCard, Skills, Education, Contact, Footer, PortfolioShell
  design-system/      # FoundationSection, ColorsSection, ..., DSBlock, DSSubhead, DesignSystemHeader
lib/
  data/               # experiences, projects, skills, education, nav, tech-icons, design-system
  hooks/              # useTheme, useScrollSpy, useDsTheme
  utils/              # smoothScroll, validateContact
  types.ts            # shared types
public/               # static assets (icons, projects, portrait, resume, feitian logo)
tests/
  unit/               # Vitest + RTL
  e2e/                # Playwright (chromium, firefox, mobile)
.github/workflows/    # ci.yml
```

## Theme

Theme tokens live as CSS custom properties in `app/globals.css`. Light/dark is controlled by `data-theme="light"|"dark"` on `<html>`, persisted to `localStorage["portfolio.theme"]`. A pre-hydration script in `<head>` applies the stored preference before paint to avoid FOUC. The `/design-system` page intentionally does NOT persist its theme — it reflects `prefers-color-scheme` each visit.

The portfolio (`/`) uses a cyan accent (`#06b6d4`); the design system (`/design-system`) uses teal (`#14b8a6`). The accent is scoped per route via `[data-route="..."]` on the page's root `<div>`.

## License

See [LICENSE](LICENSE).
