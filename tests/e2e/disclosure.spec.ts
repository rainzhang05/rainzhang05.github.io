import { expect, test } from "./fixtures";

/** The site's only interaction: rows that open in place. */
test.describe("disclosure rows", () => {
  test("opens and closes a project row", async ({ page }) => {
    await page.goto("/");

    const button = page.locator("#button-work-webauthn");
    const panel = page.locator("#panel-work-webauthn");

    await expect(button).toHaveAttribute("aria-expanded", "false");
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(panel.getByText("Stack", { exact: true })).toBeVisible();

    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("keeps only one project open at a time", async ({ page }) => {
    await page.goto("/");

    await page.locator("#button-work-webauthn").click();
    await expect(page.locator("#button-work-webauthn")).toHaveAttribute("aria-expanded", "true");

    await page.locator("#button-work-authenticator").click();
    await expect(page.locator("#button-work-authenticator")).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    await expect(page.locator("#button-work-webauthn")).toHaveAttribute("aria-expanded", "false");
  });

  test("keeps closed panels out of the tab order", async ({ page }) => {
    await page.goto("/");

    const related = page.locator("#panel-exp-feitian button").first();
    await expect(related).toBeHidden();

    await page.locator("#button-exp-feitian").click();
    await expect(related).toBeVisible();
  });

  test("opens a related project from an experience and brings it into view", async ({ page }) => {
    await page.goto("/");

    await page.locator("#button-exp-feitian").click();
    const related = page.locator("#panel-exp-feitian button").first();
    await related.click();

    await expect(page.locator("#button-work-webauthn")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#row-work-webauthn")).toBeInViewport();
  });

  test("is operable from the keyboard", async ({ page }) => {
    await page.goto("/");

    const button = page.locator("#button-exp-mnt");
    await button.focus();
    await page.keyboard.press("Enter");

    await expect(button).toHaveAttribute("aria-expanded", "true");
  });
});
