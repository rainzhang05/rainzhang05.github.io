import { expect, test } from "@playwright/test";

test.describe("desktop nav", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("clicking a nav link scrolls to the section", async ({ page }) => {
    await page.goto("/");
    // Wait for the preloader to dismiss (up to 4.2s load + 700ms fade)
    await page.waitForFunction(
      () => !document.querySelector(".fixed.inset-0.z-50:not(.pointer-events-none)"),
      { timeout: 10_000 }
    );
    await page.locator('header a[href="#projects"]').first().click();
    // Allow extra time for smooth scroll to complete
    await page.waitForFunction(() => window.scrollY > 200, { timeout: 10_000 });
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(200);
  });
});

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens, navigates, and closes", async ({ page }) => {
    await page.goto("/");
    // Wait for the preloader to dismiss
    await page.waitForFunction(
      () => !document.querySelector(".fixed.inset-0.z-50:not(.pointer-events-none)"),
      { timeout: 10_000 }
    );
    await page.locator('button[aria-label="Open menu"]').click();
    const menu = page.locator('[aria-hidden="false"]');
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: "Projects" }).click();
    // After the click the menu should hide (open=false → aria-hidden=true)
    await expect(page.locator('[aria-hidden="false"]')).toHaveCount(0);
    await page.waitForFunction(() => window.scrollY > 200, { timeout: 10_000 });
  });
});
