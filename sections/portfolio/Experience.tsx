"use client";

import { Card } from "@/components/atoms/Card";
import { Icon } from "@/components/atoms/Icon";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { Tag } from "@/components/atoms/Tag";
import { TechTag } from "@/components/atoms/TechTag";
import { useContent, useCopy } from "@/lib/i18n/LocaleProvider";

interface ExperienceProps {
  onOpenProject?: (id: string) => void;
}

export function Experience({ onOpenProject }: ExperienceProps) {
  const copy = useCopy();
  const { experiences, projects } = useContent();

  return (
    <section id="experience" data-section-label="experience" className="py-[var(--gap-section)]">
      <SectionTitle kicker={copy.experience.kicker}>{copy.experience.title}</SectionTitle>

      <div className="space-y-8">
        {experiences.map((exp) => {
          const hasRelated = exp.related.length > 0;
          return (
            <Card key={exp.id} className="p-[var(--gap-card)]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-[var(--border)]">
                <div className="flex items-center gap-[var(--gap-card)] min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={exp.logo}
                    alt={exp.logoAlt}
                    loading="lazy"
                    decoding="async"
                    className={`${exp.logoHeight ?? "h-6"} w-auto shrink-0`}
                  />
                  <div className="min-w-0">
                    <h3 className="text-xl tracking-[var(--track-tight)] font-medium text-[var(--text)] leading-tight">
                      {exp.role}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1.5">{exp.org}</p>
                    {exp.dept && (
                      <p className="text-xs text-[var(--text-subtle)] mt-1">{exp.dept}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 md:justify-end shrink-0">
                  {exp.tagType && (
                    <Tag mono tone="accent">
                      {copy.tagLabels[exp.tagType]}
                    </Tag>
                  )}
                  <Tag mono>{exp.period}</Tag>
                  <Tag mono>{exp.location}</Tag>
                </div>
              </div>

              <div className={hasRelated ? "grid md:grid-cols-[1fr_280px] gap-8 lg:gap-10" : ""}>
                <div className="space-y-7 min-w-0">
                  <div>
                    <MicroLabel className="mb-2.5">{copy.experience.scope}</MicroLabel>
                    <p className="text-[var(--text)] leading-relaxed text-[15px]">{exp.summary}</p>
                  </div>
                  <div>
                    <MicroLabel className="mb-3">{copy.experience.outcomes}</MicroLabel>
                    <ul className="space-y-3">
                      {exp.outcomes.map((o, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-[var(--text-muted)] leading-relaxed text-[15px]"
                        >
                          <span className="mt-[10px] w-1 h-1 rounded-full bg-[var(--accent)] shrink-0" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <MicroLabel className="mb-3">{copy.experience.technologies}</MicroLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.stack.map((s) => (
                        <TechTag key={s} name={s} />
                      ))}
                    </div>
                  </div>
                </div>

                {hasRelated && (
                  <div className="md:border-l md:border-[var(--border)] md:pl-8">
                    <MicroLabel className="mb-3">{copy.experience.related}</MicroLabel>
                    <div className="flex flex-col gap-2">
                      {exp.related.map((id) => {
                        const p = projects.find((x) => x.id === id);
                        if (!p) return null;
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => onOpenProject?.(id)}
                            className="group text-left p-3 rounded-[calc(var(--r-sm)*1px)] border border-[var(--border)] hover:border-[var(--accent-strong)] hover:bg-[var(--surface-2)] bg-transparent transition-all"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium leading-tight">{p.title}</span>
                              <Icon
                                name="arrow-up-right"
                                size={13}
                                className="text-[var(--text-subtle)] group-hover:text-[var(--accent)] transition-colors shrink-0"
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
