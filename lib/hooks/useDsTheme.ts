"use client";

import { useCallback, useEffect, useState } from "react";
import type { ThemeMode } from "@/lib/types";

/**
 * Design-system page theme hook. Always resets to `prefers-color-scheme` on
 * mount; manual toggles change theme in-page but are NOT persisted to
 * localStorage. Matches the prototype's design-system.jsx behavior.
 */
export function useDsTheme(): readonly [ThemeMode, () => void] {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const sys: ThemeMode = window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(sys);
    document.documentElement.setAttribute("data-theme", sys);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((cur) => (cur === "dark" ? "light" : "dark"));
  }, []);

  return [theme, toggle] as const;
}
