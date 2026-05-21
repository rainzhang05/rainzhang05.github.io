"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/atoms/Icon";
import { Tag } from "@/components/atoms/Tag";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const EMAIL = "rainzhang.zty@gmail.com";

function HeroPhoto() {
  return (
    <div className="relative rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface-2)] aspect-square w-full">
      <Image
        src="/portfolio-photo.png"
        alt="Portrait of Rain Zhang"
        width={320}
        height={320}
        priority
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/5 rounded-full" />
    </div>
  );
}

function HeroCtas() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Without a clipboard API, let the default mailto: navigation happen.
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return;
    e.preventDefault();
    navigator.clipboard.writeText(EMAIL).then(
      () => setCopied(true),
      () => {
        // Clipboard rejected (permission, non-secure context). Fall back to mailto.
        window.location.href = `mailto:${EMAIL}`;
      }
    );
  };

  return (
    <div className="mt-8 flex flex-wrap items-center gap-2.5">
      <a
        href="/rain-zhang-resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex items-center gap-2 bg-[var(--text)] text-[var(--bg)] px-5 py-2.5 rounded-[calc(var(--r-sm)*1px)] text-sm font-medium shadow-[inset_0_1px_0_color-mix(in_oklab,white_15%,transparent),0_4px_14px_-4px_color-mix(in_oklab,var(--text)_45%,transparent)] hover:shadow-[inset_0_1px_0_color-mix(in_oklab,white_22%,transparent),0_10px_24px_-8px_color-mix(in_oklab,var(--text)_60%,transparent)] hover:-translate-y-[1px] active:translate-y-0 active:shadow-[inset_0_1px_0_color-mix(in_oklab,white_10%,transparent),0_2px_8px_-2px_color-mix(in_oklab,var(--text)_40%,transparent)] transition-[transform,box-shadow] duration-200 ease-out"
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
        href={`mailto:${EMAIL}`}
        onClick={handleEmailClick}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[calc(var(--r-sm)*1px)] text-sm font-medium border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] transition-colors"
      >
        <Icon name="mail" size={14} />
        <span aria-live="polite">{copied ? "Email copied!" : "Get in touch"}</span>
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

export function Hero({ animate = false }: { animate?: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  // When the user wants reduced motion, render the final state immediately
  // — no fade/translate stagger. Same final layout, no animation.
  const shown = animate || prefersReducedMotion;
  const baseTransition = prefersReducedMotion
    ? ""
    : "transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]";

  return (
    <section
      id="intro"
      data-section-label="intro"
      className="relative pt-[calc(var(--gap-section)*0.6)] pb-[calc(var(--gap-section)*0.7)]"
    >
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-8 lg:col-start-1">
          <div
            className={`${baseTransition} delay-[100ms] ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <HeroTags />
          </div>
          <div
            className={`${baseTransition} delay-[200ms] ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <h1 className="mt-7 text-[clamp(2.5rem,7.2vw,6rem)] leading-[0.94] tracking-[-0.045em] font-medium text-[var(--text)]">
              <span className="block">Rain</span>
              <span className="block">
                Zhang<span className="text-[var(--accent)]">.</span>
              </span>
            </h1>
          </div>
          <div
            className={`${baseTransition} delay-[300ms] ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <p className="mt-8 text-[clamp(1.1rem,1.6vw,1.4rem)] leading-[1.5] text-[var(--text-muted)] max-w-2xl">
              I&apos;m a{" "}
              <span className="text-[var(--text)]">
                Computer Science student at Simon Fraser University
              </span>
              , based in Vancouver, BC. I build full-stack web applications across Python, React, and
              TypeScript, and I&apos;m currently open to software engineering internship and new-grad
              opportunities.
            </p>
          </div>
          <div
            className={`${baseTransition} delay-[400ms] ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <HeroCtas />
          </div>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <div className="max-w-[320px] mx-auto lg:mx-0 lg:ml-auto w-full">
            <div
              className={`${baseTransition} delay-[300ms] ${shown ? "opacity-100 scale-100" : "opacity-0 scale-[0.97]"}`}
            >
              <HeroPhoto />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
