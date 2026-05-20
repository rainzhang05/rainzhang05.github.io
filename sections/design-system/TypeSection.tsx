import { DSBlock } from "@/sections/design-system/DSBlock";
import { DS_TYPE } from "@/lib/data/design-system";

export function TypeSection() {
  return (
    <DSBlock
      id="type"
      num="03"
      title="Typography"
      kicker="Manrope for everything. JetBrains Mono for kickers, tags, and code. One typeface tells the story; the mono adds structure."
    >
      <div className="rounded-xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden bg-[var(--surface)]">
        {DS_TYPE.map((t) => (
          <div key={t.name} className="grid grid-cols-12 gap-6 px-6 py-6 items-baseline">
            <div className="col-span-12 md:col-span-3">
              <div className="font-medium">{t.name}</div>
              <div className="font-mono text-[11px] text-[var(--text-subtle)] mt-1">{t.size}</div>
              <div className="font-mono text-[10px] text-[var(--text-subtle)]">
                line {t.line} · track {t.track}
              </div>
              <div className="font-mono text-[10px] text-[var(--text-subtle)]">
                weight {t.weight}
              </div>
            </div>
            <div className={`col-span-12 md:col-span-9 text-[var(--text)] ${t.className}`}>
              {t.example}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)] mb-3">
            Manrope · Sans
          </div>
          <div className="text-4xl mb-3" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Aa Bb Cc
          </div>
          <div
            className="text-sm text-[var(--text-muted)] leading-relaxed"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            The quick brown fox jumps over 13 lazy dogs. Soft geometric humanist sans, optimized
            for UI density and headlines alike.
          </div>
        </div>
        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)] mb-3">
            JetBrains Mono · Mono
          </div>
          <div className="text-4xl mb-3 font-mono">01 — Aa</div>
          <div className="text-sm text-[var(--text-muted)] leading-relaxed font-mono">
            {`const stack = ["Python", "Rust", "TypeScript"];`}
          </div>
        </div>
      </div>
    </DSBlock>
  );
}
