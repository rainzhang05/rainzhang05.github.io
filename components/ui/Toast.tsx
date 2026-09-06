import { Icon } from './Icon';

/** The only element ever fixed to the viewport, and only while it shows. */
export function Toast({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 inline-flex max-w-[440px] -translate-x-1/2 items-center gap-3 rounded-md bg-ink px-4 py-3 text-body-14 text-paper shadow-toast"
    >
      <Icon name="check" size={18} />
      <span>{message}</span>
    </div>
  );
}
