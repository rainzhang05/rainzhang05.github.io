import { expect, test } from "./fixtures";
import { en, ja } from "@/lib/content";

test.describe("navigation", () => {
  // Below 768px the header links move into the sheet, which has its own test
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

test.describe("modal navigation", () => {
  test.use({ viewport: { width: 375, height: 800 } });

  for (const [path, copy] of [["/", en], ["/resume", en], ["/ja", ja], ["/ja/resume", ja]] as const) {
    test(`contains focus and restores it on Escape at ${path}`, async ({ page, isMobile }) => {
      await page.goto(path);
      const trigger = page.getByRole("button", { name: copy.labels.navigation.menu, exact: true });
      await trigger.click();
      const sheet = page.getByRole("dialog", { name: copy.labels.navigation.menu });
      const close = sheet.getByRole("button", { name: copy.labels.navigation.closeMenu });
      await expect(close).toBeFocused();
      expect(await sheet.evaluate((dialog: HTMLDialogElement) => dialog.matches(":modal"))).toBe(true);

      await page.locator("main").evaluate((main: HTMLElement) => main.focus());
      await expect(close).toBeFocused();
      for (const key of ["Tab", "Shift+Tab"] as const) {
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press(key);
          expect(await sheet.evaluate((dialog) => dialog.contains(document.activeElement))).toBe(true);
        }
      }

      const mainTop = await page.locator("main").evaluate((main) => main.getBoundingClientRect().top);
      if (isMobile) {
        await page.keyboard.press("PageDown");
      } else {
        await page.mouse.move(300, 600);
        await page.mouse.wheel(0, 400);
      }
      await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
      expect(await page.locator("main").evaluate((main) => main.getBoundingClientRect().top)).toBeCloseTo(mainTop, 0);

      await page.keyboard.press("Escape");
      await expect(sheet).toBeHidden();
      await expect(trigger).toBeFocused();
      expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
    });
  }

  test("dismisses from the wordmark and close button", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Menu", exact: true });
    await trigger.click();
    let sheet = page.getByRole("dialog", { name: "Menu" });
    await sheet.getByRole("link", { name: "Rain Zhang" }).click();
    await expect(sheet).toBeHidden();
    await expect(page.locator("h1")).toBeInViewport();

    await trigger.click();
    sheet = page.getByRole("dialog", { name: "Menu" });
    await sheet.getByRole("button", { name: "Close menu" }).click();
    await expect(sheet).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("releases the modal when the desktop header becomes visible", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact" }).click();
    await expect(page.locator("section#contact")).toBeInViewport();
  });
});
