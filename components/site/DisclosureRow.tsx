'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Icon } from '@/components/ui/Icon';
import { panelMotion, panelTokens, supportsLinearEasing, unseenCloseMs } from '@/lib/panelMotion';

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
  /** A status beside the title, outside the heading so it is not part of its name. */
  badge?: ReactNode;
  /** Pills and the quiet link: below the summary, always visible. */
  footer?: ReactNode;
  labels: { expand: string; collapse: string };
  /** Panel content. Always rendered, so opening is instant. */
  children: ReactNode;
}

const useBeforePaint = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** A panel's measured motion; `easing` is null where the browser has no linear(). */
interface MeasuredMotion {
  durationMs: number;
  easing: string | null;
}

/**
 * One row of the site's only interactive pattern. Experience entries and
 * projects are the same component, so they open, close and read alike.
 *
 * The row opens from one control and nothing else: a chevron, last in the row
 * and on the content's left edge, right where the panel unfolds — rows have no
 * rule between them, so it is also what marks where a row ends. It is quiet
 * at rest, in --ink-3 with no fill, and turns over and darkens while its row
 * is open. The title, summary and the rest of the row are plain text, so they
 * can be selected like any other prose on the page.
 *
 * The chevron carries aria-expanded and aria-controls and is named by the
 * row's title, so a screen reader hears "Travel Advisor, button, collapsed";
 * its tooltip says what pressing it does. An experience row leads with its
 * company mark, which is what tells the two lists apart at a glance. The
 * panel is in the DOM at all times and animates height and opacity, the same
 * in both directions — see .disclosure-panel in globals.css.
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
  badge,
  footer,
  labels,
  children,
}: DisclosureRowProps) {
  const Heading = headingLevel;
  const panelId = 'panel-' + id;
  const buttonId = 'button-' + id;

  /**
   * The panel's own content height decides how long it takes to open and the
   * easing that gets it there, so a tall row and a short one move at the same
   * speed at every moment, not just on average (see lib/panelMotion.ts). A
   * ResizeObserver keeps the figure right through reflow and late-loading
   * images.
   *
   * `scrollHeight` and not `getBoundingClientRect()`: a shut row is a grid
   * track at 0fr with its overflow hidden, and both the rect and offsetHeight
   * of the content inside it read 0 there, while scrollHeight reports its real
   * height in either state. The rect happens to be measured before the row
   * collapses today, so this is not a bug being fixed — it is the difference
   * between a figure that is right and one that is right by timing. Measure
   * zero and there is no motion to compute, so the panel would fall back to
   * --duration-base and snap open far faster than its neighbours.
   */
  const contentRef = useRef<HTMLDivElement>(null);
  const [motion, setMotion] = useState<MeasuredMotion | null>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const linear = supportsLinearEasing();

    const measure = () => {
      const tokens = panelTokens(el);
      if (tokens === null) return;
      const computed = panelMotion(el.scrollHeight, tokens.speed, tokens.settleMs);
      if (computed === null) return;
      // Without linear() the duration still follows the distance, under --ease-panel.
      const next: MeasuredMotion = {
        durationMs: computed.durationMs,
        easing: linear ? computed.easing : null,
      };
      setMotion((current) =>
        current?.durationMs === next.durationMs && current.easing === next.easing ? current : next
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /**
   * A close starts where its bottom edge first comes into view. A tall panel
   * shut from near the top of the screen has that edge far below the fold, and
   * nothing it moves is visible until it rises past it — so the transition is
   * wound forward past that part before the first frame is painted (see
   * unseenCloseMs). What is left is the end of the motion every row ends on.
   *
   * Only from fully open, and only on the shared curve: an opening interrupted
   * half-way reverses over a shortened, rescaled transition, and the fallback
   * easing is a different curve, so neither can be read off panelTimeAt.
   */
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(open);

  useBeforePaint(() => {
    const closing = wasOpen.current && !open;
    wasOpen.current = open;
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!closing || !panel || !content || !motion?.easing) return;
    if (typeof panel.getAnimations !== 'function') return;

    const tokens = panelTokens(content);
    if (tokens === null) return;
    const height = content.scrollHeight;
    // Reading layout here starts the transitions, still at their first frame.
    const { top, height: shown } = panel.getBoundingClientRect();
    if (Math.abs(shown - height) > 1) return;

    const viewport = document.documentElement.clientHeight;
    const skipMs = unseenCloseMs(height, top, viewport, tokens.speed, tokens.settleMs);
    if (skipMs <= 0) return;
    for (const transition of panel.getAnimations()) {
      // The fade keeps its own time; the height and the visibility delay move on together.
      if ((transition as CSSTransition).transitionProperty === 'opacity') continue;
      transition.currentTime = skipMs;
    }
  }, [open, motion]);

  return (
    <li id={'row-' + id} className="flex scroll-mt-6 flex-wrap items-start gap-x-8 gap-y-2">
      <span className="tabular w-full flex-none pt-0.5 text-body-14 text-ink-3 sm:w-label">
        {meta}
      </span>

      <div className="min-w-0 flex-1 basis-[420px]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <Heading className="m-0 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-heading font-medium text-ink">
            {leading}
            {title}
          </Heading>
          {badge}
        </div>
        {subtitle ? <p className="mt-0.5 text-body-15 text-ink-2">{subtitle}</p> : null}
        <p className="mt-2.5 max-w-measure text-body-15 text-ink-2">{summary}</p>

        {footer ? (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">{footer}</div>
        ) : null}

        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={title}
          title={open ? labels.collapse : labels.expand}
          onClick={() => onToggle(id)}
          className={
            'no-copy -ml-2 mt-3 flex h-8 w-8 items-center justify-center rounded-pill transition-colors duration-fast ease-out hover:bg-surface hover:text-ink ' +
            (open ? 'text-ink' : 'text-ink-3')
          }
        >
          <span
            className={
              'inline-flex transition-transform duration-panel-fade ease-out' +
              (open ? ' rotate-180' : '')
            }
          >
            <Icon name="chevron-down" size={18} />
          </span>
        </button>

        <div
          ref={panelRef}
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          data-open={open}
          className="disclosure-panel"
          style={
            motion === null
              ? undefined
              : ({
                  '--panel-duration': motion.durationMs + 'ms',
                  '--panel-ease': motion.easing ?? undefined,
                } as CSSProperties)
          }
        >
          <div className="min-h-0 overflow-hidden">
            <div ref={contentRef} className="disclosure-content grid gap-5 pt-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * Label + content block, used inside every open panel. The label is a quiet
 * subhead in sentence case, not an eyebrow: with no rules on the page, an
 * uppercase label inside a panel reads as the start of another section.
 */
export function PanelBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-body-14 font-medium text-ink">{label}</div>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
