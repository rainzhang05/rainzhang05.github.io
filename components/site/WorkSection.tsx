'use client';

import Image from 'next/image';
import { DisclosureRow, PanelBlock } from './DisclosureRow';
import { SectionHeading } from './SectionHeading';
import { TechTag, TechTagList } from '@/components/ui/TechTag';
import { TextLink } from '@/components/ui/TextLink';
import type { Copy, Project } from '@/lib/types';

interface Props {
  copy: Copy;
  openId: string | null;
  onToggle: (id: string) => void;
}

function ProjectRow({
  project,
  copy,
  open,
  onToggle,
  headingLevel,
}: {
  project: Project;
  copy: Copy;
  open: boolean;
  onToggle: (id: string) => void;
  headingLevel?: 'h3' | 'h4';
}) {
  return (
    <DisclosureRow
      id={project.id}
      meta={project.dates}
      title={project.title}
      summary={project.summary}
      open={open}
      onToggle={onToggle}
      headingLevel={headingLevel}
      labels={copy.labels}
      footer={
        <>
          <div className="flex flex-wrap items-center gap-2">
            {project.primary.map((name) => (
              <TechTag key={name} name={name} />
            ))}
          </div>
          {project.links.map((link) => (
            <span key={link.href} className="text-caption">
              <TextLink href={link.href} tone="ink" external>
                {link.label}
              </TextLink>
            </span>
          ))}
        </>
      }
    >
      {project.sections.map((section, i) => (
        <PanelBlock key={section.label} label={section.label}>
          <p className="m-0 max-w-[62ch] text-body-15 text-ink-2">{section.text}</p>
        </PanelBlock>
      ))}

      {project.image ? (
        <div className="relative aspect-[16/8] overflow-hidden rounded-md bg-surface">
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            /* The frame is never as wide as the viewport, and saying it is
               costs real bytes: at 768px it measures 480px, not 768. Below
               640px it is the content column, so the two 24px mobile gutters
               come off; from 640px the 160px date column and its 32px gap go
               too; past the 1080px container it settles at a constant 792px.
               Under-declaring at the fold is safe — the smallest candidate
               next/image generates is 640w. */
            sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 1079px) calc(100vw - 288px), 792px"
            /* Eager, not lazy. The panel is always in the DOM but collapsed to
               a zero-height track, which never intersects — so a lazy image
               would not begin loading until the row was opened, and would then
               draw in half under the reader. */
            loading="eager"
            draggable={false}
            className="no-copy object-cover object-top"
          />
        </div>
      ) : null}

      <PanelBlock label={copy.labels.stack}>
        <TechTagList items={project.stack} />
      </PanelBlock>

      <PanelBlock label={copy.labels.status}>
        <p className="m-0 max-w-[62ch] text-body-15 text-ink-2">{project.status}</p>
      </PanelBlock>
    </DisclosureRow>
  );
}

export function WorkSection({ copy, openId, onToggle }: Props) {
  return (
    <section tabIndex={-1} id="work" className="pt-section">
      <SectionHeading>{copy.sections.work}</SectionHeading>
      <ul className="m-0 list-none p-0">
        {copy.featured.map((project) => (
          <ProjectRow
            key={project.id}
            project={project}
            copy={copy}
            open={openId === project.id}
            onToggle={onToggle}
          />
        ))}
      </ul>

      <div className="border-b border-rule pb-3 pt-10">
        <h3 className="m-0 text-label font-medium uppercase text-ink-3">
          {copy.sections.otherWork}
        </h3>
      </div>
      <ul className="m-0 list-none p-0">
        {copy.other.map((project) => (
          <ProjectRow
            key={project.id}
            project={project}
            copy={copy}
            open={openId === project.id}
            onToggle={onToggle}
            headingLevel="h4"
          />
        ))}
      </ul>
    </section>
  );
}
