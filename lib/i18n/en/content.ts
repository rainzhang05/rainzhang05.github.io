import { EDUCATION } from "@/lib/data/education";
import { EXPERIENCES } from "@/lib/data/experiences";
import { FOOTER_ELSEWHERE, FOOTER_NAV, NAV_ITEMS } from "@/lib/data/nav";
import { PROJECTS } from "@/lib/data/projects";
import { SKILL_GROUPS } from "@/lib/data/skills";
import type { SiteContent } from "@/lib/i18n/types";

/**
 * English content is the existing `lib/data/*` modules — those files stay the
 * source of truth for structure (ids, stacks, links, dates). The Japanese
 * content module mirrors this shape with translated prose.
 */
export const EN_CONTENT: SiteContent = {
  navItems: NAV_ITEMS,
  footerNav: FOOTER_NAV,
  footerElsewhere: FOOTER_ELSEWHERE,
  projects: PROJECTS,
  experiences: EXPERIENCES,
  skillGroups: SKILL_GROUPS,
  education: EDUCATION,
};
