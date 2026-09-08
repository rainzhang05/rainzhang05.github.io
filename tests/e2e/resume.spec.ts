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

test.describe("resume routing", () => {
  test("serves the English resume at /resume", async ({ page }) => {
    await page.goto("/resume");

    expect(new URL(page.url()).pathname).toBe("/resume");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Rain Zhang");
  });

  test("serves the Japanese resume at /ja/resume", async ({ page }) => {
    await page.goto("/ja/resume");

    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await expect(page.locator("html")).toHaveAttribute("data-locale", "ja");
    await expect(page.locator("main")).toContainText("経歴");
  });

  test("redirects /en/resume to the canonical /resume", async ({ page }) => {
    const response = await page.request.get("/en/resume", { maxRedirects: 0 });

    expect([301, 308]).toContain(response.status());
    expect(response.headers()["location"]).toContain("/resume");
    expect(response.headers()["location"]).not.toContain("/en/resume");
  });

  test("declares its own canonical and hreflang, not the home page's", async ({ page }) => {
    await page.goto("/resume");

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/resume$/);
    await expect(page.locator('link[hreflang="ja"]')).toHaveAttribute("href", /\/ja\/resume$/);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", /\/resume$/);
  });

  test("lists both resume pages in the sitemap", async ({ page }) => {
    const body = await (await page.request.get("/sitemap.xml")).text();

    expect(body).toContain("<loc>https://rainzhang.me/resume</loc>");
    expect(body).toContain("<loc>https://rainzhang.me/ja/resume</loc>");
    expect(body).not.toContain("rainzhang.me/en");
  });
});

test.describe("resume downloads", () => {
  for (const [locale, pdf] of [
    ["English", "/rain-zhang-resume.pdf"],
    ["Japanese", "/rain-zhang-resume-ja.pdf"],
  ] as const) {
    test(`serves the ${locale} PDF`, async ({ request }) => {
      const response = await request.get(pdf);

      expect(response.status(), pdf).toBe(200);
      expect(response.headers()["content-type"]).toContain("application/pdf");
    });
  }

  test("each page downloads its own language's PDF and no other", async ({ page }) => {
    await page.goto("/resume");
    let link = page.locator("main a[download]");
    await expect(link).toHaveAttribute("href", "/rain-zhang-resume.pdf");
    await expect(link).not.toHaveAttribute("target", "_blank");
    await expect(page.locator('main a[href="/rain-zhang-resume-ja.pdf"]')).toHaveCount(0);

    await page.goto("/ja/resume");
    link = page.locator("main a[download]");
    await expect(link).toHaveAttribute("href", "/rain-zhang-resume-ja.pdf");
    await expect(page.locator('main a[href="/rain-zhang-resume.pdf"]')).toHaveCount(0);
  });
});

test.describe("resume navigation", () => {
  test("is where every Resume link on the home page goes", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const resume = page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Resume" });
    await expect(resume).toHaveAttribute("href", "/resume");
    await expect(resume).not.toHaveAttribute("target", "_blank");

    await resume.click();
    await page.waitForURL((url) => url.pathname === "/resume");
  });

  test("keeps the reader on the resume when they switch language", async ({ page }) => {
    await page.goto("/resume");

    await (await languageSwitch(page)).getByRole("radio", { name: "日本語" }).click();
    await page.waitForURL((url) => url.pathname === "/ja/resume");
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");

    await (await languageSwitch(page)).getByRole("radio", { name: "EN" }).click();
    await page.waitForURL((url) => url.pathname === "/resume");
  });

  test("goes back to the home page from the wordmark and from the footer", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });

    await page.goto("/resume");
    await page.getByRole("link", { name: "Rain Zhang" }).first().click();
    await page.waitForURL((url) => url.pathname === "/");

    await page.goto("/resume");
    await page.getByRole("link", { name: /Back to top/ }).click();
    await page.waitForURL((url) => url.pathname === "/");
  });

  test("reaches a home page section from the resume's header", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/resume");

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Contact" })
      .click();

    await page.waitForURL((url) => url.pathname === "/");
    await expect(page.locator("section#contact")).toBeInViewport();
  });

  test("carries no section dock — there are no sections for it to watch", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/resume");
    // Scrolled rather than wheeled: mobile WebKit has no wheel, and the dock
    // is a thing that appears once the header has left, so scroll is the test.
    await page.evaluate(() => window.scrollTo(0, 900));

    await expect(page.locator(".section-dock")).toHaveCount(0);
  });
});

test.describe("resume layout", () => {
  test("does not scroll sideways at any width, in either language", async ({ page }) => {
    for (const path of ["/resume", "/ja/resume"]) {
      for (const width of [320, 375, 640, 768, 1280]) {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(path);

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        expect(overflow, `horizontal overflow at ${width}px on ${path}`).toBeLessThanOrEqual(1);
      }
    }
  });

  test("reads without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/resume");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Rain Zhang");
    await expect(page.locator("main a[download]")).toHaveAttribute(
      "href",
      "/rain-zhang-resume.pdf"
    );
    await expect(page.locator("main")).toContainText("Simon Fraser University");
    await context.close();
  });
});
