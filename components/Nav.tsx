"use client";
import { useEffect, useState } from "react";
import { Arrow } from "./ui";

export default function Nav() {
  const [active, setActive] = useState("about");

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
      </div>
    </nav>
  );
}
