"use client";

import type { MouseEvent } from "react";
import { HTML_LANG, LOCALES, LOCALE_LABEL, LOCALE_PATH } from "@/lib/i18n/config";
import { useCopy, useLocale } from "@/lib/i18n/LocaleProvider";

interface LocaleToggleProps {
  className?: string;
}

/**
 * English/Japanese switch. Uses real anchors rather than next/link because the
 * two locales have separate root layouts — a full document load is what makes
 * `<html lang>` change.
 */
export function LocaleToggle({ className = "" }: LocaleToggleProps) {
  const activeLocale = useLocale();
  const copy = useCopy();

  // Carry the current section across locales (/#projects -> /ja#projects).
  // Done on click rather than in href so the server-rendered markup is stable.
  const onNavigate = (path: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    const hash = window.location.hash;
    if (!hash) return;
    e.preventDefault();
    window.location.href = `${path}${hash}`;
  };

  return (
    <div
      role="group"
      aria-label={copy.language.groupLabel}
      className={`flex items-center shrink-0 h-[28px] rounded-full bg-[var(--surface-2)] border border-[var(--border)] p-[2px] ${className}`}
    >
      {LOCALES.map((locale) => {
        const isActive = locale === activeLocale;
        return (
          <a
            key={locale}
            href={LOCALE_PATH[locale]}
            hrefLang={HTML_LANG[locale]}
            lang={HTML_LANG[locale]}
            onClick={onNavigate(LOCALE_PATH[locale])}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center h-full px-1.5 sm:px-2 rounded-full text-[10px] sm:text-[11px] leading-none whitespace-nowrap transition-colors ${
              isActive
                ? "bg-[var(--surface)] text-[var(--text)] font-medium"
                : "text-[var(--text-subtle)] hover:text-[var(--text)]"
            }`}
          >
            {LOCALE_LABEL[locale]}
          </a>
        );
      })}
    </div>
  );
}
