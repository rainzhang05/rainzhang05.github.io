'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { SectionDock } from './SectionDock';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { Intro } from './Intro';
import { ExperienceSection } from './ExperienceSection';
import { WorkSection } from './WorkSection';
import { BackgroundSection } from './BackgroundSection';
import { ContactSection } from './ContactSection';
import { Toast } from '@/components/ui/Toast';
import { sectionLinks } from '@/lib/sectionLinks';
import { prefersReducedMotion } from '@/lib/useReducedMotion';
import { resumePage, site, type Locale } from '@/lib/site';
import type { Copy } from '@/lib/types';

/** Longer than any panel takes to close, so a hold can never outlive its reason. */
const HOLD_LIMIT_MS = 2000;

/**
 * The whole page. Only three pieces of state: which experience row is open,
 * which project row is open, and the toast. One row per list at a time.
 */
export function PortfolioPage({ copy, locale }: { copy: Copy; locale: Locale }) {
  const [openExperience, setOpenExperience] = useState<string | null>(null);
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  /**
   * Opening a row closes the one already open in its list, and when that one
   * sits above, its panel collapsing drags the row just clicked up the page —
   * over 900px for a selected-work panel, clean off the top of the screen and
   * out of reach. So while the panel above closes, the page gives back exactly
   * the height it loses, frame by frame, and the row stays under the pointer
   * that opened it. The browser's own scroll anchoring cannot do this: it
   * anchors to the closing panel's content, which never moves.
   *
   * The compensation is the panel's change in height, never the row's change
   * in position, so a reader who scrolls at the same time is not fought. And it
   * is kept as a running balance — what the panel has lost against what the
   * page has actually given back — because Safari and Firefox round each
   * scroll to the pixel grid, and forty frames of dropped fractions left the
   * row 20px from where it was clicked.
   */
  const holdBelow = useCallback((closingId: string, id: string) => {
    const panel = document.getElementById('panel-' + closingId);
    const row = document.getElementById('row-' + id);
    if (!panel || !row) return;
    if (!(panel.compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING)) return;

    const from = panel.getBoundingClientRect().height;
    let given = 0;
    const until = performance.now() + HOLD_LIMIT_MS;
    const hold = () => {
      // Reopened before it finished: the hold has nothing left to give back.
      if (panel.dataset.open === 'true') return;
      const height = panel.getBoundingClientRect().height;
      const owed = from - height - given;
      if (owed > 0) {
        const before = window.scrollY;
        window.scrollBy({ top: -owed, behavior: 'instant' });
        given += before - window.scrollY;
      }
      if (height > 0 && performance.now() < until) requestAnimationFrame(hold);
    };
    requestAnimationFrame(hold);
  }, []);

  const toggleExperience = useCallback(
    (id: string) => {
      if (openExperience !== null && openExperience !== id) holdBelow(openExperience, id);
      setOpenExperience(openExperience === id ? null : id);
    },
    [openExperience, holdBelow]
  );

  const toggleProject = useCallback(
    (id: string) => {
      if (openProject !== null && openProject !== id) holdBelow(openProject, id);
      setOpenProject(openProject === id ? null : id);
    },
    [openProject, holdBelow]
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

  const dockLinks = useMemo(() => sectionLinks(copy), [copy]);

  /**
   * Jump to a section from the dock. Same window.scrollTo idiom as the two row
   * nudges above, but with no offset: scroll-padding-top is 0, so a jump is
   * meant to land on the section's own top edge.
   *
   * The dock is made of buttons rather than anchors, and a button does not move
   * the sequential focus navigation starting point the way an anchor does — so
   * put it there by hand, or the next Tab resumes at the dock and a screen
   * reader never follows.
   */
  const scrollToSection = useCallback((id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    window.scrollTo({
      top: Math.max(0, window.scrollY + section.getBoundingClientRect().top),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
    section.focus({ preventScroll: true });
    window.history.replaceState(null, '', '#' + id);
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
        tabIndex={-1}
        className="mx-auto box-border w-full max-w-container px-gutter-mobile sm:px-gutter"
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-sheet focus:px-4 focus:py-2 focus:text-body-14 focus:text-ink focus:no-underline focus:shadow-toast"
        >
          {copy.labels.skipToContent}
        </a>
        <SiteHeader
          name={site.name}
          links={copy.nav}
          locale={locale}
          themeLabels={copy.labels.theme}
          navigationLabels={copy.labels.navigation}
        />
        <main id="main" tabIndex={-1}>
          <Intro copy={copy.intro} resumeHref={resumePage[locale]} onCopyEmail={copyEmail} />
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
      <SectionDock links={dockLinks} label={copy.labels.sectionNav} onNavigate={scrollToSection} />
      {toast ? <Toast message={toast} /> : null}
    </>
  );
}
