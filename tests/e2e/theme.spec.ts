import { expect, test } from "@playwright/test";

test("theme toggle on / persists across reload via localStorage", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.removeItem("portfolio.theme"));
  await page.reload();

  await page.locator('button[aria-label="Switch to dark mode"]').click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  const stored = await page.evaluate(() => window.localStorage.getItem("portfolio.theme"));
  expect(stored).toBe("dark");

  // Cleanup
  await page.evaluate(() => window.localStorage.removeItem("portfolio.theme"));
});

test("/design-system does NOT persist theme to localStorage", async ({ page }) => {
  await page.goto("/design-system");
  await page.evaluate(() => window.localStorage.removeItem("portfolio.theme"));

  await page.locator('button[aria-label*="Switch"]').first().click();
  // Storage stays empty regardless of in-page toggle.
  const stored = await page.evaluate(() => window.localStorage.getItem("portfolio.theme"));
  expect(stored).toBeNull();
});
