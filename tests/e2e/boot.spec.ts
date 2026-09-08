// Not "./fixtures": this is the one file that wants the sheet.
import { expect, test } from "@playwright/test";

const sheet = "#boot";

test.describe("boot gate", () => {
  test("covers the first load of a session and then lifts", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("data-boot", "done", { timeout: 10_000 });
    await expect(page.locator(sheet)).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("leaves no image still loading when it lifts", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-boot", "done", { timeout: 10_000 });

    const pending = await page.evaluate(() =>
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map((img) => img.currentSrc || img.src)
    );

    expect(pending).toEqual([]);
  });

  test("skips the sheet on a second load in the same session", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-boot", "done", { timeout: 10_000 });

    await page.reload();

    // Set by the inline script before #boot is parsed, so the sheet is part of
    // the element's first computed style rather than a change to it.
    await expect(page.locator("html")).toHaveAttribute("data-boot", "done");
    await expect(page.locator(sheet)).toBeHidden();
  });

  test("is never in the way without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");

    // Nothing has run here, and the sheet is only ever raised by something
    // that runs. This is the page exactly as it was before the gate existed.
    const display = await page.locator(sheet).evaluate((el) => getComputedStyle(el).display);
    expect(display).toBe("none");
    await expect(page.locator("html")).not.toHaveAttribute("data-boot", /.*/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await context.close();
  });

  test("reveals the page anyway when the bundle never arrives", async ({ page }) => {
    // The failure the design exists for: a sheet that cannot be lifted is an
    // invisible site. The inline script raises it, so the inline script's own
    // timer is what lowers it again when React never turns up — and the
    // entrance is not left frozen underneath.
    await page.route("**/_next/static/chunks/**", (route) => route.abort());
    await page.goto("/", { waitUntil: "commit" });

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10_000 });
    await expect(page.locator("html")).toHaveAttribute("data-boot", "done", { timeout: 10_000 });
    await expect(page.locator(sheet)).toBeHidden();
    await expect.poll(() => heading.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  });

  test("stays down when a locale change replaces the tree", async ({ page }) => {
    // data-boot lives on <html>, which React replaces on a locale change. The
    // sheet has to come down with it, not back up.
    // Below 640px the switch moves into the menu sheet; this test is about the
    // gate, not the header, so give it the width where the switch is in view.
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/resume");
    await expect(page.locator("html")).toHaveAttribute("data-boot", "done", { timeout: 10_000 });

    await page
      .getByRole("radiogroup", { name: "Language" })
      .first()
      .getByRole("radio", { name: "日本語" })
      .click();
    await page.waitForURL((url) => url.pathname === "/ja/resume");

    await expect(page.locator(sheet)).toBeHidden();
  });
});
