import { Icon } from "@/components/atoms/Icon";
import { Tag } from "@/components/atoms/Tag";

function HeroPhoto() {
  return (
    <div className="relative rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface-2)] group aspect-square w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/portfolio-photo.png"
        alt="Portrait of Rain Zhang"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/5 rounded-full" />
    </div>
  );
}

function HeroCtas() {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-2.5">
      <a
        href="/rain-zhang-resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-[calc(var(--r-sm)*1px)] text-sm font-medium border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] transition-colors"
      >
        <Icon name="file" size={14} />
        Resume
        <Icon
          name="arrow-right"
          size={14}
          className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
        />
      </a>
      <a
        href="mailto:rainzhang.zty@gmail.com"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[calc(var(--r-sm)*1px)] text-sm font-medium border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] transition-colors"
      >
        <Icon name="mail" size={14} />
        Get in touch
      </a>
    </div>
  );
}

function HeroTags() {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Tag mono>Computer Science · SFU</Tag>
      <Tag mono>Vancouver, BC</Tag>
      <Tag mono tone="accent">
        Full-stack engineer
      </Tag>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="intro"
      data-section-label="intro"
      className="relative pt-[calc(var(--gap-section)*0.6)] pb-[calc(var(--gap-section)*0.7)]"
    >
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-8 lg:col-start-1">
          <HeroTags />
          <h1 className="mt-7 text-[clamp(2.5rem,7.2vw,6rem)] leading-[0.94] tracking-[-0.045em] font-medium text-[var(--text)]">
            <span className="block">Rain</span>
            <span className="block">
              Zhang<span className="text-[var(--accent)]">.</span>
            </span>
          </h1>
          <p className="mt-8 text-[clamp(1.1rem,1.6vw,1.4rem)] leading-[1.5] text-[var(--text-muted)] max-w-2xl">
            I&apos;m a{" "}
            <span className="text-[var(--text)]">
              Computer Science student at Simon Fraser University
            </span>
            , based in Vancouver, BC. I build full-stack web applications across Python, React, and
            TypeScript, and I&apos;m currently open to software engineering internship and new-grad
            opportunities.
          </p>
          <HeroCtas />
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <div className="max-w-[320px] mx-auto lg:mx-0 lg:ml-auto w-full">
            <HeroPhoto />
          </div>
        </div>
      </div>
    </section>
  );
}
