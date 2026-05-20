import { expect, test } from "@playwright/test";

test.describe("desktop nav", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("clicking a nav link scrolls to the section", async ({ page }) => {
    await page.goto("/");
    // Wait for the preloader to be fully unmounted from the DOM, not just visually
    // faded — its scroll-lock listeners are detached at unmount.
    await page.waitForFunction(() => !document.querySelector("[data-preloader]"), {
      timeout: 10_000,
    });

    await page.locator('header a[href="#projects"]').first().click();

    // Wait for the projects section to be in view instead of checking scrollY,
    // since smooth scrolling behavior is unreliable in headless browsers.
    await expect(page.locator("#projects")).toBeInViewport({ timeout: 10_000 });
  });
});

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens, navigates, and closes", async ({ page }) => {
    await page.goto("/");
    // Wait for the preloader to be fully unmounted from the DOM
    await page.waitForFunction(() => !document.querySelector("[data-preloader]"), {
      timeout: 10_000,
    });

    await page.locator('button[aria-label="Open menu"]').click();
    const menu = page.locator('[aria-hidden="false"]');
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: "Projects" }).click();
    // After the click the menu should hide (open=false → aria-hidden=true)
    await expect(page.locator('[aria-hidden="false"]')).toHaveCount(0);
    // Verify the projects section is in view
    await expect(page.locator("#projects")).toBeInViewport({ timeout: 10_000 });
  });
});
