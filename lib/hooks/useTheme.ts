"use client";

import { useCallback, useEffect, useState } from "react";
import type { ThemeMode } from "@/lib/types";

const THEME_STORAGE_KEY = "portfolio.theme";

/**
 * Portfolio theme hook. Reads the value already applied to `<html>` by the
 * pre-hydration ThemeScript, then persists subsequent toggles to localStorage.
 *
 * Initial state is "light" to match SSR markup; the first effect syncs with
 * whatever the ThemeScript decided (which may differ).
 */
export function useTheme(): readonly [ThemeMode, () => void] {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") {
      setTheme(current);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore quota/availability */
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((cur) => (cur === "dark" ? "light" : "dark"));
  }, []);

  return [theme, toggle] as const;
}
