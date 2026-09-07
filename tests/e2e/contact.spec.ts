import { expect, test, type Page } from "@playwright/test";

const FORMSPREE = "**/formspree.io/**";

/**
 * A hash link scrolls smoothly, so the page is still travelling when goto()
 * resolves — the glide down to #contact takes well over a second. Filling or
 * clicking while it moves races Playwright's own scroll-into-view, which is
 * what made these tests flake on WebKit. Wait for it to land first.
 */
async function openContact(page: Page) {
  await page.goto("/#contact");
  await page.waitForFunction(() => {
    const w = window as unknown as { y?: number; still?: number };
    const y = Math.round(window.scrollY);
    w.still = y === w.y ? (w.still ?? 0) + 1 : 0;
    w.y = y;
    return (w.still ?? 0) > 3;
  });
}

test.describe("contact form", () => {
  test("asks for the fields it needs before sending", async ({ page }) => {
    let posted = false;
    await page.route(FORMSPREE, async (route) => {
      posted = true;
      await route.fulfill({ status: 200, body: "{}" });
    });

    await openContact(page);
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.locator("form").getByRole("alert").first()).toBeVisible();
    expect(posted).toBe(false);
  });

  test("says nothing until Send is pressed", async ({ page }) => {
    await openContact(page);

    await page.getByLabel("Name").click();
    await page.getByLabel("Email").fill("not-an-address");
    await page.getByLabel("Message").click();

    await expect(page.locator("form").getByRole("alert")).toHaveCount(0);
  });

  test("rejects an address that is not an email", async ({ page }) => {
    await openContact(page);

    await page.getByLabel("Email").fill("not-an-address");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByText(/doesn.t look like an email/i)).toBeVisible();
  });

  test("sends a complete message and confirms it", async ({ page }) => {
    await page.route(FORMSPREE, async (route) => {
      expect(route.request().method()).toBe("POST");
      await route.fulfill({ status: 200, body: "{}" });
    });

    await openContact(page);
    await page.getByLabel("Name").fill("Ada Lovelace");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByLabel("Message").fill("Hello from a test.");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByText("Message sent")).toBeVisible();
  });

  test("reports a rejected send", async ({ page }) => {
    await page.route(FORMSPREE, (route) => route.fulfill({ status: 500, body: "{}" }));

    await openContact(page);
    await page.getByLabel("Name").fill("Ada Lovelace");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByLabel("Message").fill("Hello from a test.");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.locator("form").getByRole("alert")).toContainText(
      /Couldn.t reach the server/
    );
  });

  test("carries a honeypot that people never see", async ({ page }) => {
    await openContact(page);

    const honeypot = page.locator('input[name="confirm_username"]');
    await expect(honeypot).toHaveCount(1);
    await expect(honeypot).toHaveAttribute("aria-hidden", "true");
    await expect(honeypot).toHaveAttribute("tabindex", "-1");

    const box = await honeypot.boundingBox();
    expect(box, "the honeypot should be parked off-screen").not.toBeNull();
    expect(box!.x + box!.width).toBeLessThan(0);
  });

  test("copies the email address", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "clipboard permissions are Chromium-only here");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    await page.goto("/");
    await page.getByRole("button", { name: "Copy email" }).click();

    await expect(page.getByRole("status")).toContainText("Email copied");
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toBe("rainzhang.zty@gmail.com");
  });
});
