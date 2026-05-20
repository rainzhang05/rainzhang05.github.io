interface ProjectThumbnailProps {
  image?: string;
  alt?: string;
  /** Unused — preserved for parity with prototype's design-system page. */
  variant?: number;
  /** Unused — preserved for parity with prototype's design-system page. */
  label?: string;
}

export function ProjectThumbnail({ image, alt = "" }: ProjectThumbnailProps) {
  return (
    <div className="relative overflow-hidden rounded-[calc(var(--r-md)*1px)] border border-[var(--border)] aspect-[16/9] bg-[var(--surface-2)]">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
}
