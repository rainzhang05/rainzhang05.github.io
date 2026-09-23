import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const IVORY = "rgb(247, 245, 239)";
const CHARCOAL = "rgb(27, 26, 23)";

const ground = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

const themeSwitch = (page: Page) => page.getByRole("radiogroup", { name: "Theme" });

test.describe("theme", () => {
  test("follows the device until the reader chooses", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");

    await expect(themeSwitch(page).getByRole("radio", { name: "System" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.*/);
    expect(await ground(page)).toBe(CHARCOAL);

    // System is live: the device changing its mind repaints the page.
    await page.emulateMedia({ colorScheme: "light" });
    await expect.poll(() => ground(page)).toBe(IVORY);
  });

  test("an explicit choice beats the device, and survives a reload", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");

    await themeSwitch(page).getByRole("radio", { name: "Light" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await ground(page)).toBe(IVORY);

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await ground(page)).toBe(IVORY);
    await expect(themeSwitch(page).getByRole("radio", { name: "Light" })).toHaveAttribute(
      "aria-checked",
      "true"
    );

    // Back to System forgets the choice, and the device decides again.
    await themeSwitch(page).getByRole("radio", { name: "System" }).click();
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.*/);
    expect(await ground(page)).toBe(CHARCOAL);
    expect(await page.evaluate(() => localStorage.getItem("portfolio.theme"))).toBeNull();
  });

  test("is already on <html> when the first element of the page is parsed", async ({ page }) => {
    // The inline script has to run before anything is painted; a theme set by
    // React after hydration would flash the page in the other one first.
    await page.addInitScript(() => {
      try {
        localStorage.setItem("portfolio.theme", "dark");
      } catch {
        // about:blank has no storage in WebKit.
      }
      const seen: (string | null)[] = [];
      (window as unknown as { __themeAtBoot: typeof seen }).__themeAtBoot = seen;
      new MutationObserver((records, observer) => {
        for (const record of records) {
          for (const node of record.addedNodes) {
            if (node instanceof HTMLElement && node.id === "boot") {
              seen.push(document.documentElement.getAttribute("data-theme"));
              observer.disconnect();
            }
          }
        }
      }).observe(document, { childList: true, subtree: true });
    });

    await page.goto("/");

    const atBoot = await page.evaluate(
      () => (window as unknown as { __themeAtBoot: string[] }).__themeAtBoot
    );
    expect(atBoot).toEqual(["dark"]);
    expect(await ground(page)).toBe(CHARCOAL);
  });

  test("keeps the chosen theme through a change of language, without a frame of the other", async ({
    page,
  }) => {
    // Changing language remounts <html> and drops every attribute a script
    // wrote; ThemeMemory has to put the choice back before that commit paints.
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await themeSwitch(page).getByRole("radio", { name: "Dark" }).click();

    await page.evaluate(() => {
      const wrong: string[] = [];
      (window as unknown as { __wrong: string[] }).__wrong = wrong;
      const sample = () => {
        const bg = getComputedStyle(document.body).backgroundColor;
        if (bg !== "rgb(27, 26, 23)") wrong.push(bg);
        requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });

    await page.getByRole("radiogroup", { name: "Language" }).getByRole("radio", { name: "日本語" }).click();
    await expect(page).toHaveURL(/\/ja$/);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("radiogroup", { name: "テーマ" }).getByRole("radio", { name: "ダーク" })).toHaveAttribute(
      "aria-checked",
      "true"
    );

    const wrong = await page.evaluate(() => (window as unknown as { __wrong: string[] }).__wrong);
    expect(wrong).toEqual([]);
  });

  test("changes in one frame, with nothing fading behind the new ground", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const colourTransitions = await page.evaluate(() => {
      (document.querySelector('[data-theme-option="dark"]') as HTMLElement).click();
      return document
        .getAnimations()
        .filter((animation) => animation instanceof CSSTransition)
        .map((animation) => (animation as CSSTransition).transitionProperty)
        .filter((property) => property !== "transform");
    });

    expect(colourTransitions).toEqual([]);
    expect(await ground(page)).toBe(CHARCOAL);
  });

  test("sits in the top-right corner at every width", async ({ page }) => {
    await page.goto("/");

    for (const width of [375, 640, 768, 1280]) {
      await page.setViewportSize({ width, height: 800 });

      const header = page.locator("header").first();
      const group = themeSwitch(page);
      await expect(group, `hidden at ${width}px`).toBeVisible();

      const headerBox = (await header.boundingBox())!;
      const box = (await group.boundingBox())!;
      // Right-hand side of the top row: past the middle, and within a menu
      // button's width of the header's right edge.
      expect(box.x, `not on the right at ${width}px`).toBeGreaterThan(headerBox.x + headerBox.width / 2);
      expect(headerBox.x + headerBox.width - (box.x + box.width)).toBeLessThanOrEqual(48);
      expect(box.y).toBeLessThan(headerBox.y + headerBox.height);

      const fits = await header.evaluate((el) => el.scrollWidth <= el.clientWidth + 1);
      expect(fits, `the header overflows itself at ${width}px`).toBe(true);
    }
  });

  test("prints on ivory whatever the screen is showing", async ({ page }) => {
    await page.goto("/resume");
    await themeSwitch(page).getByRole("radio", { name: "Dark" }).click();
    expect(await ground(page)).toBe(CHARCOAL);

    await page.emulateMedia({ media: "print" });
    const ink = await page.evaluate(() => getComputedStyle(document.body).color);
    expect(ink).toBe("rgb(43, 42, 39)");
  });
});
