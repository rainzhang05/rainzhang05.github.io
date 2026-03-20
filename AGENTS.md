# AGENTS.md

## Project Snapshot
- Static portfolio site (no build step, no framework, no package manager) served from root files.
- Runtime is plain browser JS + HTML fragments + CSS imports; deployment target is Vercel per `README.md`.

## Architecture (Read First)
- `index.html` is the shell: it loads CSS (`css/main.css`) and JS files in strict dependency order.
- Section HTML is fetched at runtime into containers (`#layout-container`, `#projects-container`, etc.) via `loadSection(...)` in `index.html`.
- After all fragments load, `index.html` dispatches `sectionsLoaded`; `js/main.js` listens and starts `beginPreloadingSequence()`.
- `js/preloader.js` gates user interaction, waits for window load/fonts/images, then calls `initPage()` once.
- `initPage()` wires all features in order: intro/typewriter, dock, theme, navigation, contact form, project cards/modal links.

## Module Boundaries
- Shared state lives in `js/globals.js` (`isPageInitialized`, modal state, intro state).
- Modal scroll locking is isolated in `js/modal.js`; project modal behavior is in `js/projects.js`.
- Navigation/hash behavior is in `js/navigation.js`; dock behavior and icon normalization in `js/dock.js`.
- Contact submit flow is in `js/contact.js` (Formspree POST + inline success/failure UI).

## Conventions You Should Preserve
- JS is global-script style (no ES modules/imports); function names are referenced across files, so load order in `index.html` matters.
- Initialization must remain idempotent (`isPageInitialized` guard in `js/preloader.js`).
- Keep state classes consistent: `intro-prep`, `intro-animate`, `is-preloading`, `preloading-complete`, `dark-mode`, `modal-open`.
- For new sections, update both `index.html` container + `Promise.all([...loadSection(...)])` entry.
- Navigation anchors expect matching section IDs in fragments (example: nav `#projects` -> `<h2 id="projects">` in `html/projects.html`).

## Project Card / Modal Pattern
- Modal content is derived from `.project-card` DOM in `html/projects.html` and `html/experience.html`.
- Keep card structure: `.project-card` -> `.project-header` + `.project-content` + `.project-summary` + `.project-description`.
- `openProjectModal()` removes `.project-summary`, `.experience-related`, `.project-cover`, and `.read-more` from cloned content; account for this when editing card markup.
- Cross-links use `data-open-project="<project-card-id>"` (see `html/experience.html`).

## CSS Organization
- `css/main.css` is the single import hub; add new stylesheet imports there.
- Put theme overrides in `css/dark-mode.css` and breakpoint overrides in `css/responsive.css`.
- Modal-related layout/animation styles are centralized in `css/modal.css` and `css/projects.css`.

## Local Workflow / Debugging
- Use a local HTTP server (fragments are fetched; opening `index.html` directly can break section loading).
- Quick run from repo root: `python3 -m http.server 8000` then open `http://localhost:8000`.
- If UI hooks fail, first confirm fragment IDs/classes exist after `sectionsLoaded` (many setup functions query DOM once).
- No automated tests or lint config are present in this repo; validate changes by manual browser checks.

## External Integrations
- Contact form submits to Formspree endpoint in `html/contact.html` (`action="https://formspree.io/f/xoveaaqo"`).
- Top bar (`#dock` in `html/layout.html`) uses `--card-surface-bg` (same fill as project/education cards): section nav, social links, and a segmented light/dark/system theme control (`js/theme.js`, `localStorage` key `portfolio-color-scheme`). Theme segment icons use external Iconify SVG URLs; other assets are local (`icons/`, `images/`, `fonts/`).

