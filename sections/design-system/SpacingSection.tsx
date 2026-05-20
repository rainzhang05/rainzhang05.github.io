import { DSBlock } from "@/sections/design-system/DSBlock";
import { DSSubhead } from "@/sections/design-system/DSSubhead";
import { DS_DENSITY, DS_RADII, DS_SPACING } from "@/lib/data/design-system";

export function SpacingSection() {
  return (
    <DSBlock
      id="spacing"
      num="04"
      title="Spacing & Radii"
      kicker="A 4px base scale, deployed via Tailwind. Comfy density doubles airiness around sections; compact shaves ~30% off."
    >
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10">
        <div>
          <DSSubhead>Spacing scale (base 4)</DSSubhead>
          <div className="mt-5 space-y-2.5">
            {DS_SPACING.map((s) => (
              <div key={s.token} className="flex items-center gap-4 text-sm">
                <span className="w-28 font-mono text-[11px] text-[var(--text-muted)]">
                  {s.token}
                </span>
                <span className="w-12 font-mono text-[11px] text-[var(--text-subtle)] tabular-nums">
                  {s.px}px
                </span>
                <span
                  className="block h-3 bg-[var(--accent)] rounded-sm"
                  style={{ width: `${s.px * 1.5}px` }}
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <DSSubhead>Corner radii</DSSubhead>
          <div className="mt-5 space-y-4">
            {DS_RADII.map((r) => (
              <div
                key={r.token}
                className="grid grid-cols-[100px_1fr_1fr] gap-4 items-center"
              >
                <span className="font-mono text-[11px] text-[var(--text-muted)]">{r.token}</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-12 h-12 bg-[var(--surface-2)] border border-[var(--border)]"
                    style={{ borderRadius: r.soft }}
                  />
                  <div className="font-mono text-[10px] text-[var(--text-subtle)]">
                    soft · {r.soft}px
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-12 h-12 bg-[var(--surface-2)] border border-[var(--border)]"
                    style={{ borderRadius: r.sharp }}
                  />
                  <div className="font-mono text-[10px] text-[var(--text-subtle)]">
                    sharp · {r.sharp}px
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <DSSubhead>Density presets</DSSubhead>
        <div className="grid sm:grid-cols-2 gap-4 mt-5">
          {DS_DENSITY.map((d) => (
            <div
              key={d.name}
              className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
            >
              <div className="flex items-baseline justify-between">
                <div className="font-medium">{d.name}</div>
                <div className="font-mono text-[10px] text-[var(--text-subtle)]">
                  card {d.card} · section {d.section}
                </div>
              </div>
              <p className="text-sm text-[var(--text-muted)] mt-2">{d.role}</p>
            </div>
          ))}
        </div>
      </div>
    </DSBlock>
  );
}
