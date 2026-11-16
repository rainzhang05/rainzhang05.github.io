import { Icon } from './Icon';

/**
 * A short confirmation at the foot of the viewport. Sits above the section
 * dock, which is the page's other fixed element.
 *
 * The live region is the outer element and is always in the page, empty until
 * there is something to say. A region that arrives already holding its text is
 * a new node rather than a change to one, and screen readers announce changes:
 * mounted with the message, it was often not read at all.
 *
 * That outer element also does the centring. It runs from gutter to gutter and
 * the toast sits in the middle of it, so the toast can be as wide as the
 * screen allows. Centred the usual way — `left: 50%` and a translate back — a
 * fixed box has only the half of the viewport to its right to shrink into, and
 * the Japanese confirmation wrapped onto two lines on a phone. It never takes
 * a pointer event, so the strip it spans does not cover what is under it.
 */
export function Toast({ message }: { message: string | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="toast-region pointer-events-none fixed inset-x-4 bottom-6 z-50 flex justify-center"
    >
      {message ? (
        <div className="toast toast-in inline-flex max-w-[440px] items-center gap-3 rounded-md bg-ink px-4 py-3 text-body-14 text-paper shadow-toast">
          <Icon name="check" size={18} />
          <span>{message}</span>
        </div>
      ) : null}
    </div>
  );
}
