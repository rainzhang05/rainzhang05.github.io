import { expect, test } from "./fixtures";

/**
 * Arriving from the resume page. Its header and footer link at sections of the
 * home page, and each of those has an arrival of its own — the first screen's
 * cascade belongs to the first screen.
 */
/** The section, and the footer link that goes to it — "work" reads "Selected Work". */
const sections = [
  { id: "experience", link: /^Experience$/ },
  { id: "work", link: /^Selected Work$/ },
  { id: "background", link: /^Background$/ },
  { id: "contact", link: /^Contact$/ },
] as const;

/** Samples the section's opacity every frame from just before the click. */
async function arrivalOf(page: import("@playwright/test").Page, id: string, linkName: RegExp) {
  await page.goto("/resume");
  await page.evaluate((sel) => {
    (window as unknown as { __o: number[] }).__o = [];
    const tick = () => {
      const el = document.querySelector(sel);
      if (el) (window as unknown as { __o: number[] }).__o.push(+getComputedStyle(el).opacity);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, "#" + id);

  await page.locator("footer").getByRole("link", { name: linkName }).first().click();
  await page.waitForTimeout(1400);

  return page.evaluate(() => (window as unknown as { __o: number[] }).__o);
}

test.describe("arriving at a section", () => {
  for (const { id, link } of sections) {
    test(`animates ${id} in, and never dims it on the way`, async ({ page }) => {
      const samples = await arrivalOf(page, id, link);

      await expect(page.locator("html")).toHaveAttribute("data-entrance", id);

      // It moved: a section that simply appeared would be 1 from the first frame.
      expect(Math.min(...samples), `${id} never animated in`).toBeLessThan(0.5);
      expect(samples[samples.length - 1]).toBe(1);

      const drops = samples.filter((v, i) => i > 0 && v < samples[i - 1] - 0.001);
      expect(drops, `${id} dimmed after it had begun arriving`).toEqual([]);
    });
  }

  test("starts on the first beat, not the sixth", async ({ page }) => {
    // #experience carries the last beat of the first screen's cascade. Playing
    // that on arrival left it invisible for six steps, which read as a stall.
    const samples = await arrivalOf(page, "experience", /^Experience$/);
    const firstVisible = samples.findIndex((v) => v > 0.02);

    expect(firstVisible).toBeGreaterThanOrEqual(0);
    // Six beats is 360ms, over 20 frames. One beat is nearer four.
    expect(firstVisible).toBeLessThan(15);
  });

  test("leaves the first screen alone when a section is what arrived", async ({ page }) => {
    await page.goto("/resume");
    await page.locator("footer").getByRole("link", { name: /^Contact$/ }).first().click();
    await page.waitForTimeout(200);

    const heading = await page
      .locator("#intro h1")
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(heading).toBe("none");
  });

  test("gives the resume page its own entrance back afterwards", async ({ page }) => {
    // data-entrance lives on <html>, which both pages share: a stale "work"
    // would silence the resume page's masthead.
    // Below 640px the header links move into the menu sheet; this test is
    // about the attribute, not the header, so drive the wide one.
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/#work");
    await expect(page.locator("html")).toHaveAttribute("data-entrance", "work");

    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Resume" }).click();
    await page.waitForURL((url) => url.pathname === "/resume");

    await expect(page.locator("html")).toHaveAttribute("data-entrance", "intro");
    const masthead = await page
      .locator("main header")
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(masthead).not.toBe("none");
  });
});
