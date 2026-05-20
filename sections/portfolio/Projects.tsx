"use client";

import { SectionTitle } from "@/components/atoms/SectionTitle";
import { ProjectCard } from "@/sections/portfolio/ProjectCard";
import { PROJECTS } from "@/lib/data/projects";

interface ProjectsProps {
  openId: string | null;
  setOpenId: (id: string | null) => void;
}

export function Projects({ openId, setOpenId }: ProjectsProps) {
  return (
    <section id="projects" data-section-label="projects" className="py-[var(--gap-section)]">
      <SectionTitle kicker="Selected work — production systems and experiments. Click any card to expand.">
        Selected work
      </SectionTitle>
      <div className="space-y-5">
        {PROJECTS.map((p) => (
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
