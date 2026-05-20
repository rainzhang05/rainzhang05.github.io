import type { ReactNode } from "react";
import { Card } from "@/components/atoms/Card";
import { Icon } from "@/components/atoms/Icon";
import { ProjectThumbnail } from "@/components/atoms/ProjectThumbnail";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { Tag } from "@/components/atoms/Tag";
import { DSBlock } from "@/sections/design-system/DSBlock";
import { DSSubhead } from "@/sections/design-system/DSSubhead";

/**
 * Tiny numbered kicker shown above a section title — exists only as a
 * documentation example in the design-system page. Matches the kicker style
 * used in `MicroLabel` / section heads elsewhere.
 */
function SectionLabel({ idx, children }: { idx: number; children: ReactNode }) {
  return (
    <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)] mb-2 tabular-nums">
      {String(idx + 1).padStart(2, "0")} — {children}
    </div>
  );
}

export function ComponentsSection() {
  return (
    <DSBlock
      id="components"
      num="05"
      title="Components"
      kicker="Atomic to molecule. Every one is built from the same tokens."
    >
      <div className="space-y-12">
        {/* Buttons */}
        <div>
          <DSSubhead>Buttons</DSSubhead>
          <div className="mt-5 p-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 bg-[var(--text)] text-[var(--bg)] px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Primary <Icon name="arrow-right" size={14} />
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] transition-colors">
              Secondary
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              Ghost
            </button>
            <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono border border-[var(--accent-strong)] text-[var(--accent-strong)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] transition-colors">
              · STATUS
            </button>
          </div>
        </div>

        {/* Tags */}
        <div>
          <DSSubhead>Tags</DSSubhead>
          <div className="mt-5 p-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-wrap gap-2">
            <Tag mono>Python</Tag>
            <Tag mono>TypeScript</Tag>
            <Tag mono>Rust</Tag>
            <Tag mono tone="accent">
              Featured
            </Tag>
            <Tag mono tone="solid">
              Internship
            </Tag>
            <Tag mono tone="ghost">
              Beijing
            </Tag>
          </div>
        </div>

        {/* Form */}
        <div>
          <DSSubhead>Form fields</DSSubhead>
          <div className="mt-5 p-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] grid md:grid-cols-2 gap-6 max-w-2xl">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)] mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Rain Zhang"
                className="w-full bg-transparent border-b border-[var(--border)] focus:border-[var(--accent)] outline-none py-2.5 placeholder:text-[var(--text-subtle)] transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)] mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent border-b border-[var(--border)] focus:border-[var(--accent)] outline-none py-2.5 placeholder:text-[var(--text-subtle)] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Card */}
        <div>
          <DSSubhead>Project card (interactive)</DSSubhead>
          <div className="mt-5">
            <Card className="p-6 max-w-3xl" interactive>
              <div className="grid md:grid-cols-[1.4fr_1fr] gap-6">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)] mb-2">
                    2025 · featured
                  </div>
                  <h3 className="text-2xl font-medium tracking-tight">
                    Authentication &amp; Security Demo
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
                    Unified platform showcasing passwordless auth and security keys to end users.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <Tag mono>React</Tag>
                    <Tag mono>TypeScript</Tag>
                    <Tag mono>Flask</Tag>
                    <Tag mono>Docker</Tag>
                  </div>
                </div>
                <ProjectThumbnail variant={0} label="EXAMPLE" />
              </div>
            </Card>
          </div>
        </div>

        {/* Status / kicker */}
        <div>
          <DSSubhead>Section header (kicker + title)</DSSubhead>
          <div className="mt-5 p-8 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <SectionLabel idx={2}>Projects</SectionLabel>
            <SectionTitle kicker="Selected work — production systems and experiments.">
              Selected work
            </SectionTitle>
          </div>
        </div>
      </div>
    </DSBlock>
  );
}
