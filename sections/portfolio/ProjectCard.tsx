"use client";

import type { MouseEvent, ReactNode } from "react";
import { Card } from "@/components/atoms/Card";
import { Icon } from "@/components/atoms/Icon";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { ProjectThumbnail } from "@/components/atoms/ProjectThumbnail";
import { Tag } from "@/components/atoms/Tag";
import { TechTag } from "@/components/atoms/TechTag";
import type { Project } from "@/lib/types";

interface ProjectLinkButtonProps {
  href: string;
  children: ReactNode;
}

function ProjectLinkButton({ href, children }: ProjectLinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e: MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
      className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-[calc(var(--r-sm)*1px)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
    >
      {children}
    </a>
  );
}

interface ProjectCardProps {
  project: Project;
  expanded: boolean;
  onToggle: () => void;
}

export function ProjectCard({ project, expanded, onToggle }: ProjectCardProps) {
  const {
    id,
    title,
    summary,
    period,
    role,
    tools,
    stack,
    links,
    impact,
    featured,
    cryptoNote,
    image,
    hideThumbnail,
  } = project;

  return (
    <Card
      id={`project-${id}`}
      className={`group overflow-hidden transition-all duration-300 ease-out ${
        expanded ? "ring-1 ring-[var(--accent)] border-[var(--accent-strong)]" : ""
      }`}
      interactive={!expanded}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-[var(--gap-card)] cursor-pointer"
        aria-expanded={expanded}
      >
        <div className={hideThumbnail ? "" : "grid md:grid-cols-[1.6fr_1fr] gap-6 items-start"}>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)]">
                {period}
              </span>
              {featured && (
                <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--accent-strong)]">
                  · featured
                </span>
              )}
            </div>
            <h3 className="text-[clamp(1.35rem,2.2vw,1.6rem)] tracking-[-0.015em] font-medium leading-[1.15] text-[var(--text)]">
              {title}
            </h3>
            <p className="mt-2.5 text-[var(--text-muted)] leading-relaxed">{summary}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {stack.map((s) => (
                <TechTag key={s} name={s} />
              ))}
            </div>
          </div>
          {!hideThumbnail && (
            <div className="relative">
              <ProjectThumbnail image={image} alt={`${title} preview`} />
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-[var(--border)]">
          <div className="flex items-center gap-3 text-sm text-[var(--text-muted)] min-w-0">
            <span className="truncate">{role}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {links?.live && (
              <ProjectLinkButton href={links.live}>
                Live <Icon name="external" size={12} />
              </ProjectLinkButton>
            )}
            {links?.github && (
              <ProjectLinkButton href={links.github}>
                <Icon name="github" size={12} /> Code
              </ProjectLinkButton>
            )}
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-[calc(var(--r-sm)*1px)] bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]">
              {expanded ? "Collapse" : "Read more"}
              <Icon
                name={expanded ? "arrow-down" : "arrow-right"}
                size={12}
                className={`transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </span>
          </div>
        </div>
      </button>

      <div
        className="grid transition-all duration-500 ease-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-[var(--gap-card)] pb-[var(--gap-card)] pt-0">
            <div className="border-t border-[var(--border)] pt-6">
              <div className="grid md:grid-cols-2 gap-3 mb-6">
                <div className="text-sm">
                  <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)] mr-2">
                    Role
                  </span>
                  <span className="text-[var(--text)]">{role}</span>
                </div>
                <div className="text-sm">
                  <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)] mr-2">
                    Tools
                  </span>
                  <span className="text-[var(--text)]">{tools}</span>
                </div>
              </div>

              <MicroLabel className="mb-4">Contributions &amp; impact</MicroLabel>
              <div className="grid md:grid-cols-3 gap-3">
                {impact.map((im, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-[calc(var(--r-sm)*1px)] bg-[var(--surface-2)] border border-[var(--border)]"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                      <span className="font-medium text-sm text-[var(--text)]">{im.title}</span>
                    </div>
                    <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
                      {im.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <MicroLabel className="mb-3">Technologies</MicroLabel>
                <div className="flex flex-wrap gap-1.5">
                  {stack.map((s) => (
                    <TechTag key={s} name={s} />
                  ))}
                  {cryptoNote && (
                    <Tag mono tone="accent">
                      {cryptoNote}
                    </Tag>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
