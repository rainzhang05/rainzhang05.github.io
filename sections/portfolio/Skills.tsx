import { Card } from "@/components/atoms/Card";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { SKILL_GROUPS } from "@/lib/data/skills";
import { TECH_ICONS } from "@/lib/data/tech-icons";

export function Skills() {
  return (
    <section id="skills" data-section-label="skills" className="py-[var(--gap-section)]">
      <SectionTitle kicker="Languages, frameworks, and tools I reach for.">Stack</SectionTitle>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SKILL_GROUPS.map((g) => (
          <Card key={g.label} className="p-5">
            <MicroLabel className="text-[11px] text-[var(--text-muted)] mb-5">
              {g.label}
            </MicroLabel>
            <ul className="space-y-1">
              {g.items.map((it) => {
                const icon = TECH_ICONS[it];
                return (
                  <li key={it} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2.5 text-[15px]">
                      {icon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={icon}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          width={16}
                          height={16}
                          className="w-4 h-4 object-contain"
                          aria-hidden="true"
                        />
                      ) : (
                        <span className="w-4 h-4 rounded-[calc(var(--r-sm)*1px)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center font-mono text-[8px] text-[var(--text-subtle)]">
                          ·
                        </span>
                      )}
                      <span className="text-[var(--text)]">{it}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  );
}
