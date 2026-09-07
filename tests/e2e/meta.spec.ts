import { expect, test } from "@playwright/test";

test.describe("share card and icons", () => {
  test("points at an og image that actually resolves", async ({ page, request }) => {
    await page.goto("/");

    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      "https://rainzhang.me/og.png"
    );
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
      "content",
      "1200"
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image"
    );

    // The tag carries the deployed URL; check the file this build serves.
    const served = await request.get("/og.png");
    expect(served.status()).toBe(200);
    expect(served.headers()["content-type"]).toContain("image/png");
  });

  test("declares one light theme and a home-screen icon", async ({ page, request }) => {
    await page.goto("/");

    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#f7f5ef");
    await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute("content", "light");

    const href = await page.locator('link[rel="apple-touch-icon"]').getAttribute("href");
    expect(href).toBeTruthy();
    expect((await request.get(href as string)).status()).toBe(200);
  });

  test("describes the person in structured data", async ({ page }) => {
    await page.goto("/");

    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(raw as string);

    expect(data["@type"]).toBe("Person");
    expect(data.name).toBe("Rain Zhang");
    expect(data.sameAs).toContain("https://github.com/rainzhang05");
  });
});

test.describe("crawling", () => {
  test("serves a robots.txt that points at the sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain("User-Agent: *");
    expect(body).toContain("Sitemap: https://rainzhang.me/sitemap.xml");
  });

  test("lists both languages in the sitemap", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain("<loc>https://rainzhang.me</loc>");
    expect(body).toContain("<loc>https://rainzhang.me/ja</loc>");
    expect(body).toContain('hreflang="ja"');
    expect(body).not.toContain("rainzhang.me/en");
  });
});

test.describe("404", () => {
  test("answers an unknown path with the site's own page", async ({ page }) => {
    const response = await page.goto("/no-such-page");

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "This page does not exist." })).toBeVisible();
    await expect(page.getByRole("link", { name: /Back to Rain Zhang/ })).toBeVisible();
  });

  test("answers a deeper unknown path the same way", async ({ page }) => {
    const response = await page.goto("/no/such/page");

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "This page does not exist." })).toBeVisible();
  });

  test("looks like the rest of the site", async ({ page }) => {
    await page.goto("/no-such-page");

    // Next wraps this page in a bare html/body of its own, so the stylesheet
    // and the typeface have to be carried in by hand — easy to lose silently.
    const styles = await page.evaluate(() => {
      const heading = document.querySelector("h1") as HTMLElement;
      return {
        font: getComputedStyle(heading).fontFamily,
        background: getComputedStyle(document.body).backgroundColor,
      };
    });

    expect(styles.font).toContain("albert");
    expect(styles.background).toBe("rgb(247, 245, 239)");
  });
});

test.describe("skip link", () => {
  test("is the first thing in the tab order", async ({ page }) => {
    await page.goto("/");

    // Tab order for elements without a positive tabindex follows the DOM, and
    // WebKit only tabs to links when full keyboard access is switched on — so
    // assert the position rather than pressing Tab.
    const first = await page.evaluate(() => {
      const focusable = document.querySelectorAll<HTMLElement>(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      return focusable[0]?.getAttribute("href");
    });

    expect(first).toBe("#main");
  });

  test("stays out of the way until it is focused, then moves focus into main", async ({ page }) => {
    await page.goto("/");

    // sr-only clips the link to a 1px box rather than hiding it, so assert the
    // size the way the honeypot test does — toBeHidden() would not catch it.
    const skip = page.getByRole("link", { name: "Skip to content" });
    const clipped = await skip.boundingBox();
    expect(clipped?.height).toBeLessThan(4);

    await skip.focus();
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();

    const revealed = await skip.boundingBox();
    expect(revealed?.height).toBeGreaterThan(20);

    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });
});

test.describe("security headers", () => {
  test("sends a policy with every document response", async ({ page }) => {
    const response = await page.goto("/");
    const headers = response?.headers() ?? {};

    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["content-security-policy"]).toContain("https://formspree.io");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["permissions-policy"]).toContain("geolocation=()");
  });
});
