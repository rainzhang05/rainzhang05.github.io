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

  test("brings the first screen in once, without a flash", async ({ page }) => {
    // The bug this pins: holding the entrance with `animation: none` alone
    // leaves the heading at its *finished* state under the sheet, so the sheet
    // faded away over a page that was already drawn and the heading then blinked
    // out and arrived a second time. Sampled every frame, its opacity must only
    // ever climb.
    await page.addInitScript(() => {
      (window as unknown as { __opacity: number[] }).__opacity = [];
      const tick = () => {
        const h1 = document.querySelector("h1");
        if (h1) (window as unknown as { __opacity: number[] }).__opacity.push(+getComputedStyle(h1).opacity);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

    await page.goto("/", { waitUntil: "commit" });
    await expect(page.locator("html")).toHaveAttribute("data-boot", "done", { timeout: 10_000 });
    // Past the end of the entrance, so the whole arrival is in the sample.
    await page.waitForTimeout(1200);

    const samples = await page.evaluate(
      () => (window as unknown as { __opacity: number[] }).__opacity
    );
    expect(samples.length).toBeGreaterThan(20);
    expect(samples[samples.length - 1]).toBe(1);

    const drops = samples
      .map((v, i) => (i > 0 && v < samples[i - 1] - 0.001 ? `${samples[i - 1]} -> ${v}` : null))
      .filter(Boolean);
    expect(drops, "the first screen dimmed after it had begun arriving").toEqual([]);
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
