import { techIcon, type TechName } from '@/lib/tech';

/**
 * Pill with the technology's own mark, in its original colours.
 * Marks are small (12-14px) and several are SVG, so they stay plain <img>
 * with explicit dimensions — sized, lazy, and no layout shift.
 */
export function TechTag({ name, size = 'sm' }: { name: TechName; size?: 'sm' | 'md' }) {
  const src = techIcon(name);
  const px = size === 'sm' ? 12 : 14;

  return (
    <span
      className={
        'no-copy inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border border-rule text-ink-2 ' +
        (size === 'sm' ? 'h-6 px-[9px] text-[12.5px]' : 'h-7 px-[11px] text-caption')
      }
    >
      {src ? (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          width={px}
          height={px}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="no-copy block object-contain"
          style={{ width: px, height: px }}
        />
      ) : null}
      {name}
    </span>
  );
}

export function TechTagList({ items, size }: { items: readonly TechName[]; size?: 'sm' | 'md' }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((name) => (
        <TechTag key={name} name={name} size={size} />
      ))}
    </div>
  );
}
