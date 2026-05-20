import { expect, test } from "@playwright/test";

test("home page renders Hero with name + Resume CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Rain");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Zhang");
  await expect(page.getByRole("link", { name: /Résumé/ }).first()).toHaveAttribute(
    "href",
    "/rain-zhang-resume.pdf"
  );
});

test("footer shows the current year dynamically", async ({ page }) => {
  await page.goto("/");
  const year = new Date().getFullYear();
  const footer = page.locator("footer").first();
  await expect(footer).toContainText(`© ${year} Rain Zhang`);
});

test("all 5 project cards render", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#project-security-demo")).toBeVisible();
  await expect(page.locator("#project-mldsa-authenticator")).toBeVisible();
  await expect(page.locator("#project-webauthn-platform")).toBeVisible();
  await expect(page.locator("#project-travel-advisor")).toBeVisible();
  await expect(page.locator("#project-portfolio")).toBeVisible();
});
