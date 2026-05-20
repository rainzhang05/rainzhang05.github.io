"use client";

import { useCallback, useState } from "react";
import { CursorGlow } from "@/components/chrome/CursorGlow";
import { GridBackground } from "@/components/chrome/GridBackground";
import { Nav } from "@/components/chrome/Nav";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";
import { useTheme } from "@/lib/hooks/useTheme";
import { scrollToProject } from "@/lib/utils/smoothScroll";
import { About } from "@/sections/portfolio/About";
import { Contact } from "@/sections/portfolio/Contact";
import { Education } from "@/sections/portfolio/Education";
import { Experience } from "@/sections/portfolio/Experience";
import { Footer } from "@/sections/portfolio/Footer";
import { Hero } from "@/sections/portfolio/Hero";
import { Projects } from "@/sections/portfolio/Projects";
import { Skills } from "@/sections/portfolio/Skills";

export function PortfolioShell() {
  const [theme, toggleTheme] = useTheme();
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const activeSection = useScrollSpy();

  const onOpenProject = useCallback((id: string) => {
    setOpenProjectId(id);
    // Wait for the expanded state to render, then scroll the card into view
    // (offset for the fixed nav pill).
    setTimeout(() => {
      scrollToProject(id, 90);
    }, 80);
  }, []);

  return (
    <div className="relative min-h-screen text-[var(--text)] bg-[var(--bg)] font-sans">
      <GridBackground />
      <CursorGlow />

      <Nav activeSection={activeSection} theme={theme} onToggleTheme={toggleTheme} />

      <main
        className="mx-auto px-6 lg:px-10"
        style={{ maxWidth: "var(--content-max-w)", paddingTop: "92px" }}
      >
        <Hero />
        <About />
        <Experience onOpenProject={onOpenProject} />
        <Projects openId={openProjectId} setOpenId={setOpenProjectId} />
        <Skills />
        <Education />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
