'use client';

import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';

interface DisclosureRowProps {
  id: string;
  /** Left label column: the dates. */
  meta: string;
  title: string;
  /** Organisation and place, under the title. */
  subtitle?: string;
  summary: string;
  open: boolean;
  onToggle: (id: string) => void;
  /** h3 in a section, h4 inside a sub-list. */
  headingLevel?: 'h3' | 'h4';
  /** Company mark, shown right of the title. */
  aside?: ReactNode;
  /** Pills and the quiet link: below the summary, always visible. */
  footer?: ReactNode;
  labels: { expand: string; collapse: string };
  /** Panel content. Always rendered, so opening is instant. */
  children: ReactNode;
}

/**
 * One row of the site's only interactive pattern. Experience entries and
 * projects are the same component, so they open, close and read alike.
 *
 * The whole header is a click target; the title is the real button, and it
 * carries aria-expanded and aria-controls, so keyboard and screen-reader
 * users get the same affordance. The panel is in the DOM at all times and
 * animates height and opacity from the motion tokens
 * (--duration-base, --ease-out).
 */
export function DisclosureRow({
  id,
  meta,
  title,
  subtitle,
  summary,
  open,
  onToggle,
  headingLevel = 'h3',
  aside,
  footer,
  labels,
  children,
}: DisclosureRowProps) {
  const Heading = headingLevel;
  const panelId = 'panel-' + id;
  const buttonId = 'button-' + id;

  return (
    <li
      id={'row-' + id}
      className="flex scroll-mt-6 flex-wrap items-start gap-x-8 gap-y-2 border-b border-rule py-5"
    >
      <span className="tabular w-full flex-none pt-0.5 text-body-14 text-ink-3 sm:w-label">
        {meta}
      </span>

      <div className="min-w-0 flex-1 basis-[420px]">
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
        <div
          className="group flex cursor-pointer items-start gap-4 text-ink-3 transition-colors duration-fast ease-out hover:text-ink"
          onClick={() => onToggle(id)}
        >
          <div className="min-w-0 flex-1">
            <Heading className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                title={open ? labels.collapse : labels.expand}
                className="m-0 block rounded-sm p-0 text-left text-heading font-medium text-ink"
              >
                {title}
              </button>
            </Heading>
            {subtitle ? <p className="mt-0.5 text-body-15 text-ink-2">{subtitle}</p> : null}
            <p className="mt-2.5 max-w-measure text-body-15 text-ink-2">{summary}</p>
          </div>
          {aside}
          <span aria-hidden="true" className="mt-1 inline-flex">
            <Icon name={open ? 'minus' : 'plus'} size={18} />
          </span>
        </div>

        {footer ? (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">{footer}</div>
        ) : null}

        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className={
            'grid transition-[grid-template-rows,opacity,visibility] duration-base ease-out ' +
            (open
              ? 'visible grid-rows-[1fr] opacity-100'
              : 'invisible grid-rows-[0fr] opacity-0 delay-[var(--duration-base)]')
          }
        >
          <div className="min-h-0 overflow-hidden">
            <div className="grid gap-5 pt-6">{children}</div>
          </div>
        </div>
      </div>
    </li>
  );
}

/** Eyebrow + content block, used inside every open panel. */
export function PanelBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-label font-medium uppercase text-ink-3">{label}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
