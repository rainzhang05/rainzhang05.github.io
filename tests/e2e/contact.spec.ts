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

  test("focuses a field from anywhere inside its box", async ({ page }) => {
    await openContact(page);

    // The box is the input's frame. Its top, bottom and side edges used to be
    // padding on a div around a 23px input, and a press there focused nothing.
    for (const label of ["Name", "Message"]) {
      const field = page.getByLabel(label);
      const frame = field.locator("xpath=..");
      const { width, height } = (await frame.boundingBox())!;

      // Positions are relative to the frame, so they hold wherever the page
      // has scrolled to by the time each press lands.
      for (const position of [
        { x: width / 2, y: 3 },
        { x: width / 2, y: height - 3 },
        { x: 4, y: height / 2 },
      ]) {
        await field.evaluate((el: HTMLElement) => el.blur());
        await expect(field).not.toBeFocused();
        await frame.click({ position });
        await expect(field).toBeFocused();
      }
    }
  });

  test("shows focus on a field that was sent back as invalid", async ({ page }) => {
    await openContact(page);
    await page.getByRole("button", { name: "Send message" }).click();

    const name = page.getByLabel("Name");
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");

    // Quietly: the frame's hairline turns sage, in place of the error colour it
    // would otherwise keep, and no ring is drawn around the field.
    const read = () =>
      name.locator("xpath=..").evaluate((frame) => {
        const probe = document.createElement("span");
        probe.style.color = "var(--sage)";
        document.body.append(probe);
        const sage = getComputedStyle(probe).color;
        probe.remove();
        const style = getComputedStyle(frame);
        return { border: style.borderTopColor === sage, outline: style.outlineStyle };
      });
    await expect.poll(read).toEqual({ border: true, outline: "none" });

    // The other invalid fields, not in use, keep the error colour.
    const email = await page
      .getByLabel("Email")
      .locator("xpath=..")
      .evaluate((frame) => getComputedStyle(frame).borderTopColor);
    expect(email).toBe("rgb(141, 90, 84)");
  });

  test("keeps the fields at 16px on a phone, so iOS does not zoom into them", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await openContact(page);

    for (const label of ["Name", "Email", "Message"]) {
      const size = await page.getByLabel(label).evaluate((el) => getComputedStyle(el).fontSize);
      expect(size, label).toBe("16px");
    }
  });

  test("moves focus to the confirmation, and back to the form for another", async ({ page }) => {
    await page.route(FORMSPREE, (route) => route.fulfill({ status: 200, body: "{}" }));
    await openContact(page);

    await page.getByLabel("Name").fill("Ada");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByLabel("Message").fill("Hello");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByRole("heading", { name: en.contact.form.sentTitle })).toBeFocused();

    await page.getByRole("button", { name: en.contact.form.another }).click();
    await expect(page.getByLabel("Name")).toBeFocused();
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

    await expect(page.locator("form").getByRole("alert")).toContainText(en.contact.form.failed);
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

test.describe("copy confirmation", () => {
  test("stays on one line on a phone, in the longer of the two languages", async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "clipboard permissions are Chromium-only here");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto("/ja");
    await page.getByRole("button", { name: ja.intro.copyEmail }).click();

    const toast = page.getByRole("status").locator(".toast");
    await expect(toast).toHaveText(ja.contact.copied);

    // Centred with left: 50%, it had half the screen to fit in and wrapped.
    const box = (await toast.boundingBox())!;
    const line = await toast.evaluate((el) => parseFloat(getComputedStyle(el).lineHeight));
    expect(box.height).toBeLessThan(line * 2 + 24);
    // A fixed box is laid out in the viewport less its scrollbar: none on a
    // Mac, 15px of it in Chromium on Linux. Centre on what is left, not on 375.
    const width = await page.evaluate(() => document.documentElement.clientWidth);
    expect(Math.abs(box.x + box.width / 2 - width / 2)).toBeLessThan(2);
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
