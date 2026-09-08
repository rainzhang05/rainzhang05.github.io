import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/**
 * The switch sits in the header on a wide viewport and inside the menu sheet
 * on a narrow one. Reach whichever one this viewport actually shows.
 */
async function languageSwitch(page: Page) {
  const inHeader = page.getByRole("radiogroup", { name: "Language" }).first();
  if (await inHeader.isVisible()) return inHeader;

  await page.getByRole("button", { name: "Menu" }).click();
  return page.getByRole("dialog", { name: "Menu" }).getByRole("radiogroup", { name: "Language" });
}

test.describe("languages", () => {
  test("serves Japanese at /ja", async ({ page }) => {
    await page.goto("/ja");

    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await expect(page.locator("html")).toHaveAttribute("data-locale", "ja");
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("switches language and remembers the choice", async ({ page, context }) => {
    await page.goto("/");

    await (await languageSwitch(page)).getByRole("radio", { name: "日本語" }).click();
    await page.waitForURL("**/ja");

    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    const cookies = await context.cookies();
    expect(cookies.find((c) => c.name === "portfolio.locale")?.value).toBe("ja");
  });

  test("switches back to English", async ({ page }) => {
    await page.goto("/ja");

    await (await languageSwitch(page)).getByRole("radio", { name: "EN" }).click();
    await page.waitForURL((url) => url.pathname === "/");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("marks the current language in the switch", async ({ page }) => {
    await page.goto("/ja");

    const group = await languageSwitch(page);
    await expect(group.getByRole("radio", { name: "日本語" })).toHaveAttribute("aria-checked", "true");
  });

  test("keeps the switch its own size, wherever it is shown", async ({ page }) => {
    await page.goto("/");

    // The two labels sit in equal grid columns so the sliding pill lands on
    // one of them. Inline, so the control never stretches to its container —
    // in the menu sheet a block-level grid would run the whole width.
    const group = await languageSwitch(page);
    const box = (await group.boundingBox())!;
    const viewport = page.viewportSize()!;
    const labels = await group.getByRole("radio").all();
    const widths = await Promise.all(labels.map(async (l) => (await l.boundingBox())!.width));
    const pill = (await group.locator('[aria-hidden="true"]').boundingBox())!;

    expect(box.width).toBeLessThan(viewport.width / 2);
    expect(widths[0]).toBeCloseTo(widths[1], 1);
    expect(pill.width).toBeCloseTo(widths[0], 1);
  });

  test("leaves the wide header room for it at the width it first appears", async ({ page }) => {
    // 640 is where the links and the switch come out of the menu sheet, so it
    // is the tightest the wide header ever is — and "日本語" is a wider label
    // than the "JA" it replaced. Resized rather than reloaded: the header is
    // laid out by CSS, and six navigations in one worker is what made the
    // sweep in nav.spec.ts time out on CI.
    await page.goto("/");

    for (const width of [640, 700]) {
      await page.setViewportSize({ width, height: 800 });

      const header = page.locator("header").first();
      const fits = await header.evaluate((el) => el.scrollWidth <= el.clientWidth + 1);
      expect(fits, `the header overflows itself at ${width}px`).toBe(true);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
    }
  });

  test("declares both languages to search engines", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('link[hreflang="ja"]')).toHaveAttribute("href", /\/ja$/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  });

  test("translates the interface, not just the prose", async ({ page }) => {
    await page.goto("/ja");

    const untranslated = ["Experience", "Selected Work", "Background", "Contact", "Resume"];
    const body = (await page.locator("main").innerText()).toLowerCase();

    for (const phrase of untranslated) {
      expect(body, `"${phrase}" is still English on /ja`).not.toContain(phrase.toLowerCase());
    }
  });

  test("sends a visitor in Japan to /ja once, then respects their choice", async ({ page }) => {
    const response = await page.request.get("/", {
      headers: { "x-vercel-ip-country": "JP" },
      maxRedirects: 0,
    });
    expect([307, 308]).toContain(response.status());
    expect(response.headers()["location"]).toContain("/ja");

    const chosen = await page.request.get("/", {
      headers: { "x-vercel-ip-country": "JP", cookie: "portfolio.locale=en" },
      maxRedirects: 0,
    });
    expect(chosen.status()).toBe(200);
  });

  test("leaves everyone else on English", async ({ page }) => {
    const response = await page.request.get("/", {
      headers: { "x-vercel-ip-country": "CA" },
      maxRedirects: 0,
    });

    expect(response.status()).toBe(200);
  });
});
