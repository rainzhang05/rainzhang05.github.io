import { expect, test } from "./fixtures";

test.describe("navigation", () => {
  // Below 640px the header links move into the sheet, which has its own test
  // further down; these two are about the wide header.
  test("jumps to a section from the header", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact" }).click();

    await expect(page.locator("section#contact")).toBeInViewport();
  });

  test("returns to the top from the footer", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /Back to top/ }).click();

    await expect(page.locator("h1")).toBeInViewport();
  });

  test("keeps every header link in this tab", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const link of await nav.getByRole("link").all()) {
      await expect(link).not.toHaveAttribute("target", "_blank");
    }
  });

  test("collapses into a sheet on a narrow viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");

    await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden();

    await page.getByRole("button", { name: "Menu" }).click();
    const sheet = page.getByRole("dialog", { name: "Menu" });
    await expect(sheet).toBeVisible();

    await sheet.getByRole("link", { name: "Contact" }).click();
    await expect(sheet).toBeHidden();
    await expect(page.locator("section#contact")).toBeInViewport();
  });

  test("does not scroll sideways at any width", async ({ page }) => {
    // Resized rather than reloaded, for the reason i18n.spec.ts gives: the
    // layout is CSS, and four navigations in one worker is what times this
    // sweep out on CI. Now that the page loads its images up front, each of
    // those navigations also waits on a screenshot variant this width is the
    // only one to ask for.
    await page.goto("/");

    for (const width of [320, 375, 768, 1280]) {
      await page.setViewportSize({ width, height: 800 });

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
    }
  });
});
