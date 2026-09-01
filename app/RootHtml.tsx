import type { ReactNode } from "react";
import { ThemeScript } from "@/components/theme/ThemeScript";
import "./globals.css";

interface RootHtmlProps {
  /** Value for the `lang` attribute; also the hook every ja typography rule keys off. */
  lang: string;
  /** Space-separated next/font variable classes for this locale. */
  fontClassName: string;
  children: ReactNode;
}

/**
 * The document shell. Each locale has its own root layout (so `<html lang>` is
 * correct in the server-rendered HTML) and both render this component, which
 * keeps the font wiring and FOUC-prevention script in one place.
 */
export function RootHtml({ lang, fontClassName, children }: RootHtmlProps) {
  return (
    <html lang={lang} className={fontClassName} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
