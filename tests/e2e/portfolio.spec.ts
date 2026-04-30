import { test, expect, type Page } from "@playwright/test";

const SECTIONS = ["about", "skills", "work", "projects", "education", "contact"];

function captureConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

async function clickNavTarget(page: Page, id: string, isMobile: boolean) {
  if (isMobile) {
    await page.locator(".nav-toggle").click();
    const selector = id === "contact" ? ".nav-mobile-cta" : `.nav-mobile-link[href="#${id}"]`;
    await page.locator(selector).click();
    return;
  }

  const selector = id === "contact" ? ".nav-cta" : `.nav-link[href="#${id}"]`;
  await page.locator(selector).click();
}

async function expectSectionHeadAligned(page: Page, id: string) {
  await page.waitForFunction(
    (sectionId) => {
      const nav = document.querySelector(".nav");
      const head = document.querySelector(`#${sectionId} .section-head`);
      if (!nav || !head) return false;

      const diff = Math.abs(head.getBoundingClientRect().top - nav.getBoundingClientRect().bottom);
      return diff <= 4;
    },
    id,
    { timeout: 8000 }
  );

  const diff = await page.evaluate((sectionId) => {
    const nav = document.querySelector(".nav")!;
    const head = document.querySelector(`#${sectionId} .section-head`)!;
    return Math.abs(head.getBoundingClientRect().top - nav.getBoundingClientRect().bottom);
  }, id);

  expect(diff).toBeLessThanOrEqual(4);
}

test.describe("Portfolio site", () => {
  const mobileTap = () => test.info().project.name === "mobile-chrome";

  test("loads and renders the hero", async ({ page }) => {
    const errors = captureConsoleErrors(page);
    const res = await page.goto("/");
    expect(res?.status()).toBe(200);

    await expect(page.locator("h1")).toContainText(/Rain/);
    await expect(page.locator("h1")).toContainText(/Zhang\./);
    await expect(page.locator(".hero-lede")).toContainText(/Simon Fraser University/);

    const ignorable = (msg: string) =>
      /Failed to load resource:/i.test(msg) && /400 \(Bad Request\)/i.test(msg);
    expect(errors.filter((e) => !ignorable(e)), errors.join("\n")).toEqual([]);
  });

  test("renders every primary section", async ({ page }) => {
    await page.goto("/");
    for (const id of SECTIONS) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test("nav active state updates as sections enter the viewport", async ({ page }) => {
    await page.goto("/");
    await page.locator("#projects").waitFor({ state: "attached" });
    await page.evaluate(async () => {
      await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    });
    await page.evaluate(() => {
      const el = document.querySelector("section.projects");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const docTop = rect.top + window.scrollY;
      const targetTop = docTop + rect.height / 2 - window.innerHeight / 2;
      window.scrollTo(0, Math.max(0, targetTop));
    });
    await page.waitForFunction(
      () => document.querySelector('.nav-link[href="#projects"]')?.classList.contains("is-active") === true,
      null,
      { timeout: 8000 }
    );
  });

  test("nav section links align section heads under the sticky bar", async ({ page }) => {
    await page.goto("/");

    for (const id of SECTIONS) {
      await clickNavTarget(page, id, mobileTap());
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expectSectionHeadAligned(page, id);
    }
  });

  test("direct section hashes align section heads after hydration", async ({ page }) => {
    await page.goto("/#skills");
    await expectSectionHeadAligned(page, "skills");
  });

  test("reveal animations promote .reveal to .is-in on scroll", async ({ page }) => {
    await page.goto("/");
    await page.locator("#projects").evaluate((el) => {
      (el as HTMLElement).scrollIntoView(true);
    });
    await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
    await page.waitForFunction(
      () =>
        document.querySelector("#projects .section-head.reveal")?.classList.contains("is-in") === true,
      null,
      { timeout: 6000 }
    );
  });

  test("project rows reveal expanded content on click and keyboard toggle", async ({ page }) => {
    await page.goto("/");
    const rows = page.locator(".project-row");
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i += 1) {
      const row = rows.nth(i);
      const head = row.locator(".project-row-head");
      const details = row.locator(".project-expanded");
      const firstImpact = row.locator(".impact").first();

      await head.scrollIntoViewIfNeeded();
      await expect(head).toHaveAttribute("aria-expanded", "false");
      await expect(details).toHaveAttribute("aria-hidden", "true");

      await head.click({ force: mobileTap() });
      await expect(head).toHaveAttribute("aria-expanded", "true");
      await expect(row).toHaveClass(/is-open/);
      await expect(row).toHaveCSS("opacity", "1");
      await expect(details).toHaveAttribute("aria-hidden", "false");
      await expect(firstImpact).toBeVisible();

      // Clicking the head again collapses.
      await head.click({ force: mobileTap() });
      await expect(head).toHaveAttribute("aria-expanded", "false");
      await expect(details).toHaveAttribute("aria-hidden", "true");
    }

    const firstRow = rows.first();
    const firstHead = firstRow.locator(".project-row-head");
    await firstHead.scrollIntoViewIfNeeded();
    await firstHead.press("Enter");
    await expect(firstHead).toHaveAttribute("aria-expanded", "true");
    await expect(firstRow.locator(".impact").first()).toBeVisible();
    await firstHead.press("Space");
    await expect(firstHead).toHaveAttribute("aria-expanded", "false");
  });

  test("project links stay usable without collapsing the row", async ({ page }) => {
    await page.goto("/");
    const firstRow = page.locator(".project-row").first();
    const head = firstRow.locator(".project-row-head");

    await head.scrollIntoViewIfNeeded();
    await head.click({ force: mobileTap() });
    await expect(head).toHaveAttribute("aria-expanded", "true");

    const link = firstRow.locator(".exp-link").first();
    await expect(link).toBeVisible();

    const popupPromise = page.waitForEvent("popup");
    await link.click({ force: mobileTap() });
    const popup = await popupPromise;
    await popup.close();

    await expect(head).toHaveAttribute("aria-expanded", "true");
    await expect(firstRow.locator(".impact").first()).toBeVisible();

    await head.click({ force: mobileTap() });
    await expect(head).toHaveAttribute("aria-expanded", "false");
  });

  test("resume PDF is reachable", async ({ page, request }) => {
    await page.goto("/");
    const link = page.locator('a[download][href="/Rain-Zhang-Resume.pdf"]').first();
    await expect(link).toBeVisible();
    const res = await request.get("/Rain-Zhang-Resume.pdf");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/pdf/);
  });

  test("contact form posts to Formspree on success", async ({ page }) => {
    let captured: { method: string; url: string } | null = null;
    await page.route("**/formspree.io/f/xoveaaqo", async (route) => {
      captured = { method: route.request().method(), url: route.request().url() };
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/");

    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.locator("#name").fill("Test User");
    await page.locator("#email").fill("test@example.com");
    await page.locator("#message").fill("Hello from the test suite.");
    await page.locator(".submit-btn").click({ force: mobileTap() });

    await expect(page.locator(".form-feedback")).toContainText(/Thank you for your message/);
    expect(captured).not.toBeNull();
    expect(captured!.method).toBe("POST");
  });

  test("contact form shows error fallback on failure", async ({ page }) => {
    // We don't capture console errors here — the browser logs a 500 from the
    // intentionally failed Formspree request, which is expected for this path.
    await page.route("**/formspree.io/f/xoveaaqo", (route) =>
      route.fulfill({ status: 500, contentType: "application/json", body: "{}" })
    );

    await page.goto("/");

    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.locator("#name").fill("Test User");
    await page.locator("#email").fill("test@example.com");
    await page.locator("#message").fill("Trigger an error path.");
    await page.locator(".submit-btn").click({ force: mobileTap() });

    await expect(page.locator(".form-feedback")).toContainText(/Something went wrong/);
    await expect(page.locator(".submit-btn")).toContainText(/Try again/);
  });

  test("footer year is the current year", async ({ page }) => {
    await page.goto("/");
    const expected = String(new Date().getFullYear());
    await expect(page.locator(".footer-row")).toContainText(expected);
  });
});
