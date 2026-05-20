"use client";

import { useCallback, useState, useEffect } from "react";
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
import { ScrollReveal } from "@/components/atoms/ScrollReveal";

export function PortfolioShell() {
  const [theme, toggleTheme] = useTheme();
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const activeSection = useScrollSpy();
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  const onOpenProject = useCallback((id: string) => {
    setOpenProjectId(id);
    // Wait for the expanded state to render, then scroll the card into view
    // (offset for the fixed nav pill).
    setTimeout(() => {
      scrollToProject(id, 90);
    }, 80);
  }, []);

  // Body scroll lock during loading - lock scroll via events to prevent scrollbar/layout shift
  useEffect(() => {
    if (!showLoader) return;

    const preventDefault = (e: Event) => {
      e.preventDefault();
    };

    const preventDefaultKeys = (e: KeyboardEvent) => {
      const keys = ["Space", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "End", "Home"];
      if (keys.includes(e.code)) {
        e.preventDefault();
      }
    };

    const handleScroll = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });
    window.addEventListener("keydown", preventDefaultKeys, { passive: false });
    window.addEventListener("scroll", handleScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
      window.removeEventListener("keydown", preventDefaultKeys);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showLoader]);

  useEffect(() => {
    let active = true;

    const handleLoad = async () => {
      // 1. Wait for window load event
      if (document.readyState !== "complete") {
        await new Promise((resolve) => window.addEventListener("load", resolve));
      }

      // 2. Wait for fonts to be ready
      if ("fonts" in document) {
        await document.fonts.ready;
      }

      // 3. Wait for all image tags to load completely
      const imgs = Array.from(document.images);
      await Promise.all(
        imgs.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.addEventListener("load", resolve);
            img.addEventListener("error", resolve);
          });
        })
      );

      // 4. Fade out transition
      if (active) {
        setTimeout(() => {
          setLoading(false);
          // Unmount loader after transition finishes
          setTimeout(() => {
            setShowLoader(false);
          }, 700);
        }, 600); // 600ms stabilization delay for aesthetic pulse
      }
    };

    handleLoad();

    // Fallback maximum loading time: 3.5s
    const fallbackTimeout = setTimeout(() => {
      if (active) {
        setLoading(false);
        setTimeout(() => {
          setShowLoader(false);
        }, 700);
      }
    }, 3500);

    return () => {
      active = false;
      clearTimeout(fallbackTimeout);
    };
  }, []);

  return (
    <div className="relative min-h-screen text-[var(--text)] bg-[var(--bg)] font-sans">
      <GridBackground />
      <CursorGlow />

      <div
        className={`transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Nav activeSection={activeSection} theme={theme} onToggleTheme={toggleTheme} />

        <main
          className="mx-auto px-6 lg:px-10"
          style={{ maxWidth: "var(--content-max-w)", paddingTop: "92px" }}
        >
          <Hero />
          <ScrollReveal>
            <About />
          </ScrollReveal>
          <ScrollReveal>
            <Experience onOpenProject={onOpenProject} />
          </ScrollReveal>
          <ScrollReveal>
            <Projects openId={openProjectId} setOpenId={setOpenProjectId} />
          </ScrollReveal>
          <ScrollReveal>
            <Skills />
          </ScrollReveal>
          <ScrollReveal>
            <Education />
          </ScrollReveal>
          <ScrollReveal>
            <Contact />
          </ScrollReveal>
          <Footer />
        </main>
      </div>

      {showLoader && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg)] transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            loading ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex items-center justify-center mb-1">
              <span className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-[var(--accent)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[var(--accent)]"></span>
            </div>
            <span className="font-mono text-xs md:text-sm tracking-[0.35em] uppercase text-[var(--text-subtle)] animate-pulse">
              Loading
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
