"use client";
import { useEffect, useRef } from "react";

/**
 * Reveal-on-scroll: adds `.is-in` to descendant `.reveal` / `.word` elements
 * when they enter the viewport.
 *
 * Uses an IntersectionObserver as the primary trigger, with two fallbacks
 * because the browser is allowed to coalesce IO entries during fast or
 * programmatic scrolls (e.g. anchor jumps), which can leave an element stuck
 * at opacity 0:
 *   1. On mount, immediately reveal any element already in the viewport.
 *   2. While unrevealed elements remain, a passive scroll listener checks
 *      their bounding rects on each scroll event.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(
  rootMargin = "0px 0px -8% 0px"
) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = Array.from(el.querySelectorAll<HTMLElement>(".reveal, .word"));

    const inViewport = (n: HTMLElement) => {
      const r = n.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };
    const reveal = (n: HTMLElement) => n.classList.add("is-in");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            reveal(en.target as HTMLElement);
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.1, rootMargin }
    );

    targets.forEach((n) => {
      if (inViewport(n)) {
        reveal(n);
      } else {
        io.observe(n);
      }
    });

    const onScroll = () => {
      let pending = false;
      for (const n of targets) {
        if (n.classList.contains("is-in")) continue;
        if (inViewport(n)) {
          reveal(n);
          io.unobserve(n);
        } else {
          pending = true;
        }
      }
      if (!pending) window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [rootMargin]);
  return ref;
}

export function Arrow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}
export function Download(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
    </svg>
  );
}
export function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l3 3 5-6" />
    </svg>
  );
}
