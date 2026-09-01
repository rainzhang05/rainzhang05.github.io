import { Fragment } from "react";
import type { AboutParagraph } from "@/lib/types";

interface RichTextProps {
  paragraph: AboutParagraph;
}

/**
 * Renders a paragraph made of plain runs and emphasized runs. Keeping prose as
 * data (rather than JSX) is what lets the same component serve both locales —
 * Japanese puts the emphasis in a different place than English.
 */
export function RichText({ paragraph }: RichTextProps) {
  return (
    <>
      {paragraph.parts.map((part, i) => (
        <Fragment key={i}>
          {typeof part === "string" ? (
            part
          ) : (
            <span className="text-[var(--text)]">{part.strong}</span>
          )}
        </Fragment>
      ))}
    </>
  );
}
