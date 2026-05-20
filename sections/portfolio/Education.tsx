import { Card } from "@/components/atoms/Card";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { EDUCATION } from "@/lib/data/education";

export function Education() {
  return (
    <section id="education" data-section-label="education" className="py-[var(--gap-section)]">
      <SectionTitle kicker="Where I've studied.">Education</SectionTitle>
      <div className="grid md:grid-cols-2 gap-5">
        {EDUCATION.map((e) => (
          <Card key={e.school} className="p-[var(--gap-card)]" interactive>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="min-w-0">
                <h3 className="text-lg tracking-tight font-medium text-[var(--text)]">
                  {e.school}
                </h3>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">{e.location}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono text-[11px] text-[var(--text-muted)]">{e.period}</div>
                {e.expected && (
                  <div className="font-mono text-[10px] text-[var(--text-subtle)] mt-0.5">
                    {e.expected}
                  </div>
                )}
              </div>
            </div>
            <p className="text-[var(--text)] mb-4 text-[15px]">{e.degree}</p>
            <ul className="space-y-2">
              {e.notes.map((n) => (
                <li key={n} className="flex gap-2.5 text-sm text-[var(--text-muted)]">
                  <span className="mt-[7px] w-1 h-1 rounded-full bg-[var(--accent)] shrink-0" />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  );
}
