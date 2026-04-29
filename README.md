# Rain Zhang — Personal Portfolio

Live site: <https://rainzhang.me/>

A Next.js 14 (App Router) portfolio with TypeScript, deployed on Vercel.

## Stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Pure CSS with design tokens in `app/globals.css`
- Google Fonts via `next/font/google` — Inter, Instrument Serif, JetBrains Mono
- [Formspree](https://formspree.io/) for contact-form delivery (form ID is configured in `components/Contact.tsx`)
- Playwright for end-to-end tests

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Build & test

```bash
npm run build      # production build
npm run lint       # Next.js / ESLint checks
npm test           # Playwright e2e (boots `npm run start` automatically)
npm run test:ui    # Playwright UI mode for debugging
```

## Deploy

Vercel auto-detects Next.js and deploys on every push to `main`. The custom domain `rainzhang.me` is configured in the Vercel project settings; preview deployments are produced for every pull request.

CI runs `npm run lint`, `npm run build`, and `npm test` on every push and PR (`.github/workflows/test.yml`).

## Project layout

```
app/
  layout.tsx        # fonts, metadata, global styles
  page.tsx          # composes the home page
  globals.css       # design tokens + element styles
components/         # Hero, Nav, About, Skills, Experience, Projects, Education, Contact, Footer, ui (hooks/icons)
lib/projects.ts     # project data (newest first)
public/             # portrait, logo, resume PDF, favicon
tests/e2e/          # Playwright suite
```

## Editing content

- Hero, About, Skills, Experience, Footer copy lives directly in the matching `components/*.tsx` files.
- Project entries (title, summary, impacts, links) live in `lib/projects.ts`. The order in that array is the order on the page.
- Page metadata (title, description, OG card) lives in `app/layout.tsx`.

## License

MIT — see `LICENSE`.
