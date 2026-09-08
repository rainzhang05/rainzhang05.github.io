'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { panelDurationMs, panelSpeed } from '@/lib/panelMotion';

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
  /** Company mark, in front of the title. Experience rows have one; projects do not. */
  leading?: ReactNode;
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
 * users get the same affordance. An experience row leads with its company
 * mark, which is what tells the two lists apart at a glance. The panel is in
 * the DOM at all times and animates height and opacity over --duration-base in
 * both directions — see .disclosure-panel in globals.css.
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
  leading,
  footer,
  labels,
  children,
}: DisclosureRowProps) {
  const Heading = headingLevel;
  const panelId = 'panel-' + id;
  const buttonId = 'button-' + id;

  /**
   * The panel's own content height decides how long it takes to open, so a
   * tall row and a short one travel at the same speed. A ResizeObserver keeps
   * the figure right through reflow and late-loading images.
   *
   * `scrollHeight` and not `getBoundingClientRect()`: a shut row is a grid
   * track at 0fr with its overflow hidden, and both the rect and offsetHeight
   * of the content inside it read 0 there, while scrollHeight reports its real
   * height in either state. The rect happens to be measured before the row
   * collapses today, so this is not a bug being fixed — it is the difference
   * between a figure that is right and one that is right by timing. Measure
   * zero and panelDurationMs floors at MIN_PANEL_MS, which for the tallest
   * panel here would be more than twice the shared speed.
   */
  const contentRef = useRef<HTMLDivElement>(null);
  const [durationMs, setDurationMs] = useState<number | null>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const measure = () => {
      const speed = panelSpeed(el);
      if (speed === null) return;
      const next = panelDurationMs(el.scrollHeight, speed);
      setDurationMs((current) => (current === next ? current : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
          className="no-copy group flex cursor-pointer items-start gap-4 text-ink-3 transition-colors duration-fast ease-out hover:text-ink"
          onClick={() => onToggle(id)}
        >
          <div className="min-w-0 flex-1">
            <Heading className="m-0 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              {leading}
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
          data-open={open}
          className="disclosure-panel"
          style={
            durationMs === null
              ? undefined
              : ({ '--panel-duration': durationMs + 'ms' } as CSSProperties)
          }
        >
          <div className="min-h-0 overflow-hidden">
            <div ref={contentRef} className="grid gap-5 pt-6">
              {children}
            </div>
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
