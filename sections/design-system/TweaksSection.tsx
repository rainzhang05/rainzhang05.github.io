import { DSBlock } from "@/sections/design-system/DSBlock";
import { DS_TWEAKS } from "@/lib/data/design-system";

export function TweaksSection() {
  return (
    <DSBlock
      id="tweaks"
      num="06"
      title="Tweaks"
      kicker="Eight live controls let the design adapt to context. All persist between sessions and update tokens at runtime."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DS_TWEAKS.map((t) => (
          <div
            key={t.name}
            className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-sm">{t.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>
    </DSBlock>
  );
}
