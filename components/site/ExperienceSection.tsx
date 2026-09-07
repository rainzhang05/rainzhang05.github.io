'use client';

import { DisclosureRow, PanelBlock } from './DisclosureRow';
import { CompanyMark } from './CompanyMark';
import { SectionHeading } from './SectionHeading';
import { TechTagList } from '@/components/ui/TechTag';
import type { Copy } from '@/lib/types';

interface Props {
  copy: Copy;
  openId: string | null;
  onToggle: (id: string) => void;
  onOpenProject: (id: string) => void;
}

export function ExperienceSection({ copy, openId, onToggle, onOpenProject }: Props) {
  const titleOf = (id: string) =>
    [...copy.featured, ...copy.other].find((p) => p.id === id)?.title ?? id;

  return (
    <section id="experience" className="enter enter-6 pt-section">
      <SectionHeading>{copy.sections.experience}</SectionHeading>
      <ul className="m-0 list-none p-0">
        {copy.experiences.map((item) => (
          <DisclosureRow
            key={item.id}
            id={item.id}
            meta={item.dates}
            title={item.role}
            summary={item.summary}
            open={openId === item.id}
            onToggle={onToggle}
            labels={copy.labels}
            subtitle={item.orgLine}
            leading={<CompanyMark mark={item.mark} alt={item.org} />}
          >
            {item.groups.map((group) => (
              <PanelBlock key={group.label} label={group.label}>
                <ul className="m-0 grid max-w-[62ch] list-disc gap-1.5 pl-[18px] text-body-15 text-ink-2">
                  {group.items.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </PanelBlock>
            ))}

            <PanelBlock label={copy.labels.technologies}>
              <TechTagList items={item.tech} />
            </PanelBlock>

            {item.related.length > 0 ? (
              <PanelBlock label={copy.labels.relatedWork}>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                  {item.related.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onOpenProject(id)}
                      className="no-copy m-0 rounded-sm p-0 text-left text-body-sm text-sage transition-colors duration-fast ease-out hover:text-sage-strong hover:underline hover:decoration-1 hover:underline-offset-2"
                    >
                      {titleOf(id)}
                    </button>
                  ))}
                </div>
              </PanelBlock>
            ) : null}
          </DisclosureRow>
        ))}
      </ul>
    </section>
  );
}
