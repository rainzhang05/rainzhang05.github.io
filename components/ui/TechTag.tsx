import { Icon } from '@/components/ui/Icon';
import { techIcon, type TechName } from '@/lib/tech';

/**
 * Pill with the technology's line glyph, drawn in the colour of its name. The
 * glyph is an inline SVG from the same set and weight as the rest of the
 * icons, so it needs no request, no sizing attributes to avoid layout shift,
 * and no help on the dark ground. A name with no glyph is a plain pill.
 */
export function TechTag({ name, size = 'sm' }: { name: TechName; size?: 'sm' | 'md' }) {
  const glyph = techIcon(name);

  return (
    <span
      className={
        'no-copy inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border border-rule text-ink-2 ' +
        (size === 'sm' ? 'h-6 px-[9px] text-[12.5px]' : 'h-7 px-[11px] text-caption')
      }
    >
      {glyph ? <Icon name={glyph} size={size === 'sm' ? 14 : 16} /> : null}
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
