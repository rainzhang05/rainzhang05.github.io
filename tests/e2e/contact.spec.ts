import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { en, ja } from "@/lib/content";

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

    const honeypot = page.locator('input[name="_gotcha"]');
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

test.describe("native contact form", () => {
  test.use({ javaScriptEnabled: false });

  for (const [path, copy] of [["/", en.contact.form], ["/ja", ja.contact.form]] as const) {
    test(`posts ${path} without putting the message in the URL`, async ({ page }) => {
      await page.route(FORMSPREE, (route) => route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<!doctype html><title>Intercepted</title><p>Submission intercepted</p>",
      }));
      const response = await page.goto(path);
      expect(response?.headers()["content-security-policy"]).toContain(
        "form-action 'self' https://formspree.io"
      );
      await page.getByLabel(copy.name).fill("Ada");
      await page.getByLabel(copy.email).fill("ada@example.com");
      await page.getByLabel(copy.message).fill("Private test message");

      const posted = page.waitForRequest(FORMSPREE);
      await page.getByRole("button", { name: copy.submit }).press("Enter");
      const request = await posted;
      expect(request.method()).toBe("POST");
      expect(new URL(request.url()).search).toBe("");
      expect(Object.fromEntries(new URLSearchParams(request.postData() ?? ""))).toEqual({
        name: "Ada",
        email: "ada@example.com",
        message: "Private test message",
        _gotcha: "",
      });
      await expect(page.getByText("Submission intercepted")).toBeVisible();
      expect(new URL(page.url()).search).toBe("");
    });

    test(`validates required fields and email on ${path} without scripts`, async ({ page }) => {
      let posted = false;
      await page.route(FORMSPREE, async (route) => {
        posted = true;
        await route.fulfill({ status: 200, body: "intercepted" });
      });
      await page.goto(path);
      await page.getByRole("button", { name: copy.submit }).click();
      expect(await page.getByLabel(copy.name).evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
      await page.getByLabel(copy.name).fill("Ada");
      await page.getByLabel(copy.email).fill("invalid");
      await page.getByLabel(copy.message).fill("Hello");
      await page.getByRole("button", { name: copy.submit }).click();
      expect(await page.getByLabel(copy.email).evaluate((input: HTMLInputElement) => input.validity.typeMismatch)).toBe(true);
      expect(posted).toBe(false);
    });
  }
});
