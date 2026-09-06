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
git commit -m "Refactor Intro CTA spacing"
git push
```

That's it. No body. No trailer. No `--amend` on already-pushed commits.

---

## Project at a glance

- **What it is:** Rain Zhang's personal portfolio website (live at https://rainzhang.me).
- **Two routes:** `/` (English) and `/ja` (Japanese) — the same single scrolling page in two languages. There is no third route.
- **Framework:** Next.js 15 App Router + React 18 + TypeScript (strict) + Tailwind CSS 3.
- **Deployed on:** Vercel (`vercel.json` pins `framework: nextjs`).
- **Forms:** Contact form posts to Formspree. The endpoint lives in [lib/site.ts](lib/site.ts) and can be overridden with `NEXT_PUBLIC_FORMSPREE_ENDPOINT`.
- **Node:** `>=20` (CI uses Node 20).

The design is deliberately quiet: one warm ivory theme, one typeface, one accent, no borders or shadows, and exactly one interaction — rows that expand in place. If a change adds a second interaction pattern, a second accent, or a theme toggle, it is working against the design, not with it.

---

## Directory layout

```
app/
  globals.css              Design tokens (colour, type, spacing, radius, motion) + base rules.
                           The only file in the repo with raw values.
  fonts.ts                 Albert Sans, self-hosted through next/font/local
  fonts/*.woff2            The four font files (upright/italic x latin/latin-ext)
  icon.ico                 Favicon, applied to every route
  [locale]/
    layout.tsx             Root layout: <html lang>, fonts, metadata, generateStaticParams
    page.tsx               Renders <PortfolioPage> with that language's content

components/
  ui/                      Primitives with no knowledge of the site: Icon, Eyebrow, TechTag,
                           TextLink, Button, Toast, Field
  site/                    The page itself:
    PortfolioPage.tsx      The shell — all interactive state lives here and nowhere else
    SiteHeader.tsx         Static header, menu sheet under 640px, EN/JA switch
    Intro.tsx              Hero: eyebrow, heading, availability, resume + copy email
    DisclosureRow.tsx      The one expand/collapse row, shared by experience and work
    ExperienceSection.tsx / WorkSection.tsx / BackgroundSection.tsx
    ContactSection.tsx / ContactForm.tsx
    SectionHeading.tsx / CompanyMark.tsx / LocaleSwitch.tsx / SiteFooter.tsx

lib/
  site.ts                  Email, links, resume path, Formspree endpoint, locales, cookie name
  types.ts                 The content model (Copy, Experience, Project, SkillGroup, …)
  tech.ts                  Technology name -> mark file in public/tech
  content/en.ts            All English copy and content
  content/ja.ts            All Japanese copy and content
  content/index.ts         Assembles both into Record<Locale, Copy>
  useReducedMotion.ts      Hook + a plain function for the two JS scroll nudges

middleware.ts              One-time /ja redirect for visitors in Japan

public/
  portrait.png             Hero portrait
  rain-zhang-resume.pdf    Linked from the header, the hero and the footer
  logos/                   Company marks (feitian.svg, mnt-realty.svg)
  projects/                Project screenshots
  tech/                    Technology marks, looked up by lib/tech.ts

tests/
  setup/vitest.setup.ts    jest-dom matchers + cleanup between tests
  setup/dom-mocks.ts       Reusable mocks: matchMedia, clipboard, rAF, scroll, location
  unit/*.test.ts(x)        Vitest + React Testing Library
  e2e/*.spec.ts            Playwright (excluded from tsconfig + vitest)

.github/workflows/ci.yml   CI: lint + typecheck + unit + E2E matrix (chromium/firefox/safari/mobile)
```

---

## Path aliases

`@/*` → repo root, configured in [tsconfig.json](tsconfig.json) and mirrored in [vitest.config.ts](vitest.config.ts).

Always import via the alias, e.g.:

```ts
import { TechTag } from "@/components/ui/TechTag";
import { en } from "@/lib/content";
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

**Before claiming a task is done**, run at minimum: `npm run lint && npm run typecheck && npm run test`. Add `npm run test:e2e` if your change is observable in the browser (DOM, routing, interactions, layout).

---

## Design tokens

[app/globals.css](app/globals.css) is the **only** file with raw values — colours, type sizes, spacing, radii and motion. [tailwind.config.ts](tailwind.config.ts) maps every token to a Tailwind name, so components write `text-ink-2`, `border-rule`, `duration-base`, `pt-section` — never a hex code or a millisecond count.

- **Colour:** `--paper`, `--sheet`, `--surface`, `--surface-2`; ink scale `--ink`, `--ink-hover`, `--ink-2`, `--ink-3`; rules `--rule`, `--rule-strong`; accent `--sage`, `--sage-strong`, `--sage-tint`; and two semantic colours, `--clay` (errors) and `--ochre`.
- **Type:** one family. `--font-sans` is Albert Sans from [app/fonts.ts](app/fonts.ts); `--font-sans-jp` is a system Japanese stack that `html[data-locale='ja']` swaps in. The size scale runs `--text-label` (12) through `--text-hero`.
- **Spacing and layout:** `--container` (1080), `--gutter` / `--gutter-mobile`, `--label-col` (160 — the date column), `--reading-col`, `--section-gap`, `--hero-pad`.
- **There is one theme.** No `data-theme`, no theme script, no `localStorage`, no dark mode. Removing that machinery is what makes the first paint the finished page. Do not add it back without being asked.

### Motion

Three values in the `:root` block of `app/globals.css` drive every transition on the site:

| Token | Value | Used by |
| --- | --- | --- |
| `--duration-fast` | 150ms | every colour, border and background change |
| `--duration-base` | 220ms | expand / collapse (height + opacity), the language pill |
| `--duration-slow` | 320ms | unused by this design; kept for the token set |
| `--ease-out` | `cubic-bezier(.2,.6,.2,1)` | all of the above |
| `--duration-enter` | 620ms | the first-screen entrance |
| `--enter-step` | 60ms | one beat of the entrance stagger (`.enter-1` … `.enter-6`) |
| `--ease-enter` | `cubic-bezier(.16,1,.3,1)` | the entrance; most of the movement is over early |

Change one number there and the whole site changes with it. A `prefers-reduced-motion: reduce` block at the bottom of the same file zeroes every duration **and delay**, and the two JS scroll nudges in [PortfolioPage.tsx](components/site/PortfolioPage.tsx) check `prefersReducedMotion()` before choosing `smooth`.

`.enter` (rise and fade) and `.enter-fade` (fade only) are the two entrance classes, both declared in `globals.css` so no component carries a millisecond count. Use `.enter-fade` on anything with a `position: fixed` descendant — a transformed ancestor would become its containing block for the length of the animation, which is why the header uses it and the menu sheet does not move.

---

## Information architecture

`/` (English) and `/ja` (Japanese) are the same single page:

intro → Experience → Selected work → Other work → Background (education and skills) → Contact → footer.

Section `id`s are English in both locales (`experience`, `work`, `background`, `contact`, plus `top`) because hash links and the footer nav depend on them. Only the labels are translated. A unit test asserts every in-page nav `href` points at a section the page actually renders.

---

## Routing and localization

Both languages come from one `app/[locale]` tree:

- `generateStaticParams` prerenders `en` and `ja`; `dynamicParams = false`, so anything else 404s.
- `/` is rewritten to `/en` internally and `/en` redirects to `/` (both in [next.config.mjs](next.config.mjs)), so each language has exactly one canonical URL. Redirects are evaluated before rewrites, so there is no loop.
- [middleware.ts](middleware.ts) 307s `/` to `/ja` when `x-vercel-ip-country` is `JP` **and** there is no `portfolio.locale` cookie. [LocaleSwitch](components/site/LocaleSwitch.tsx) owns that cookie — it writes it on click, after which the redirect never fires again. Do not set it on mere visits to `/ja`, and do not bounce `/ja` back to `/`. Local `next dev` has no country header, so `/` stays English.
- The switch uses `next/link`, so the other language is prefetched and both routes stay crawlable.

There is **no `app/layout.tsx`** and no locale React context. `app/[locale]/layout.tsx` is the root layout, which is what makes `<html lang>` and `data-locale` actually change per route. Content is passed down as a plain `copy` prop from the page — no `locale === "ja" ? … : …` anywhere in JSX.

---

## Content

Everything a recruiter reads is in [lib/content/en.ts](lib/content/en.ts) and [lib/content/ja.ts](lib/content/ja.ts), typed by [lib/types.ts](lib/types.ts). Updating site content means editing a content file, **not** the JSX.

- **Adding a project** is one object in `featured` or `other`; the row, the panel, the pills and the links all follow. Screenshots go in `/public/projects/`.
- **Adding an experience** is one object in `experiences`. `mark` is optional — omit it and no logo renders. `related` may be `[]`, which drops the related-work block.
- **Technology pills** are looked up by name in [lib/tech.ts](lib/tech.ts). A name mapped to `null` still renders as a plain pill, so nothing breaks if a mark is missing. Adding one: drop the file in `/public/tech/` and add a line to `TECH_ICONS`.
- **Edit both locales.** [tests/unit/content.test.ts](tests/unit/content.test.ts) fails if ids, hrefs, technology arrays, marks or skill items drift apart between `en` and `ja`, so you cannot forget one. Only prose differs.
- **Never add claims the English page does not make** — JLPT levels, language proficiency, visa or residency status. The same test guards a blocklist of these in *both* locales.

---

## Images

Two rules, and the ESLint config depends on them:

- **`next/image`** for the portrait (fixed 128px, `priority`) and project screenshots (inside a fixed 16:8 frame, so space is reserved before they load).
- **Plain `<img>` with explicit `width`/`height`** for technology marks and company logos — they are 12–20px tall, several are SVG, and this avoids turning on SVG handling in `next/image`. [.eslintrc.json](.eslintrc.json) therefore keeps `@next/next/no-img-element` **off**; do not turn it back on.
- A company `mark` in the content files carries the file's own dimensions; [CompanyMark](components/site/CompanyMark.tsx) renders every one at a shared 20px height and derives the width from that ratio. A square logo and a wordmark four times as wide have to weigh the same when they sit in front of a title.

Marks are shown in their original colours and are never tinted or greyscaled. The SVG logos in `public/logos/` carry their own `<style>` blocks — those blocks are what make them blue, so an "optimisation" pass that strips them will silently turn both logos black. [tests/e2e/assets.spec.ts](tests/e2e/assets.spec.ts) guards this.

---

## Loading and performance

- **Nothing is hidden waiting for JavaScript.** There is no preloader and no scroll-reveal. The first screen fades and rises in once, through a CSS animation with `animation-fill-mode: both` — no script gates it, nothing below the fold waits on a scroll position, and the whole page is there with JavaScript off. Changing language replaces the tree, so the same animation replays and the new language settles in rather than snapping in.
- **Fonts** are self-hosted through `next/font/local` with `display: swap`, a preloaded latin subset, a lazily fetched latin-ext subset, and a metric-adjusted fallback — no flash of default text and no reflow. Japanese has no face in the design system: `/ja` uses the reader's system Japanese font rather than downloading one.
- **Expand/collapse** keeps panel content in the DOM at all times, so opening is instant; the row animates `grid-template-rows` and `opacity` only. Opening and closing take the same `--duration-base`: the transition delay in `.disclosure-panel` applies to `visibility` alone, which is what keeps a closed panel's links out of the tab order without also holding up the collapse.
- **Navigation** inside the page is plain anchors with CSS smooth scrolling, so it works before hydration.

---

## Accessibility

- Semantic sections and exactly one `h1`.
- Rows are real `<button>`s with `aria-expanded` and `aria-controls` pointing at a `role="region"` panel. Closed panels are `invisible`, so their links leave the tab order.
- Focus rings are the design system's 2px sage ring on `:focus-visible`.
- The copy confirmation and the form's sent state are live regions.
- The contact form validates on submit, not on blur: nothing is marked wrong until Send has been pressed, after which the errors track every keystroke. [Field](components/ui/Field.tsx) still accepts an `onBlur` for anything that wants the older behaviour.
- The ink scale is ≥ 4.5:1 on ivory.

---

## Testing

### Unit tests — Vitest + React Testing Library

- Live in `tests/unit/`, run with `npm run test`.
- Environment: `happy-dom`. [tests/setup/vitest.setup.ts](tests/setup/vitest.setup.ts) installs jest-dom matchers and runs `cleanup()` between tests.
- [tests/setup/dom-mocks.ts](tests/setup/dom-mocks.ts) holds reusable mocks — `mockMatchMedia`, `mockClipboard`, `mockRaf`, `mockScrollIntoView`, `mockWindowScrollTo`, `mockWindowLocation`. Each returns a controller with a `restore()`; call it in `afterEach`.
- **`userEvent.setup()` installs its own `navigator.clipboard` stub.** If a test needs `mockClipboard`, install it *after* `userEvent.setup()`, not in `beforeEach` — otherwise userEvent overwrites it and the spy is never called.
- **Address a disclosure row by id**, `document.getElementById("button-<id>")`, not by its accessible name. A project title appears both as its own row button and as a "Related work" button inside an experience panel, so a role query matches two elements.
- Coverage scope: `components/**`, `lib/**`, `app/**` (configured in [vitest.config.ts](vitest.config.ts)).

### E2E tests — Playwright

- Live in `tests/e2e/`, run with `npm run test:e2e`.
- Four projects: `chromium`, `firefox`, `safari` (WebKit), `mobile` (iPhone 13 WebKit). `webServer` starts `npm run dev` locally and `npm run start` in CI.
- **`tsconfig.json` excludes `tests/e2e`** — Playwright uses its own tsconfig.
- **Don't rely on `window.scrollY` checks** — they're flaky in headless browsers. Use `expect(locator).toBeInViewport()`.
- **Mind the `mobile` project.** Below 640px the header links and the language switch move into the menu sheet. A test that drives the wide header must set an explicit desktop viewport; a test that drives the switch should reach whichever copy is visible (see the `languageSwitch` helper in [tests/e2e/i18n.spec.ts](tests/e2e/i18n.spec.ts)).
- **Scope `role="alert"` queries to the form.** Next.js renders its own route announcer with `role="alert"`, which otherwise trips strict mode.
- The honeypot is parked off-screen, not `display: none`, so it is "visible" to a browser. Assert its position, not `toBeHidden()`.

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
- No environment variables are required for the build. `NEXT_PUBLIC_FORMSPREE_ENDPOINT` is optional and falls back to the hardcoded form id.

---

## Conventions and gotchas

- **Strict TypeScript** — no `any`. Prefer importing types from [lib/types.ts](lib/types.ts).
- **Prettier:** single quotes, semicolons, trailing commas (`es5`), `printWidth: 100`, 2-space indent. See [.prettierrc.json](.prettierrc.json). The `tests/` directory is the exception — it is written in double quotes, matching Playwright's own style.
- **ESLint:** `@typescript-eslint/no-unused-vars` is warn-only with `argsIgnorePattern: "^_"`. `@next/next/no-img-element` is **off** on purpose (see Images above).
- **Client vs server components:** server by default; add `"use client"` only when the file uses hooks, browser APIs, or event handlers. `PortfolioPage`, `SiteHeader`, `LocaleSwitch`, `ContactForm`, `ContactSection`, `ExperienceSection`, `WorkSection`, `DisclosureRow` and `Field` are client; the rest are server.
- **All interactive state lives in [PortfolioPage.tsx](components/site/PortfolioPage.tsx)** — which experience row is open, which project row is open, and the toast. Sections receive `openId` and `onToggle`. Don't push state down into a section.
- **No hardcoded UI strings in components.** Add a key to `Copy` in [lib/types.ts](lib/types.ts) and implement it in both content files — TypeScript will fail the build until you do.
- **No emojis in source** unless explicitly asked.
- **No new docs files** (READMEs, NOTES, etc.) unless explicitly asked.

---

## Common tasks — where to look

- **Add or edit a project:** [lib/content/en.ts](lib/content/en.ts) + [lib/content/ja.ts](lib/content/ja.ts) (screenshot in `/public/projects/`).
- **Add or edit an experience:** the same two files (logo in `/public/logos/`).
- **Add a technology pill:** the two content files + a line in [lib/tech.ts](lib/tech.ts) + the mark in `/public/tech/`.
- **Change a UI string:** the `nav`, `sections`, `labels`, `contact` or `footer` blocks of both content files.
- **Change the page title, description or hreflang:** `meta` in both content files, and `generateMetadata` in [app/[locale]/layout.tsx](app/[locale]/layout.tsx).
- **Change a token (colour, type, spacing, radius, motion):** the `:root` block of [app/globals.css](app/globals.css), and its Tailwind name in [tailwind.config.ts](tailwind.config.ts) if it is new.
- **Change contact form behaviour:** [components/site/ContactForm.tsx](components/site/ContactForm.tsx); the endpoint and timeout are in [lib/site.ts](lib/site.ts).
- **Add an icon glyph:** extend the `PATHS` map in [components/ui/Icon.tsx](components/ui/Icon.tsx) — the `IconName` type is derived from it, so there is nothing else to keep in sync.
