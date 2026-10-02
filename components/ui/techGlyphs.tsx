/**
 * One line glyph per technology, drawn on the same 24px grid with the same
 * 1.5 stroke and round caps as the rest of the icons, so a technology reads as
 * the same kind of mark as the GitHub and LinkedIn buttons. They are simplified
 * outlines of each mark, not copies of a brand's artwork, and they inherit the
 * colour of the text beside them. GitHub is the one already in Icon.tsx.
 *
 * Lucide (ISC licence) supplies the git, flask, database, cloud, terminal and
 * share glyphs; the rest are drawn here.
 */
export const TECH_GLYPHS = {
  c: (
    <>
      <path d="M12 2.5l8.5 5v9l-8.5 5-8.5-5v-9z" />
      <path d="M15 9.6a3.6 3.6 0 1 0 0 4.8" />
    </>
  ),
  cpp: (
    <>
      <path d="M12 2.5l8.5 5v9l-8.5 5-8.5-5v-9z" />
      <path d="M11.2 9.8a3 3 0 1 0 0 4.4" />
      <path d="M13.4 12h2.4" />
      <path d="M14.6 10.8v2.4" />
      <path d="M16.6 12h2" />
      <path d="M17.6 10.8v2.4" />
    </>
  ),
  css: (
    <>
      <path d="M4 3h16l-1.5 16.5L12 21.5l-6.5-2z" />
      <path d="M8.5 7.8h6.8L12.8 11c1.7.1 2.9 1 2.9 2.4 0 1.5-1.4 2.6-3.2 2.6-1 0-1.9-.3-2.5-.8" />
    </>
  ),
  docker: (
    <>
      <rect x="4.5" y="8.5" width="2.5" height="2.5" />
      <rect x="7.5" y="8.5" width="2.5" height="2.5" />
      <rect x="10.5" y="8.5" width="2.5" height="2.5" />
      <rect x="13.5" y="8.5" width="2.5" height="2.5" />
      <rect x="7.5" y="5.5" width="2.5" height="2.5" />
      <path d="M2.5 12.5h17c1.2 0 2-.6 2.5-1.7" />
      <path d="M2.8 12.5c.4 3.8 3.4 6.5 8.2 6.5 5.2 0 8.5-2.6 9.5-6.5" />
    </>
  ),
  entra: (
    <>
      <path d="M12 3l7.5 3v5.5c0 4.2-3 7.7-7.5 9.5-4.5-1.8-7.5-5.3-7.5-9.5V6z" />
      <circle cx="12" cy="10" r="2" />
      <path d="M8.5 16c.7-1.6 2-2.3 3.5-2.3s2.8.7 3.5 2.3" />
    </>
  ),
  fido2: (
    <>
      <path d="M8 21h8a2 2 0 0 0 2-2v-8H6v8a2 2 0 0 0 2 2z" />
      <path d="M9 11V3h6v8" />
      <circle cx="12" cy="16" r="1.5" />
    </>
  ),
  flask: (
    <>
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16h10" />
    </>
  ),
  git: (
    <>
      <line x1="6" x2="6" y1="3" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </>
  ),
  githubactions: (
    <>
      <circle cx="5.5" cy="12" r="2.5" />
      <path d="M8 12h3" />
      <path d="M11 7.5v9l7.5-4.5z" />
    </>
  ),
  googlecloud: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />,
  graph: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.59 13.51 6.83 3.98" />
      <path d="m15.41 6.51-6.82 3.98" />
    </>
  ),
  html: (
    <>
      <path d="M4 3h16l-1.5 16.5L12 21.5l-6.5-2z" />
      <path d="M16.5 7.5H8l.3 3.5h7.8l-.5 5-3.6 1.1-3.6-1.1-.2-2.2" />
    </>
  ),
  java: (
    <>
      <path d="M4 11h13v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
      <path d="M17 12.5h1.2a2.3 2.3 0 0 1 0 4.5H17" />
      <path d="M8 3.5c0 1.5 1.5 1.5 1.5 3" />
      <path d="M12.5 3.5c0 1.5 1.5 1.5 1.5 3" />
      <path d="M4 21.5h13" />
    </>
  ),
  javascript: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M11.5 10v5.2c0 1-.6 1.6-1.6 1.6-.7 0-1.2-.3-1.5-.8" />
      <path d="M17.5 10.8c-.4-.5-1.1-.8-1.8-.8-1 0-1.7.6-1.7 1.4 0 .9.7 1.2 1.8 1.5 1.1.3 1.8.7 1.8 1.6 0 .9-.8 1.5-1.9 1.5-.8 0-1.5-.3-1.9-.9" />
    </>
  ),
  linux: (
    <>
      <path d="m4 17 6-6-6-6" />
      <path d="M12 19h8" />
    </>
  ),
  microsoft365: (
    <>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="1" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="1" />
    </>
  ),
  nextjs: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 16V8l6.5 8.5" />
      <path d="M15.5 8v4" />
    </>
  ),
  nodejs: (
    <>
      <path d="M12 2.5l8.5 5v9l-8.5 5-8.5-5v-9z" />
      <path d="M9.7 15.5v-7l4.6 7v-7" />
    </>
  ),
  oauth: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="M10.8 12.2 20 3" />
      <path d="m16 7 3 3" />
      <path d="m13.5 9.5 2 2" />
    </>
  ),
  postgresql: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
      <path d="M3 12a9 3 0 0 0 18 0" />
    </>
  ),
  python: (
    <>
      <path d="M8 8V6a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v3.5a2 2 0 0 1-2 2H9.5A2.5 2.5 0 0 0 7 14v2.5" />
      <path d="M16 16v2a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3v-3.5a2 2 0 0 1 2-2h3.5a2.5 2.5 0 0 0 2.5-2.5V7.5" />
      <path d="M10.5 6h.01" />
      <path d="M13.5 18h.01" />
    </>
  ),
  react: (
    <>
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="1.3" />
    </>
  ),
  rust: (
    <>
      <circle cx="12" cy="12" r="6" />
      <path d="M12 2.5v3" />
      <path d="M12 18.5v3" />
      <path d="M2.5 12h3" />
      <path d="M18.5 12h3" />
      <path d="m5.3 5.3 2.1 2.1" />
      <path d="m16.6 16.6 2.1 2.1" />
      <path d="m18.7 5.3-2.1 2.1" />
      <path d="m7.4 16.6-2.1 2.1" />
      <path d="M10.2 15V9h2.3a1.7 1.7 0 0 1 0 3.4h-2.3" />
      <path d="m12.6 12.4 1.4 2.6" />
    </>
  ),
  tailwind: (
    <>
      <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.61 7.15 14.5 6 12 6z" />
      <path d="M7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.39 16.85 9.5 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C10.61 13.15 9.5 12 7 12z" />
    </>
  ),
  typescript: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M7 10.5h5" />
      <path d="M9.5 10.5V17" />
      <path d="M17.5 10.8c-.4-.5-1.1-.8-1.8-.8-1 0-1.7.6-1.7 1.4 0 .9.7 1.2 1.8 1.5 1.1.3 1.8.7 1.8 1.6 0 .9-.8 1.5-1.9 1.5-.8 0-1.5-.3-1.9-.9" />
    </>
  ),
  vercel: <path d="M12 4l9 16H3z" />,
} as const;
