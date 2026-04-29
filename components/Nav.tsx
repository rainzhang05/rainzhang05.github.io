"use client";
import { useEffect, useState } from "react";
import { Arrow } from "./ui";

export default function Nav() {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const ids = ["about", "skills", "work", "projects", "education"];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
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
