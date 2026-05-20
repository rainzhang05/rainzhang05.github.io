import { DSBlock } from "@/sections/design-system/DSBlock";
import { DSSubhead } from "@/sections/design-system/DSSubhead";
import { DS_ACCENTS, DS_DARK, DS_LIGHT } from "@/lib/data/design-system";

interface SwatchProps {
  hex: string;
  name: string;
  varName: string;
  role?: string;
  dark?: boolean;
}

function Swatch({ hex, name, varName, role, dark = false }: SwatchProps) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="aspect-[3/2] rounded-xl border border-[var(--border)] relative overflow-hidden"
        style={{ background: hex }}
      >
        {dark && hex === "#07090d" && (
          <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-xl" />
        )}
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm text-[var(--text)] font-medium">{name}</span>
        <span className="font-mono text-[10px] text-[var(--text-subtle)] uppercase tabular-nums">
          {hex}
        </span>
      </div>
      <div className="font-mono text-[10px] text-[var(--text-muted)]">{varName}</div>
      {role && <div className="text-[11px] text-[var(--text-subtle)]">{role}</div>}
    </div>
  );
}

export function ColorsSection() {
  return (
    <DSBlock
      id="colors"
      num="02"
      title="Colors"
      kicker="A cool, near-neutral palette with a single decisive accent. All accents share teal-family cool hues."
    >
      <div className="space-y-12">
        <div>
          <DSSubhead>Accent scale</DSSubhead>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-5">
            {DS_ACCENTS.map((a) => (
              <div key={a.key} className="space-y-2">
                <div className="rounded-xl overflow-hidden border border-[var(--border)] grid grid-cols-3">
                  <div className="aspect-square" style={{ background: a.soft }} />
                  <div className="aspect-square" style={{ background: a.base }} />
                  <div className="aspect-square" style={{ background: a.strong }} />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-medium text-sm">{a.name}</span>
                  <span className="font-mono text-[10px] text-[var(--text-subtle)]">{a.base}</span>
                </div>
                <div className="text-[11px] text-[var(--text-subtle)]">{a.role}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <DSSubhead>Light theme — surfaces &amp; text</DSSubhead>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
              {DS_LIGHT.map((c) => (
                <Swatch key={c.name} hex={c.hex} name={c.name} varName={c.var} />
              ))}
            </div>
          </div>
          <div>
            <DSSubhead>Dark theme — surfaces &amp; text</DSSubhead>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
              {DS_DARK.map((c) => (
                <Swatch key={c.name} hex={c.hex} name={c.name} varName={c.var} dark />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DSBlock>
  );
}
