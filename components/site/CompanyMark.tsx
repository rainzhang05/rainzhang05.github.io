import type { CompanyMark as Mark } from '@/lib/types';

/** Every mark reads at the same cap height, whatever shape the file is. */
const HEIGHT = 18;

/**
 * Company marks stay in their original colours, at a shared height rather
 * than their own: one is a square, the other a wordmark four times as wide,
 * and sitting in front of a title they have to weigh the same.
 *
 * Plain <img> with explicit dimensions: both files are small SVGs, so this
 * avoids turning on SVG handling in next/image and cannot shift layout.
 */
export function CompanyMark({ mark, alt }: { mark?: Mark; alt: string }) {
  if (!mark) return null;

  const width = Math.round((mark.width / mark.height) * HEIGHT);

  return (
    <img
      src={mark.src}
      alt={alt}
      width={width}
      height={HEIGHT}
      draggable={false}
      className="no-copy block shrink-0"
      style={{ width, height: HEIGHT }}
    />
  );
}
