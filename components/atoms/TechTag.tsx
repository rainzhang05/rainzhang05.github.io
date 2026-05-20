import { TECH_ICONS } from "@/lib/data/tech-icons";

interface TechTagProps {
  name: string;
  className?: string;
}

export function TechTag({ name, className = "" }: TechTagProps) {
  const icon = TECH_ICONS[name];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[11px] px-2 py-[3px] rounded-[calc(var(--r-sm)*1px)] bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)] ${className}`}
    >
      {icon && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={icon} alt="" className="w-3 h-3 object-contain" aria-hidden="true" />
      )}
      {name}
    </span>
  );
}
