"use client";

import { SectionTitle } from "@/components/atoms/SectionTitle";
import { ProjectCard } from "@/sections/portfolio/ProjectCard";
import { useContent, useCopy } from "@/lib/i18n/LocaleProvider";

interface ProjectsProps {
  openId: string | null;
  setOpenId: (id: string | null) => void;
}

export function Projects({ openId, setOpenId }: ProjectsProps) {
  const copy = useCopy();
  const { projects } = useContent();

  return (
    <section id="projects" data-section-label="projects" className="py-[var(--gap-section)]">
      <SectionTitle kicker={copy.projects.kicker}>{copy.projects.title}</SectionTitle>
      <div className="space-y-5">
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            expanded={openId === p.id}
            onToggle={() => setOpenId(openId === p.id ? null : p.id)}
          />
        ))}
      </div>
    </section>
  );
}
