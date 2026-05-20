import { expect, test } from "@playwright/test";

test("design-system page renders the hero", async ({ page }) => {
  await page.goto("/design-system");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("The system behind");
});

test("all six DS section headings are rendered", async ({ page }) => {
  await page.goto("/design-system");
  for (const id of ["foundations", "colors", "type", "spacing", "components", "tweaks"]) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
});

test("accent on /design-system is teal (#14b8a6)", async ({ page }) => {
  await page.goto("/design-system");
  const accent = await page.evaluate(() => {
    const wrapper = document.querySelector('[data-route="design-system"]');
    return getComputedStyle(wrapper as Element).getPropertyValue("--accent").trim();
  });
  expect(accent).toBe("#14b8a6");
});
