import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import { Tag } from "@/components/atoms/Tag";
import { ColorsSection } from "@/sections/design-system/ColorsSection";
import { ComponentsSection } from "@/sections/design-system/ComponentsSection";
import { DesignSystemHeader } from "@/sections/design-system/DesignSystemHeader";
import { FoundationSection } from "@/sections/design-system/FoundationSection";
import { SpacingSection } from "@/sections/design-system/SpacingSection";
import { TweaksSection } from "@/sections/design-system/TweaksSection";
import { TypeSection } from "@/sections/design-system/TypeSection";

export function DesignSystemShell() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans">
      <DesignSystemHeader />

      <main className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-[120px]">
        {/* Hero */}
        <section className="pb-[var(--gap-section)]">
          <div className="font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--text-subtle)] mb-6">
            / design system · v2.0
          </div>
          <h1 className="text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] tracking-[-0.035em] font-medium">
            The system behind
            <br />
            <span className="text-[var(--text-muted)]">a premium portfolio.</span>
          </h1>
          <p className="mt-6 text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
            A modern, minimal, dual-theme design language inspired by Apple&apos;s restraint,
            Linear&apos;s precision, OpenAI&apos;s editorial tone, and Notion&apos;s structure.
            Built on tokens, applied through React + Tailwind, adapted live via eight tweaks.
          </p>
          <div className="mt-8 flex flex-wrap gap-1.5">
            <Tag mono tone="accent">
              Cool / teal accent
            </Tag>
            <Tag mono>Manrope + JetBrains Mono</Tag>
            <Tag mono>Dual theme</Tag>
            <Tag mono>8 live tweaks</Tag>
            <Tag mono>React + Tailwind</Tag>
          </div>
        </section>

        <FoundationSection />
        <ColorsSection />
        <TypeSection />
        <SpacingSection />
        <ComponentsSection />
        <TweaksSection />

        <footer className="pt-[var(--gap-section)] pb-10 border-t border-[var(--border)]">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end">
            <div>
              <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)] mb-3">
                / end of system
              </div>
              <div className="text-[clamp(2rem,5vw,3.5rem)] tracking-[-0.03em] font-medium leading-[1]">
                Tokens make the system.{" "}
                <span className="text-[var(--text-muted)]">Restraint makes it premium.</span>
              </div>
            </div>
            <div className="text-right text-sm text-[var(--text-muted)] space-y-1">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 hover:text-[var(--text)] transition-colors"
              >
                See it applied <Icon name="arrow-up-right" size={14} />
              </Link>
              <div className="font-mono text-[11px]">© {new Date().getFullYear()} Rain Zhang</div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
