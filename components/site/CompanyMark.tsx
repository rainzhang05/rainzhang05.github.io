import type { CompanyMark as Mark } from '@/lib/types';

/** Every mark reads at the same cap height, whatever shape the file is. */
const HEIGHT = 18;

/**
 * Company marks stay in their original colours, at a shared height rather
 * than their own: one is a square, one a two-line wordmark four times as wide,
 * one a filled tile, and sitting in front of a title they have to weigh the
 * same. A mark may carry a `scale` when equal ink height still does not read
 * as equal.
 *
 * Plain <img> with explicit dimensions: the files are small, and the SVG among
 * them would otherwise mean turning on SVG handling in next/image. Sized in
 * the markup and in style, so a mark cannot shift layout as it loads.
 */
export function CompanyMark({ mark, alt }: { mark?: Mark; alt: string }) {
  if (!mark) return null;

  const height = Math.round(HEIGHT * (mark.scale ?? 1));
  const width = Math.round((mark.width / mark.height) * height);

  return (
    <img
      src={mark.src}
      alt={alt}
      width={width}
      height={height}
      draggable={false}
      className="no-copy block shrink-0"
      style={{ width, height }}
    />
  );
}
