import { expect, type Page } from "@playwright/test";
import { test } from "@playwright/test";

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
