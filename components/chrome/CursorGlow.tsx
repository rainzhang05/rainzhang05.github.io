"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!ref.current) return;
        ref.current.style.setProperty("--mx", `${e.clientX}px`);
        ref.current.style.setProperty("--my", `${e.clientY}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none [@media(pointer:coarse)]:hidden"
      style={{
        background:
          "radial-gradient(520px circle at var(--mx, 50%) var(--my, 30%), color-mix(in oklab, var(--accent) 8%, transparent), transparent 55%)",
        opacity: 0.55,
      }}
    />
  );
}
