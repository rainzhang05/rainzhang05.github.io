import { expect, test } from "./fixtures";

test.describe("home", () => {
  test("renders the page with one h1 and every section", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("build and maintain web systems");

    for (const id of ["experience", "work", "background", "contact"]) {
      await expect(page.locator(`section#${id}`)).toBeVisible();
    }
  });

  test("is English at the canonical root", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("data-locale", "en");
  });

  test("redirects /en to the canonical root", async ({ page }) => {
    await page.goto("/en");

    expect(new URL(page.url()).pathname).toBe("/");
  });

  test("shows content without waiting on JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("section#experience")).toBeVisible();
    await context.close();
  });

  test("logs no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(errors).toEqual([]);
  });

  test("titles and describes itself for search engines", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Rain Zhang/);
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /.+/);
  });
});
