'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

/** How long the copy confirmation stays up. */
const TOAST_MS = 2200;

/** The air left above a project a "Related work" button has scrolled to. */
const REVEAL_OFFSET = 24;

/** Long enough for the opened row to be committed and laid out before the scroll is aimed. */
const REVEAL_DELAY_MS = 60;

/** The longest a jump waits for a scroll already under way to finish. */
const REVEAL_WAIT_MS = 1000;

/**
 * The whole page. Only three pieces of state: which experience row is open,
 * which project row is open, and the toast. One row per list at a time.
 */
export function PortfolioPage({ copy, locale }: { copy: Copy; locale: Locale }) {
  const [openExperience, setOpenExperience] = useState<string | null>(null);
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const revealTimer = useRef<ReturnType<typeof setTimeout>>();
  const revealFrame = useRef(0);

  // A change of language replaces this tree; a timer left running would then
  // set state, or scroll, on a page that is no longer there.
  useEffect(
    () => () => {
      clearTimeout(toastTimer.current);
      clearTimeout(revealTimer.current);
      cancelAnimationFrame(revealFrame.current);
    },
    []
  );

  /**
   * Scroll anchoring, switched off for as long as a panel takes to close.
   *
   * revealProject aims a scroll at where a row is going to be. A browser that
   * anchors — Chrome, Firefox, and WebKit on a phone — may also move the page
   * to keep what is on screen still while the panel above it shrinks, and the
   * two corrections add: the row then stops short of its place by however much
   * the browser gave back, which depends on what was at the top of the screen
   * that frame. With anchoring off there is one correction, and it is exact.
   *
   * The value it puts back is the one from before the first hold, so a second
   * jump made inside the first one's two seconds does not restore "none".
   */
  const anchorHold = useRef<{ timer: ReturnType<typeof setTimeout>; previous: string } | null>(
    null
  );

  const releaseAnchoring = useCallback(() => {
    const held = anchorHold.current;
    if (!held) return;
    clearTimeout(held.timer);
    document.documentElement.style.overflowAnchor = held.previous;
    anchorHold.current = null;
  }, []);

  const suspendAnchoring = useCallback(() => {
    const root = document.documentElement;
    const previous = anchorHold.current?.previous ?? root.style.overflowAnchor;
    if (anchorHold.current) clearTimeout(anchorHold.current.timer);
    root.style.overflowAnchor = 'none';
    anchorHold.current = { previous, timer: setTimeout(releaseAnchoring, HOLD_LIMIT_MS) };
  }, [releaseAnchoring]);

  useEffect(() => releaseAnchoring, [releaseAnchoring]);

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

  /**
   * "Related work" in an experience entry opens the project and goes to it.
   *
   * Where the row will be, not where it is. If another project is open above
   * it, that panel is closing and will carry the row up the page by whatever
   * height it still has, so that height comes off the target. Without it the
   * scroll was right only when the closing panel was below the fold — its
   * close is wound straight to the end there (see unseenCloseMs) — and wrong
   * by whatever was still on screen when it was not: the page glided to where
   * the row had been and left its title above the top of the screen.
   *
   * It waits a beat first, as it always has, so the scroll is aimed once the
   * opened row has been committed and laid out — and then for the page to be
   * at rest, for the reason given where it does.
   *
   * Focus goes too, as it does from the dock. The button that was pressed is
   * in a panel the reader has just been taken away from, and focus left there
   * means the next Tab scrolls the page straight back to it. It is moved
   * before the scroll starts, never during it.
   */
  const revealProject = useCallback(
    (id: string) => {
      const closingId = openProject !== null && openProject !== id ? openProject : null;
      const isAbove = (panel: HTMLElement | null, row: HTMLElement | null) =>
        panel !== null &&
        row !== null &&
        (panel.compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

      // Before the close begins, not once it is under way.
      if (
        closingId !== null &&
        isAbove(document.getElementById('panel-' + closingId), document.getElementById('row-' + id))
      ) {
        suspendAnchoring();
      }

      setOpenProject(id);
      clearTimeout(revealTimer.current);
      cancelAnimationFrame(revealFrame.current);

      const aim = () => {
        const row = document.getElementById('row-' + id);
        if (!row) return;
        const closing = closingId === null ? null : document.getElementById('panel-' + closingId);
        const lost =
          closing !== null && isAbove(closing, row) ? closing.getBoundingClientRect().height : 0;

        document.getElementById('button-' + id)?.focus({ preventScroll: true });
        window.scrollTo({
          top: Math.max(0, window.scrollY + row.getBoundingClientRect().top - lost - REVEAL_OFFSET),
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
      };

      // Not while the page is still gliding from an earlier scroll — the one
      // that brought the pressed button into view when it was tabbed to, say.
      // WebKit lets a smooth scroll already under way run to its end and drops
      // any asked for meanwhile, and nothing cancels it, so the project opened
      // somewhere off screen. Two frames at rest, or the limit, then go.
      const until = performance.now() + REVEAL_WAIT_MS;
      let last = window.scrollY;
      let still = 0;
      const whenStill = () => {
        const y = window.scrollY;
        still = y === last ? still + 1 : 0;
        last = y;
        if (still >= 2 || performance.now() >= until) aim();
        else revealFrame.current = requestAnimationFrame(whenStill);
      };

      revealTimer.current = setTimeout(() => {
        revealFrame.current = requestAnimationFrame(whenStill);
      }, REVEAL_DELAY_MS);
    },
    [openProject, suspendAnchoring]
  );

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
      toastTimer.current = setTimeout(() => setToast(null), TOAST_MS);
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
      <Toast message={toast} />
    </>
  );
}
