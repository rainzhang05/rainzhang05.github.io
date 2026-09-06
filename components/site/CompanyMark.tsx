import type { CompanyMark as Mark } from '@/lib/types';

/**
 * Company marks stay in their original colours at their own aspect ratio.
 * Plain <img> with explicit dimensions: both files are small SVGs, so this
 * avoids turning on SVG handling in next/image and cannot shift layout.
 */
export function CompanyMark({ mark, alt }: { mark?: Mark; alt: string }) {
  if (!mark) return null;

  return (
    <img
      src={mark.src}
      alt={alt}
      width={mark.width}
      height={mark.height}
      className="mt-0.5 block shrink-0"
      style={{ width: mark.width, height: mark.height }}
    />
  );
}
