import { SectionHeading } from './SectionHeading';
import { TechTagList } from '@/components/ui/TechTag';
import type { Copy } from '@/lib/types';

/** Education and skills in one block, in the same label-column rhythm. */
export function BackgroundSection({ copy }: { copy: Copy }) {
  return (
    <section id="background" className="scroll-mt-6 pt-section">
      <SectionHeading>{copy.sections.background}</SectionHeading>

      <div className="flex flex-wrap items-start gap-x-8 gap-y-2 border-b border-rule py-5">
        <span className="tabular w-full flex-none pt-0.5 text-body-14 text-ink-3 sm:w-label">
          {copy.education.dates}
        </span>
        <div className="min-w-0 flex-1 basis-[420px]">
          <h3 className="m-0 text-heading font-medium">{copy.education.school}</h3>
          <p className="mt-0.5 text-body-15 text-ink-2">{copy.education.meta}</p>
          <p className="mt-2.5 max-w-measure text-body-15 text-ink-2">{copy.education.detail}</p>
        </div>
      </div>

      {copy.skills.map((group) => (
        <div
          key={group.label}
          className="flex flex-wrap items-start gap-x-8 gap-y-2 border-b border-rule py-4"
        >
          <span className="w-full flex-none pt-0.5 text-body-14 text-ink-3 sm:w-label">
            {group.label}
          </span>
          <div className="min-w-0 flex-1 basis-[420px]">
            <TechTagList items={group.items} />
          </div>
        </div>
      ))}
    </section>
  );
}
