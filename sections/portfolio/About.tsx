"use client";

import { RichText } from "@/components/atoms/RichText";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { useCopy } from "@/lib/i18n/LocaleProvider";

export function About() {
  const copy = useCopy();

  return (
    <section id="about" data-section-label="about" className="py-[var(--gap-section)]">
      <SectionTitle kicker={copy.about.kicker}>{copy.about.title}</SectionTitle>
      <div className="space-y-5 max-w-[760px]">
        {copy.about.paragraphs.map((p, i) => (
          <p
            key={i}
            className="text-[clamp(1rem,1.3vw,1.15rem)] leading-[var(--leading-prose)] text-[var(--text-muted)]"
          >
            <RichText paragraph={p} />
          </p>
        ))}
      </div>
    </section>
  );
}
