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
- **Four routes, two pages:** `/` and `/ja` are the same single scrolling page in two languages; `/resume` and `/ja/resume` are the resume, also the same page in two languages. There is no fifth route.
- **Framework:** Next.js 15 App Router + React 18 + TypeScript (strict) + Tailwind CSS 3.
- **Deployed on:** Vercel (`vercel.json` pins `framework: nextjs`).
- **Forms:** Contact form posts to Formspree. The endpoint lives in [lib/site.ts](lib/site.ts) and can be overridden with `NEXT_PUBLIC_FORMSPREE_ENDPOINT`.
- **Node:** `>=20` (CI uses Node 20).

The design is deliberately quiet: one warm ivory theme, one typeface, one accent, no borders or shadows, and two interactions — rows that expand in place, and the section dock down the left edge. If a change adds a third interaction pattern, a second accent, or a theme toggle, it is working against the design, not with it.

The dock was added deliberately and against the grain of that rule: the page had no persistent navigation at all below the fold. It is held to the same quiet standard — no new colour, no new shadow, no icon language, and it borrows the pill shape the technology tags already use. Do not treat it as licence for a third pattern.

---

## Directory layout

```
app/
  globals.css              Design tokens (colour, type, spacing, radius, motion) + base rules.
                           The only file in the repo with raw values.
  fonts.ts                 Albert Sans, self-hosted through next/font/local
  fonts/*.woff2            The four font files (upright/italic x latin/latin-ext)
  icon.svg                 Favicon, applied to every route
  [locale]/
    layout.tsx             Root layout: <html lang>, fonts, metadata, generateStaticParams
    page.tsx               Renders <PortfolioPage> with that language's content
    resume/page.tsx        Renders <ResumePage> with that language's resume

components/
  ui/                      Primitives with no knowledge of the site: Icon, Eyebrow, TechTag,
                           TextLink, Button, Toast, Field
  site/                    The page itself:
    PortfolioPage.tsx      The shell — all interactive state lives here and nowhere else
    SiteHeader.tsx         Static header, menu sheet under 640px, EN / 日本語 switch
    SectionDock.tsx        The left rail the header morphs into past the first screen
    Intro.tsx              Hero: eyebrow, heading, body, resume + copy email
    ResumePage.tsx         The resume page: masthead, download, two columns
    ResumeEntry.tsx        One role or project on the resume, and its meta line
    DisclosureRow.tsx      The one expand/collapse row, shared by experience and work
    ExperienceSection.tsx / WorkSection.tsx / BackgroundSection.tsx
    ContactSection.tsx / ContactForm.tsx
    SectionHeading.tsx / CompanyMark.tsx / LocaleSwitch.tsx / SiteFooter.tsx
    LocaleMemory.tsx       Renders nothing; records the language being read in the cookie

lib/
  dockMotion.ts            The dock's maths: progress, gaussian falloff, bezier sampling
  sectionLinks.ts          The four in-page sections, shared by the footer and the dock

lib/
  site.ts                  Email, links, resume routes and PDFs, Formspree endpoint, locales,
                           the language cookie and the one function that writes it
  types.ts                 The content model (Copy, Experience, Project, SkillGroup, …)
  tech.ts                  Technology name -> mark file in public/tech
  content/en.ts            All English copy and content
  content/ja.ts            All Japanese copy and content
  content/resume.en.ts     The English resume, transcribed verbatim from its PDF
  content/resume.ja.ts     The Japanese resume, transcribed verbatim from its PDF
  content/index.ts         Assembles both into Record<Locale, Copy>, and the resumes
  useReducedMotion.ts      Hook + a plain function for the two JS scroll nudges
  panelMotion.ts           Expand/collapse duration from content height and --panel-speed

middleware.ts              Sends an arrival to the remembered language, or to Japanese if the
                           first visit is from Japan

public/
  rain-zhang-resume.pdf    English resume; downloaded from /resume and nowhere else
  rain-zhang-resume-ja.pdf Japanese resume; downloaded from /ja/resume
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

- **Dock:** `--dock-pitch` (40 — centre to centre, and the button's own height, so n bubbles are exactly n x pitch tall; `SPREAD` in [lib/dockMotion.ts](lib/dockMotion.ts) is 0.95 x this, so retuning one means retuning the other), `--dock-dot` (10 — the nominal diameter, scaled between 0.7 and 1.5 by the lens), `--dock-rise` (10 — the travel on the way in, the same distance the first screen rises) and `--dock-reach` (120 — how far right of the rail a pointer is felt, clamped at runtime to the gutter that actually exists). `--dock-hit` and `--dock-inset` **step at 1176px**: 36/12 below it, where the content column starts at exactly 48px and the rail's box has to end there, and 44/16 above it, where the gutter has room. That step is a media query, not a width read in JavaScript, for the same reason the 640px gate is one.
- **Colour:** `--paper`, `--sheet`, `--surface`, `--surface-2`; ink scale `--ink`, `--ink-hover`, `--ink-2`, `--ink-3`; rules `--rule`, `--rule-strong`; accent `--sage`, `--sage-strong`, `--sage-tint`; and two semantic colours, `--clay` (errors) and `--ochre`.
- **Type:** one family. `--font-sans` is Albert Sans from [app/fonts.ts](app/fonts.ts); `--font-sans-jp` is a system Japanese stack that `html[data-locale='ja']` swaps in. The size scale runs `--text-label` (12) through `--text-hero`.
- **Spacing and layout:** `--container` (1080), `--gutter` / `--gutter-mobile`, `--label-col` (160 — the date column), `--reading-col`, `--section-gap`, `--hero-pad`.
- **There is one theme.** No `data-theme`, no theme script, no `localStorage`, no dark mode. Removing that machinery is what makes the first paint the finished page. Do not add it back without being asked.

### Motion

Three values in the `:root` block of `app/globals.css` drive every transition on the site:

| Token | Value | Used by |
| --- | --- | --- |
| `--duration-fast` | 150ms | every colour, border and background change |
| `--duration-base` | 220ms | the language pill; the fallback before a panel is measured |
| `--duration-slow` | 320ms | the section dock's active fill, closing a ring into a disc |
| `--ease-out` | `cubic-bezier(.2,.6,.2,1)` | all of the above |
| `--panel-speed` | 1400 | expand / collapse, in **pixels per second** — not a duration |
| `--ease-panel` | `cubic-bezier(.3,.45,.15,1)` | expand / collapse; immediate start, even glide, long settle |
| `--duration-enter` | 620ms | the first-screen entrance |
| `--duration-dock` | 420ms | one section-dock bubble's rise and fade |
| `--dock-step` | 90ms | the dock's stagger. **Not `--enter-step`:** at 60ms against a 420ms travel on a curve as front-loaded as `--ease-enter`, all five beats overlap and the column reads as one fade rather than a cascade |
| `--duration-dock-all` | 600ms | `--duration-dock` + 2 x `--dock-step` — the spine's own draw, and the delay on the rail's `visibility` so the exit is never cut short |
| `--enter-step` | 60ms | one beat of the entrance stagger (`.enter-1` … `.enter-6`) |
| `--ease-enter` | `cubic-bezier(.16,1,.3,1)` | the entrance; most of the movement is over early |

Change one number there and the whole site changes with it. A `prefers-reduced-motion: reduce` block at the bottom of the same file zeroes every duration **and delay**, and the two JS scroll nudges in [PortfolioPage.tsx](components/site/PortfolioPage.tsx) check `prefersReducedMotion()` before choosing `smooth`.

`.enter` (rise and fade) and `.enter-fade` (fade only) are the two entrance classes, both declared in `globals.css` so no component carries a millisecond count. Use `.enter-fade` on anything with a `position: fixed` descendant — a transformed ancestor would become its containing block for the length of the animation, which is why the header uses it and the menu sheet does not move.

---

## Information architecture

`/` (English) and `/ja` (Japanese) are the same single page:

intro → Experience → Selected work → Other work → Background (education and skills) → Contact → footer.

`/resume` and `/ja/resume` are the second page: masthead → Download PDF → Experience and Projects beside Skills and Education. It carries the site's header and footer but no section dock, and its in-page links point back at the home page — `SiteHeader` takes a `homeHref` and `SiteFooter` a `sectionBase` for exactly that, empty on the home page and `localeHome[locale]` on the resume.

Section `id`s are English in both locales (`experience`, `work`, `background`, `contact`, plus `top`) because hash links and the footer nav depend on them. Only the labels are translated. A unit test asserts every in-page `href` — the header nav plus [sectionLinks](lib/sectionLinks.ts), which the footer and the dock share — points at a section the page actually renders.

In `sectionLinks`, **`id` is the element the dock watches and `href` is where the link goes**, and for Introduction they differ: it watches `#intro` (a real section an `IntersectionObserver` can answer for) and goes to `#top` (the document top, where the wordmark and the footer's "Back to top" also go). `#top` can never be the watched element — it wraps the whole page, so it always intersects and would pin the active section to the first one forever. Use `targetId(link)` to navigate, never `link.id`.

`copy.nav` is the header's list and includes the resume page but not Background; `sectionLinks(copy)` is the five real sections. They are different sets on purpose, and no filter of one produces the other.

---

## Routing and localization

Both languages come from one `app/[locale]` tree:

- `generateStaticParams` prerenders `en` and `ja`; `dynamicParams = false`, so anything else 404s.
- `/` is rewritten to `/en` internally and `/en` redirects to `/`, and `/resume` and `/en/resume` are the same pair (both in [next.config.mjs](next.config.mjs)), so each language has exactly one canonical URL per page. Redirects are evaluated before rewrites and a rewrite does not re-enter them, so there is no loop. The rewrite is also what stops `/resume` being read as the `[locale]` segment and 404ing under `dynamicParams: false` — add a route here and it needs its own pair.
- **A nested page's metadata replaces the layout's one key at a time.** `app/[locale]/resume/page.tsx` restates `alternates`, `openGraph` and `twitter` in full; drop one and the resume page silently advertises the home page's canonical URL and `og:url`.
- **Which language an arrival gets, in order:** the `portfolio.locale` cookie if it holds a language this site has; otherwise `x-vercel-ip-country` — `JP` gets Japanese, everyone else English. Location decides the first visit of all and is never consulted again. [middleware.ts](middleware.ts) is where this lives; it 307s `/` to `/ja` and `/resume` to `/ja/resume`, and its matcher is an explicit list of the English routes, never a pattern: a catch-all would match `/ja` and redirect it to itself. It only ever redirects *into* Japanese, so a link to `/ja` is never bounced back to `/`. Local `next dev` has no country header, so an unremembered `/` stays English.
- **Two things write the cookie, both in the browser.** [LocaleSwitch](components/site/LocaleSwitch.tsx) writes it on a click, and [LocaleMemory](components/site/LocaleMemory.tsx) — mounted in the layout, renders nothing — writes the language of the page being read, so a reader who arrived at `/ja` from a link or from the geo redirect is opened in Japanese next time too. Both go through `rememberLocale` in [lib/site.ts](lib/site.ts); do not write `document.cookie` for this anywhere else. A deliberate choice always wins, because the switch writes the cookie before it navigates.
- **The middleware steers arrivals only, and tells them apart by `Accept: text/html`.** Next strips the `RSC` and prefetch headers — and the `_rsc` query it appends — before middleware sees the request, so what the request asks for is the only thing left to go on. This matters: the switch prefetches the other language through `next/link`, and a prefetch of `/` answered with a redirect back to `/ja` is cached as the answer for `/`, after which clicking EN lands back on Japanese. E2E requests that mean to test the redirect must send a browser-like `Accept` header (`ARRIVING` in [tests/e2e/i18n.spec.ts](tests/e2e/i18n.spec.ts)).
- The switch uses `next/link`, so the other language is prefetched and both routes stay crawlable.

There is **no `app/layout.tsx`** and no locale React context. `app/[locale]/layout.tsx` is the root layout, which is what makes `<html lang>` and `data-locale` actually change per route. Content is passed down as a plain `copy` prop from the page — no `locale === "ja" ? … : …` anywhere in JSX.

---

## Content

Everything a recruiter reads is in [lib/content/en.ts](lib/content/en.ts) and [lib/content/ja.ts](lib/content/ja.ts), typed by [lib/types.ts](lib/types.ts). Updating site content means editing a content file, **not** the JSX.

- **Adding a project** is one object in `featured` or `other`; the row, the panel, the pills and the links all follow. `links` (live site, repository) render on the collapsed row beside the pills, never inside the panel. Screenshots go in `/public/projects/` as WebP, 1760px wide — twice the 880px frame the `sizes` attribute asks for, which is as much as any display can use. They were 3MB PNGs at 2980×1530 until that was measured.
- **Adding an experience** is one object in `experiences`. `mark` is optional — omit it and no logo renders. `related` may be `[]`, which drops the related-work block.
- **Technology pills** are looked up by name in [lib/tech.ts](lib/tech.ts). A name mapped to `null` still renders as a plain pill, so nothing breaks if a mark is missing. Adding one: drop the file in `/public/tech/` and add a line to `TECH_ICONS`.
- **Edit both locales.** [tests/unit/content.test.ts](tests/unit/content.test.ts) fails if ids, hrefs, technology arrays, marks or skill items drift apart between `en` and `ja`, so you cannot forget one. Only prose differs. A resume href is the one exception: `/resume` and `/ja/resume` legitimately differ, so `shape()` strips the `/ja` prefix before comparing and a separate test pins the prefix itself.
- **The resume is a transcription, not content you write.** [lib/content/resume.en.ts](lib/content/resume.en.ts) and [resume.ja.ts](lib/content/resume.ja.ts) are the two PDFs in `public/`, word for word and in their own order — nothing added, reworded or left out. They are deliberately *not* derived from `copy.experiences` / `featured` / `skills` / `education`, which say different things, and they are outside `Copy` so the home page does not ship them. Change the PDF first, then the file. The two were written separately rather than translated, so they match in structure but not in line count; [tests/unit/resume.test.ts](tests/unit/resume.test.ts) checks what they share and deliberately not what they do not.
- **Never add claims the English page does not make** — JLPT levels, language proficiency, visa or residency status. The same test guards a blocklist of these in *both* locales, and over the resume as well as the page.

---

## Images

Two rules, and the ESLint config depends on them:

- **`next/image`** for project screenshots (inside a fixed 16:8 frame, so space is reserved before they load), with `loading="eager"`. The hero is type only — it carries no image.
- **Nothing on the page is lazy.** Both the screenshots and the technology marks load eagerly, and both had to. A screenshot sits inside a panel that is always in the DOM but collapsed to a zero-height track, which never intersects, so lazily it would not begin loading until the row was clicked. The marks are a few kilobytes each and under 80KB for the set, so there is nothing to defer — and the boot gate can only wait for a request that exists.
- **Keep the source files the size they are drawn.** The marks are 96px, eight times the 12px they render at; the screenshots are 1760px. `public/` was 9.7MB and is now 1.2MB, and almost all of the difference was a 2048px PNG being downloaded to draw a pill glyph. Before adding an asset, check its pixel dimensions against the box it goes in.
- **Plain `<img>` with explicit `width`/`height`** for technology marks and company logos — they are 12–20px tall, several are SVG, and this avoids turning on SVG handling in `next/image`. [.eslintrc.json](.eslintrc.json) therefore keeps `@next/next/no-img-element` **off**; do not turn it back on.
- A company `mark` in the content files carries the file's own dimensions; [CompanyMark](components/site/CompanyMark.tsx) renders every one at a shared 18px height and derives the width from that ratio. A square logo and a wordmark five times as wide have to weigh the same when they sit in front of a title.
- A mark may also declare `scale`, an optical adjustment against that shared height for when equal ink still does not read as equal weight — MNT's compact square carries `1.45`, since a single glyph needs noticeably more height than a wide wordmark to carry the same weight.
- **That height is ink, not canvas.** Both logo `viewBox`es are cropped to their drawn pixels, so 18px of box is 18px of visible mark. `feitian.svg` is cropped to the wordmark alone — its "WE BUILD SECURITY" line is still in the path data but falls outside the viewBox, because at this size it rendered as 4px of unreadable smudge. Widening that viewBox brings it back. Before adding a logo, check its file for padding or a tagline and crop the `viewBox`, never the path data or the `<style>` block.

Images, technology badges and every control carry `.no-copy` (see `globals.css`), so a click or a double-click on one leaves no text selection and images cannot be dragged out. Prose, panel bodies and the contact links are deliberately left selectable — copying those is the point. A browser's own "copy image" is not blocked; suppressing the context menu to do that is not worth what it breaks.

Marks are shown in their original colours and are never tinted or greyscaled. The SVG logos in `public/logos/` carry their own `<style>` blocks — those blocks are what make them blue, so an "optimisation" pass that strips them will silently turn both logos black. [tests/e2e/assets.spec.ts](tests/e2e/assets.spec.ts) guards this.

---

## Loading and performance

- **The boot gate.** The first load of a session is covered by a sheet of paper — the wordmark and one filling hairline on `--paper` — until every image and font the page needs has arrived. It exists because the marks and screenshots used to appear one at a time on a slow machine, and a screenshot inside a closed panel did not begin loading until the row was clicked, so it drew in half under the reader. [lib/boot.ts](lib/boot.ts) holds the timings and the reasoning; [BootGate](components/site/BootGate.tsx) does the waiting; the CSS is at the foot of [globals.css](app/globals.css).
- **Everything about the gate is off until a script turns it on**, and that is the whole safety argument. `#boot` is `display: none` and the entrance animations are untouched until the inline script — the first thing in `<body>`, before `#boot` is parsed, so there is no frame of page underneath — raises one and pauses the other. A sheet that only a script can raise cannot be left up by a script that never ran, so **the page is still readable and navigable with JavaScript off**, exactly as it was before the gate existed. Do not invert this. In particular `data-boot` lives on `<html>`, which React owns too: a locale change replaces the tree and takes the attribute with it, and losing it has to lower the sheet rather than raise it.
- **Three states, not two.** `pending` → the sheet is opaque and the entrance is held. `leaving` → the sheet is fading and the entrance is *still* held, so its 620ms plays after the sheet has gone rather than through the last of it. `done` → the sheet is down and the entrance runs. The handoff out of `leaving` is a `transitionend` with a timer behind it, because a backgrounded tab never fires one.
- **The entrance is withdrawn, not paused — and held at its own `from`.** `animation-play-state: paused` is the obvious way to hold `.enter` and it does not work: an animation held from before it ever started never resumes in Chrome — the play state goes back to `running` and the current time stays at zero for good. So the rule at the foot of `globals.css` uses `animation: none`. But that alone leaves the element at its *finished* state, which is the bug that shipped: the sheet faded away over a page that was already drawn, and the moment the animation came back the whole first screen blinked out and arrived a second time. The held state therefore restates the keyframe's `from` by hand — `opacity: 0`, plus the 10px rise for `.enter` but not for `.enter-fade`, whose whole reason for existing is to keep a transform off the header. `animation-fill-mode: both` then puts the restored animation on that exact state for the length of its delay, so nothing moves at the handover. [boot.spec.ts](tests/e2e/boot.spec.ts) samples the heading's opacity every frame and fails if it ever drops.
- **One thing arrives per navigation.** `data-entrance` on `<html>` says what: the first screen, or the section the reader came for. Every link in the resume page's header and footer goes to a section of the home page, so arriving part-way down it is ordinary — and the first screen's cascade is wrong there twice over. `#experience` carries the sixth beat of that cascade, so arriving at it meant six beats of waiting on an intro nobody could see; `#work` and `#contact` were not in the cascade at all, so they simply appeared. Each of the four sections now has its own single-beat arrival, and it is the only thing that moves — see [lib/entrance.ts](lib/entrance.ts) and the arrival block in [globals.css](app/globals.css).
- **The attribute is set by the inline script first, and by the router after.** The server never sees a fragment, so a React prop would render the settled page, paint it, and only then hide the deep-linked section to animate it in — the same flash the boot gate had. The script in `<body>` sets it before anything is parsed; `EntranceRouter` keeps it right across client navigations, and it lives on the shared layout so that leaving the home page clears it, otherwise a stale value silences the resume page's own entrance. Nothing after the attribute needs JavaScript: the arrival is a CSS animation with `animation-fill-mode: both`.
- **The id in those selectors is load-bearing.** `html[data-entrance='work'] #work` has to outrank the blanket that settles `.enter` and `.enter-fade` beside it, and the boot hold has to outrank both — which is why the hold lists the four section ids as well as `.enter`. Rewrite any of the three with a different specificity and the wrong thing animates.
- **The hold is released at `leaving`, not at `done`,** so the first screen arrives through the sheet's last 220ms instead of waiting for it. Holding to the end left a third of a second of paper on paper with nothing in it. The overlap is free: the sheet is `--paper` over a `--paper` page, so all it dims is text that is fading up anyway.
- **The sheet stays blank for `--boot-reveal`** before the wordmark fades in, because most boots are over well inside it and a wordmark that appears and immediately leaves is its own kind of flash. Under `prefers-reduced-motion` the mark is not rendered at all: the global reduced-motion block forces every delay to 0.01ms, so nothing can hold it back there.
- **Nothing waits on a frame that may never come.** A backgrounded tab paints none, so `requestAnimationFrame` is raced against a 50ms timer, and every image carries its own budget for the stall that fires neither `load` nor `error`. `img.complete` is true for a 404 as well as for a cached hit, which is why a missing file cannot hang the gate. The image scan is two passes and never a loop: `document.images` is live, and iterating it until it comes back clean is how a gate hangs forever.
- **No content is hidden waiting for JavaScript below the fold.** There is no scroll-reveal. The first screen fades and rises in once, through a CSS animation with `animation-fill-mode: both` — no *content* below the fold waits on a scroll position. The section dock is the one scroll-driven thing on the page, and it is an additional control rather than content: with JavaScript off it never appears and the header and footer navigation still work. Changing language replaces the tree, so the same animation replays and the new language settles in rather than snapping in.
- **Fonts** are self-hosted through `next/font/local` with `display: swap`, a preloaded latin subset, a lazily fetched latin-ext subset, and a metric-adjusted fallback — no flash of default text and no reflow. Japanese has no face in the design system: `/ja` uses the reader's system Japanese font rather than downloading one.
- **Expand/collapse** keeps panel content in the DOM at all times, so opening is instant; the row animates `grid-template-rows` and `opacity` only. The transition delay in `.disclosure-panel` applies to `visibility` alone, which is what keeps a closed panel's links out of the tab order without also holding up the collapse.
- **Panels are given a speed, not a duration.** Content heights run from about 600px to over 1250px, so one duration made the tall rows move at twice the rate of the short ones. [DisclosureRow](components/site/DisclosureRow.tsx) measures its own content with a `ResizeObserver` and sets `--panel-duration` from `--panel-speed` (see [lib/panelMotion.ts](lib/panelMotion.ts)); every row then opens and closes at 1400px/s, in both directions, starting immediately. Change `--panel-speed` to retune all of them at once — never hard-code a duration on a panel.
- **One speed means one speed, and it is measured.** Because the duration follows the distance, every row in every section moves at the same rate in both directions and only the time taken differs — 426ms for the shortest experience entry, 899ms for the tallest project. Sampled frame by frame across all eight rows the spread is under 6%, which is the sampling itself. If a row ever feels out of step with its neighbours, the distance is wrong, not the speed: check what `panelDurationMs` was handed.
- **Measure with `scrollHeight`.** A shut row is a grid track at `0fr` with its overflow hidden, and both `getBoundingClientRect()` and `offsetHeight` of the content inside it report **0** there; only `scrollHeight` reports the real height in either state. Measuring the rect happens to work because the effect runs before the row collapses, which is a figure that is right by timing rather than right. A zero measurement floors the duration at `MIN_PANEL_MS`, which for the tallest panel is more than twice the shared speed.
- **Navigation within a page** — the header and the footer on the home page — is plain anchors with CSS smooth scrolling, so it works before hydration. **Navigation that crosses a route is `next/link`**, and that is what `homeHref` on [SiteHeader](components/site/SiteHeader.tsx) and `sectionBase` on [SiteFooter](components/site/SiteFooter.tsx) actually select: empty means this page, so a hash is an anchor; anything else means the link leaves this route, where an anchor is a whole document load. That is what made returning from the resume slow — and why the hero's Resume button takes `internal` on `ButtonLink`. The resume page now prefetches the home page while it is being read, and the trip back is a transition. `<html>` carries `data-scroll-behavior="smooth"` so the router turns the smooth scrolling off for the length of that transition and a cross-route jump to a section lands rather than flies. `scroll-padding-top` is `0` and no section carries a `scroll-mt-*`, so a jump lands on the section's own top edge; give either one a value and the tail of the previous section stays on screen. The dock's buttons go through `scrollToSection` in [PortfolioPage](components/site/PortfolioPage.tsx), which uses the same `window.scrollTo` idiom at offset 0 and then moves focus into the section — a button, unlike an anchor, does not move the focus starting point by itself.
- **The dock's entrance is CSS, not JavaScript.** Crossing the threshold flips one attribute and the transitions in `globals.css` unfurl the spine and lift the bubbles in from the middle outward; scrolling back up flips it again and an interrupted transition reverses itself, outside-in. Nothing is scroll-scrubbed, which is what keeps the motion at its own speed rather than the trackpad's. JavaScript owns exactly four things — `data-shown` on the rail, `data-active` and `data-open` on each button, and the lens `scale()` on each dot — and none of the properties those drive.
- **Two things about the dock will silently break if you change them.** It is hidden with `visibility`, never `display`: a `display` flip has no before-change style, so the whole entrance would snap (`display: none` is only the sub-640px gate). And the first paint after hydration carries `data-immediate`, which sets `transition: none` — because `measure()` calls `getComputedStyle` for the dock tokens *before* the attribute flips, and that resolution is a before-change style a deep-linked load would otherwise animate from.
- **The dock reads landmarks with `offsetTop`**, never `getBoundingClientRect`, because `#experience` carries `.enter` and is transform-offset by 10px for the first second after paint. Under `prefers-reduced-motion` the frame loop never starts: the CSS `!important` duration reset cannot touch a transform written from JavaScript, so the lens has to opt out in JavaScript too.

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
- **Sweep widths by resizing, not by reloading.** Layout is CSS, so one navigation and three `setViewportSize` calls prove exactly what four navigations do, in a fraction of the time. This has timed out CI twice. Since the page began loading its images up front there is a second reason: each viewport asks `next/image` for a different variant, and `next start`'s own optimizer stalls the browser on the first cold request for a second variant. Vercel's does not — the live site was checked at every one of those widths — so this is a CI-only trap, not something to design the page around.
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
- **Client vs server components:** server by default; add `"use client"` only when the file uses hooks, browser APIs, or event handlers. `PortfolioPage`, `SiteHeader`, `SectionDock`, `LocaleSwitch`, `ContactForm`, `ContactSection`, `ExperienceSection`, `WorkSection`, `DisclosureRow` and `Field` are client; the rest are server.
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
- **Update the resume:** replace the PDF in `/public/`, then transcribe the change into [lib/content/resume.en.ts](lib/content/resume.en.ts) or [resume.ja.ts](lib/content/resume.ja.ts). The page has no content of its own.
- **Change the page title, description or hreflang:** `meta` in both content files, and `generateMetadata` in [app/[locale]/layout.tsx](app/[locale]/layout.tsx).
- **Change a token (colour, type, spacing, radius, motion):** the `:root` block of [app/globals.css](app/globals.css), and its Tailwind name in [tailwind.config.ts](tailwind.config.ts) if it is new.
- **Change contact form behaviour:** [components/site/ContactForm.tsx](components/site/ContactForm.tsx); the endpoint and timeout are in [lib/site.ts](lib/site.ts).
- **Add an icon glyph:** extend the `PATHS` map in [components/ui/Icon.tsx](components/ui/Icon.tsx) — the `IconName` type is derived from it, so there is nothing else to keep in sync.
