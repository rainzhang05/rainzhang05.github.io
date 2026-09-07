'use client';

import { useCallback, useRef, useState } from 'react';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { Intro } from './Intro';
import { ExperienceSection } from './ExperienceSection';
import { WorkSection } from './WorkSection';
import { BackgroundSection } from './BackgroundSection';
import { ContactSection } from './ContactSection';
import { Toast } from '@/components/ui/Toast';
import { prefersReducedMotion } from '@/lib/useReducedMotion';
import { site, type Locale } from '@/lib/site';
import type { Copy } from '@/lib/types';

/**
 * The whole page. Only three pieces of state: which experience row is open,
 * which project row is open, and the toast. One row per list at a time.
 */
export function PortfolioPage({ copy, locale }: { copy: Copy; locale: Locale }) {
  const [openExperience, setOpenExperience] = useState<string | null>(null);
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  /** Bring a row back under the header if opening pushed it off-screen. */
  const keepInView = useCallback((id: string) => {
    setTimeout(() => {
      const row = document.getElementById('row-' + id);
      if (!row) return;
      const { top } = row.getBoundingClientRect();
      if (top >= 0) return;
      window.scrollTo({
        top: Math.max(0, window.scrollY + top - 24),
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    }, 80);
  }, []);

  const toggleExperience = useCallback(
    (id: string) => {
      setOpenExperience((current) => {
        if (current === id) return null;
        keepInView(id);
        return id;
      });
    },
    [keepInView]
  );

  const toggleProject = useCallback(
    (id: string) => {
      setOpenProject((current) => {
        if (current === id) return null;
        keepInView(id);
        return id;
      });
    },
    [keepInView]
  );

  /** "Related work" in an experience entry opens the project and scrolls to it. */
  const revealProject = useCallback((id: string) => {
    setOpenProject(id);
    setTimeout(() => {
      const row = document.getElementById('row-' + id);
      if (!row) return;
      window.scrollTo({
        top: Math.max(0, window.scrollY + row.getBoundingClientRect().top - 24),
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    }, 60);
  }, []);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      clearTimeout(toastTimer.current);
      setToast(copy.contact.copied);
      toastTimer.current = setTimeout(() => setToast(null), 2200);
    } catch {
      window.location.href = 'mailto:' + site.email;
    }
  }, [copy.contact.copied]);

  return (
    <>
      <div
        id="top"
        className="mx-auto box-border w-full max-w-container px-gutter-mobile sm:px-gutter"
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-sheet focus:px-4 focus:py-2 focus:text-body-14 focus:text-ink focus:no-underline focus:shadow-toast"
        >
          {copy.labels.skipToContent}
        </a>
        <SiteHeader name={site.name} links={copy.nav} locale={locale} />
        <main id="main" tabIndex={-1}>
          <Intro copy={copy.intro} onCopyEmail={copyEmail} />
          <ExperienceSection
            copy={copy}
            openId={openExperience}
            onToggle={toggleExperience}
            onOpenProject={revealProject}
          />
          <WorkSection copy={copy} openId={openProject} onToggle={toggleProject} />
          <BackgroundSection copy={copy} />
          <ContactSection copy={copy} onCopyEmail={copyEmail} />
        </main>
        <SiteFooter copy={copy} />
      </div>
      {toast ? <Toast message={toast} /> : null}
    </>
  );
}
