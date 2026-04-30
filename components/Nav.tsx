"use client";
import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { Arrow } from "./ui";

const TRACKED_SECTION_IDS = ["about", "skills", "work", "projects", "education"];
const SCROLL_TARGET_IDS = [...TRACKED_SECTION_IDS, "contact"];

function getNavHeight() {
  return document.querySelector<HTMLElement>(".nav")?.getBoundingClientRect().height ?? 0;
}

function getSectionHead(id: string) {
  return document.getElementById(id)?.querySelector<HTMLElement>(".section-head") ?? null;
}

function scrollToSectionHead(id: string) {
  const target = getSectionHead(id);
  if (!target) return false;

  const top = target.getBoundingClientRect().top + window.scrollY - getNavHeight();
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });

  return true;
}

export default function Nav() {
  const [active, setActive] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    let ticking = false;

    const updateActive = () => {
      ticking = false;
      const offset = getNavHeight();
      let current = TRACKED_SECTION_IDS[0];
      for (const id of TRACKED_SECTION_IDS) {
        const anchor = getSectionHead(id);
        if (!anchor) continue;
        if (anchor.getBoundingClientRect().top <= offset) current = id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActive);
      }
    };

    updateActive();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  useEffect(() => {
    const scrollToHashTarget = () => {
      const id = window.location.hash.slice(1);
      if (!SCROLL_TARGET_IDS.includes(id)) return;

      requestAnimationFrame(() => {
        scrollToSectionHead(id);
      });
    };

    scrollToHashTarget();
    window.addEventListener("hashchange", scrollToHashTarget);
    return () => window.removeEventListener("hashchange", scrollToHashTarget);
  }, []);

  /* Body scroll lock + Escape key handler */
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("nav-open");
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeMenu();
      };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.classList.remove("nav-open");
        window.removeEventListener("keydown", onKey);
      };
    } else {
      document.body.classList.remove("nav-open");
    }
  }, [menuOpen, closeMenu]);

  /* Close mobile menu on resize past breakpoint */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 820 && menuOpen) closeMenu();
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen, closeMenu]);

  const links = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "work", label: "Work" },
    { id: "projects", label: "Projects" },
    { id: "education", label: "Education" },
  ];

  const handleSectionClick = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (!getSectionHead(id)) return;

    event.preventDefault();
    closeMenu();
    document.body.classList.remove("nav-open");
    scrollToSectionHead(id);
    window.history.pushState(null, "", `#${id}`);
  };

  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav-inner">
        <a href="#top" className="brand">
          <span className="brand-name">Rain&nbsp;<em>Zhang.</em></span>
        </a>
        <div className="nav-links">
          {links.map((l) => (
            <a
              key={l.id}
              className={`nav-link ${active === l.id ? "is-active" : ""}`}
              href={`#${l.id}`}
              onClick={handleSectionClick(l.id)}
            >
              {l.label}
            </a>
          ))}
        </div>
        <a className="nav-cta" href="#contact" onClick={handleSectionClick("contact")}>
          Get in touch <Arrow width={12} height={12} />
        </a>
        <button
          className={`nav-toggle${menuOpen ? " is-active" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>
      </div>
      <div className={`nav-mobile${menuOpen ? " is-open" : ""}`} aria-hidden={!menuOpen}>
        {links.map((l) => (
          <a
            key={l.id}
            className={`nav-mobile-link${active === l.id ? " is-active" : ""}`}
            href={`#${l.id}`}
            onClick={handleSectionClick(l.id)}
          >
            {l.label}
          </a>
        ))}
        <a className="nav-mobile-cta" href="#contact" onClick={handleSectionClick("contact")}>
          Get in touch <Arrow width={14} height={14} />
        </a>
      </div>
    </nav>
  );
}
