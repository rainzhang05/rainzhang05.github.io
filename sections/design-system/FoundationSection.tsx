import { DSBlock } from "@/sections/design-system/DSBlock";
import { DS_FOUNDATIONS } from "@/lib/data/design-system";

export function FoundationSection() {
  return (
    <DSBlock
      id="foundations"
      num="01"
      title="Foundations"
      kicker="Design principles that govern every decision."
    >
      <div className="grid md:grid-cols-3 gap-5">
        {DS_FOUNDATIONS.map((p, i) => (
          <div
            key={p.t}
            className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
          >
            <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)] mb-3 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h4 className="font-medium text-lg mb-2 tracking-tight">{p.t}</h4>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{p.d}</p>
          </div>
        ))}
      </div>
    </DSBlock>
  );
}
