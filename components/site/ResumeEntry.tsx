import type { ResumeEntry as Entry, ResumePart } from '@/lib/types';

/** A middle-dot separated line. Only the parts carrying an href are links. */
export function MetaLine({ parts, className }: { parts: ResumePart[]; className: string }) {
  return (
    <p className={'m-0 min-w-0 ' + className}>
      {parts.map((part, index) => (
        <span key={part.text}>
          {index > 0 ? <span aria-hidden="true"> · </span> : null}
          {part.href ? (
            <a
              href={part.href}
              target={part.href.startsWith('http') ? '_blank' : undefined}
              rel={part.href.startsWith('http') ? 'noreferrer' : undefined}
            >
              {part.text}
            </a>
          ) : (
            part.text
          )}
        </span>
      ))}
    </p>
  );
}

/**
 * One role or one project: the title, its meta line, the dates in the right
 * margin, and the bullets.
 *
 * The two kinds of meta line are set differently in the resume and stay that
 * way here — an organisation reads as prose under the role, a stack reads as
 * the quieter caption a date sits beside. Bullets borrow the list treatment an
 * experience panel already uses on the home page, so the two documents read in
 * one voice.
 */
export function ResumeEntry({ entry, meta }: { entry: Entry; meta: 'org' | 'stack' }) {
  return (
    <li className="mt-7 first:mt-5">
      <h3 className="m-0 text-heading font-medium">{entry.title}</h3>

      <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5">
        <MetaLine
          parts={entry.meta}
          className={meta === 'org' ? 'text-body-15 text-ink-2' : 'text-caption text-ink-3'}
        />
        <span className="tabular flex-none text-caption text-ink-3">{entry.dates}</span>
      </div>

      <ul className="m-0 mt-2.5 grid list-disc gap-1.5 pl-[18px] text-body-15 text-ink-2">
        {entry.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </li>
  );
}
