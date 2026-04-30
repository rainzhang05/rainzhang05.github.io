"use client";
import { useEffect, useState, useCallback } from "react";
import { Arrow } from "./ui";

export default function Nav() {
  const [active, setActive] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const ids = ["about", "skills", "work", "projects", "education"];
    let ticking = false;

    const updateActive = () => {
      ticking = false;
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--nav-scroll-offset").trim();
      const offset = Number.parseFloat(raw) || 90;
      let current = ids[0];
      for (const id of ids) {
        const anchor = document.getElementById(id);
        if (!anchor) continue;
        /* ids live on `.section-head`; compare headline row to sticky nav edge (matches anchor scroll UX). */
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

  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav-inner">
        <a href="#top" className="brand">
          <span className="brand-name">Rain&nbsp;<em>Zhang.</em></span>
        </a>
        <div className="nav-links">
          {links.map((l) => (
            <a key={l.id} className={`nav-link ${active === l.id ? "is-active" : ""}`} href={`#${l.id}`}>
              {l.label}
            </a>
          ))}
        </div>
        <a className="nav-cta" href="#contact">
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
            onClick={closeMenu}
          >
            {l.label}
          </a>
        ))}
        <a className="nav-mobile-cta" href="#contact" onClick={closeMenu}>
          Get in touch <Arrow width={14} height={14} />
        </a>
      </div>
    </nav>
  );
}

