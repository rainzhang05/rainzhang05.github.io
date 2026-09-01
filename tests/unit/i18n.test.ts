import { describe, expect, it } from "vitest";
import { DICTIONARIES, getDictionary } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n/config";
import { EN_CONTENT } from "@/lib/i18n/en/content";
import { JA_CONTENT } from "@/lib/i18n/ja/content";

type Unknown = Record<string, unknown>;

/**
 * Collects every leaf path so the two dictionaries can be compared by shape.
 * Array indices collapse to `[]` because rich-text `parts` arrays are expected
 * to differ per locale — Japanese puts the emphasized run in a different place
 * than English, which is the reason that prose is data and not JSX.
 */
function leafPaths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((v) => leafPaths(v, `${prefix}[]`));
  }
  if (value !== null && typeof value === "object") {
    return Object.entries(value as Unknown).flatMap(([k, v]) =>
      leafPaths(v, prefix ? `${prefix}.${k}` : k)
    );
  }
  return [`${prefix}:${typeof value}`];
}

function uniqueSortedPaths(value: unknown): string[] {
  return [...new Set(leafPaths(value))].sort();
}

/** Strings that are intentionally identical in both locales. */
const SHARED_VALUES = new Set([
  "you@example.com",
  "FEITIAN",
  "Rain Zhang — Portfolio",
  "Language",
]);

function stringLeaves(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(stringLeaves);
  if (value !== null && typeof value === "object") {
    return Object.values(value as Unknown).flatMap(stringLeaves);
  }
  return typeof value === "string" ? [value] : [];
}

describe("dictionaries", () => {
  it("exposes one dictionary per configured locale", () => {
    for (const locale of LOCALES) {
      expect(DICTIONARIES[locale].locale).toBe(locale);
    }
  });

  it("falls back to English for an unknown locale", () => {
    // Cast because the whole point is to simulate a bad runtime value.
    expect(getDictionary("de" as never).locale).toBe("en");
  });

  it("has identical copy structure across locales", () => {
    expect(uniqueSortedPaths(DICTIONARIES.ja.copy)).toEqual(
      uniqueSortedPaths(DICTIONARIES.en.copy)
    );
  });

  it("keeps the same number of about paragraphs and non-empty rich text", () => {
    const en = DICTIONARIES.en.copy.about.paragraphs;
    const ja = DICTIONARIES.ja.copy.about.paragraphs;
    expect(ja.length).toBe(en.length);
    for (const paragraph of [...ja, DICTIONARIES.ja.copy.hero.intro]) {
      expect(paragraph.parts.length).toBeGreaterThan(0);
    }
  });

  it("interpolates the project preview alt text in both locales", () => {
    expect(DICTIONARIES.en.copy.projects.previewAlt("Portfolio")).toContain("Portfolio");
    expect(DICTIONARIES.ja.copy.projects.previewAlt("Portfolio")).toContain("Portfolio");
  });
});

describe("Japanese content parity", () => {
  it("keeps project ids, order, links, and stacks identical to English", () => {
    expect(JA_CONTENT.projects.map((p) => p.id)).toEqual(EN_CONTENT.projects.map((p) => p.id));

    for (const [i, ja] of JA_CONTENT.projects.entries()) {
      const en = EN_CONTENT.projects[i];
      expect(ja.stack, `stack for ${ja.id}`).toEqual(en.stack);
      expect(ja.links, `links for ${ja.id}`).toEqual(en.links);
      expect(ja.cryptoNote, `cryptoNote for ${ja.id}`).toEqual(en.cryptoNote);
      expect(ja.image, `image for ${ja.id}`).toEqual(en.image);
      expect(ja.hideThumbnail, `hideThumbnail for ${ja.id}`).toEqual(en.hideThumbnail);
      expect(ja.tagType, `tagType for ${ja.id}`).toEqual(en.tagType);
      expect(ja.featured, `featured for ${ja.id}`).toEqual(en.featured);
      expect(ja.impact.length, `impact count for ${ja.id}`).toBe(en.impact.length);
    }
  });

  it("keeps experience ids, stacks, and related project links identical", () => {
    expect(JA_CONTENT.experiences.map((e) => e.id)).toEqual(
      EN_CONTENT.experiences.map((e) => e.id)
    );

    for (const [i, ja] of JA_CONTENT.experiences.entries()) {
      const en = EN_CONTENT.experiences[i];
      expect(ja.stack).toEqual(en.stack);
      expect(ja.related).toEqual(en.related);
      expect(ja.org).toEqual(en.org);
      expect(ja.tagType).toEqual(en.tagType);
      expect(ja.outcomes.length).toBe(en.outcomes.length);
    }
  });

  it("keeps nav ids aligned so section anchors and scroll spy still work", () => {
    expect(JA_CONTENT.navItems.map((n) => n.id)).toEqual(EN_CONTENT.navItems.map((n) => n.id));
    expect(JA_CONTENT.footerNav.map((n) => n.id)).toEqual(EN_CONTENT.footerNav.map((n) => n.id));
  });

  it("keeps footer link targets and icons identical", () => {
    expect(JA_CONTENT.footerElsewhere.map((l) => l.href)).toEqual(
      EN_CONTENT.footerElsewhere.map((l) => l.href)
    );
    expect(JA_CONTENT.footerElsewhere.map((l) => l.icon)).toEqual(
      EN_CONTENT.footerElsewhere.map((l) => l.icon)
    );
  });

  it("keeps skill items identical so tech icons still resolve", () => {
    expect(JA_CONTENT.skillGroups.map((g) => g.items)).toEqual(
      EN_CONTENT.skillGroups.map((g) => g.items)
    );
  });

  it("keeps school names and preserves the null expected-graduation field", () => {
    expect(JA_CONTENT.education.map((e) => e.school)).toEqual(
      EN_CONTENT.education.map((e) => e.school)
    );
    expect(JA_CONTENT.education.map((e) => e.expected === null)).toEqual(
      EN_CONTENT.education.map((e) => e.expected === null)
    );
  });
});

describe("Japanese translation coverage", () => {
  it("leaves no English UI copy untranslated", () => {
    const english = new Set(stringLeaves(DICTIONARIES.en.copy));
    const untranslated = stringLeaves(DICTIONARIES.ja.copy).filter(
      (s) => english.has(s) && !SHARED_VALUES.has(s)
    );
    expect(untranslated).toEqual([]);
  });

  it("translates every project title, summary, and impact entry", () => {
    for (const [i, ja] of JA_CONTENT.projects.entries()) {
      const en = EN_CONTENT.projects[i];
      expect(ja.title, `title for ${ja.id}`).not.toBe(en.title);
      expect(ja.summary, `summary for ${ja.id}`).not.toBe(en.summary);
      expect(ja.role, `role for ${ja.id}`).not.toBe(en.role);
      expect(ja.period, `period for ${ja.id}`).not.toBe(en.period);
      for (const [j, im] of ja.impact.entries()) {
        expect(im.title, `impact ${j} title for ${ja.id}`).not.toBe(en.impact[j].title);
        expect(im.body, `impact ${j} body for ${ja.id}`).not.toBe(en.impact[j].body);
      }
    }
  });

  it("translates the experience summary and every outcome", () => {
    for (const [i, ja] of JA_CONTENT.experiences.entries()) {
      const en = EN_CONTENT.experiences[i];
      expect(ja.role).not.toBe(en.role);
      expect(ja.summary).not.toBe(en.summary);
      expect(ja.location).not.toBe(en.location);
      for (const [j, o] of ja.outcomes.entries()) {
        expect(o, `outcome ${j}`).not.toBe(en.outcomes[j]);
      }
    }
  });

  it("keeps established technical names in English", () => {
    const japaneseText = stringLeaves(JA_CONTENT).join(" ");

    for (const term of [
      "Python",
      "React",
      "TypeScript",
      "Rust",
      "Next.js",
      "Docker",
      "WebAuthn",
      "FIDO2",
      "CTAP2",
      "ML-DSA",
      "ML-KEM",
      "GitHub Actions",
    ]) {
      expect(japaneseText, `expected "${term}" to stay in English`).toContain(term);
    }
  });

  it("keeps company and school names in their official form", () => {
    expect(JA_CONTENT.experiences[0].org).toBe("FEITIAN Technologies Co., Ltd.");
    expect(JA_CONTENT.education.map((e) => e.school)).toEqual([
      "Simon Fraser University",
      "Semiahmoo Secondary",
    ]);
  });

  it("does not invent credentials that the English site never claims", () => {
    const japaneseText = stringLeaves(DICTIONARIES.ja).join(" ");
    // Guards against drift toward claims the source content never makes.
    for (const forbidden of ["JLPT", "日本語能力", "ビザ", "永住", "在留", "内定"]) {
      expect(japaneseText, `must not claim "${forbidden}"`).not.toContain(forbidden);
    }
  });
});
