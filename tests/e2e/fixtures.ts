import { test as base } from "@playwright/test";

/**
 * Playwright's `test`, with the boot gate already satisfied.
 *
 * The gate (see lib/boot.ts) covers the page with a full-viewport sheet on the
 * first load of a session. Every click in this suite would otherwise fail
 * Playwright's actionability check — "element intercepts pointer events" —
 * and retry until it timed out. Seeding the flag skips the sheet, exactly as a
 * second page load in the same session does.
 *
 * tests/e2e/boot.spec.ts imports from "@playwright/test" instead, because it
 * is the one file that wants the sheet.
 */
export const test = base.extend({
  context: async ({ context }, use) => {
    await context.addInitScript(() => {
      // Playwright's opening page is about:blank, and WebKit throws on
      // sessionStorage from an opaque origin. This script runs in every frame
      // of every navigation, so an uncaught throw here would poison them all.
      try {
        sessionStorage.setItem("portfolio.booted", "1");
      } catch {
        // No storage, no seeding: the spec waits the sheet out instead.
      }
    });
    await use(context);
  },
});

export { expect } from "@playwright/test";
