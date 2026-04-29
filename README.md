# Rain Zhang — Portfolio (Next.js source)

This folder is a drop-in Next.js 14+ App Router project. The same component code
also powers the in-browser preview (`/Portfolio.html` at the project root).

## Run locally

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Structure

```
nextjs/
  app/
    layout.tsx        # fonts, metadata, global styles
    page.tsx          # composes the home page
    globals.css       # design tokens + element styles
  components/         # design-system + section components
  lib/projects.ts     # project data
  public/             # static assets (portrait, logo, resume)
  package.json
  next.config.mjs
  tsconfig.json
```

The design system lives in `globals.css` (CSS variables) and the
`components/ui/*` primitives — `Button`, `Pill`, `Eyebrow`, `Reveal`, `Section`.
Sections (`Hero`, `About`, `Skills`, `Experience`, `Projects`, `Education`,
`Contact`, `Footer`) compose those primitives only.
