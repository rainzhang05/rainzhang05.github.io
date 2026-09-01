import { expect, test, type Page } from "@playwright/test";

/** The preloader keeps scroll-lock listeners attached until it unmounts. */
async function ready(page: Page) {
  await page.waitForFunction(() => !document.querySelector("[data-preloader]"), {
    timeout: 15_000,
  });
}

test.describe("Japanese route", () => {
  test("serves a real Japanese document, not a client-side string swap", async ({ page }) => {
    await page.goto("/ja");
    await ready(page);

    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await expect(page).toHaveTitle(/ポートフォリオ/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/ja$/);
    await expect(page.locator('link[hreflang="ja"]')).toHaveAttribute("href", /\/ja$/);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "ja_JP");
  });

  test("keeps the English document at /", async ({ page }) => {
    await page.goto("/");
    await ready(page);

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle("Rain Zhang — Portfolio");
  });

  test("renders Japanese section headings", async ({ page }) => {
    await page.goto("/ja");
    await ready(page);

    for (const heading of ["自己紹介", "職務経験", "主なプロジェクト", "技術スタック", "学歴"]) {
      await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
    }
  });

  test("shows no leftover English UI copy", async ({ page }) => {
    await page.goto("/ja");
    await ready(page);

    const body = (await page.locator("body").innerText()).replace(/\s+/g, " ");

    // Phrases that only exist in the English dictionary. Project titles and
    // tech names are deliberately excluded — those stay in English.
    const englishOnly = [
      "About",
      "Experience",
      "Selected work",
      "Education",
      "Read more",
      "Get in touch",
      "Send message",
      "Back to top",
      "Contributions & impact",
      "Key outcomes",
      "Related work",
      "Where I've studied",
      "Let's connect",
      "Expected graduation",
      "Designed & built by",
    ];

    const leaked = englishOnly.filter((phrase) => body.includes(phrase));
    expect(leaked, `untranslated English on /ja: ${leaked.join(", ")}`).toEqual([]);
  });

  test("applies Japanese typography tokens only on /ja", async ({ page }) => {
    const read = async () =>
      page.evaluate(() => {
        const root = getComputedStyle(document.documentElement);
        return {
          labelTransform: root.getPropertyValue("--label-transform").trim(),
          labelTracking: root.getPropertyValue("--label-tracking").trim(),
          trackTitle: root.getPropertyValue("--track-title").trim(),
        };
      });

    await page.goto("/");
    await ready(page);
    expect(await read()).toEqual({
      labelTransform: "uppercase",
      labelTracking: "0.15em",
      trackTitle: "-0.02em",
    });

    await page.goto("/ja");
    await ready(page);
    expect(await read()).toEqual({
      labelTransform: "none",
      labelTracking: "0.06em",
      trackTitle: "0",
    });
  });

  test("does not uppercase Japanese micro labels", async ({ page }) => {
    await page.goto("/ja");
    await ready(page);

    const label = page.getByText("担当範囲", { exact: true }).first();
    await expect(label).toBeVisible();
    await expect(label).toHaveCSS("text-transform", "none");
  });
});

test.describe("geo locale redirect", () => {
  test("cookie ja on / lands on Japanese", async ({ page, context, baseURL }) => {
    await context.addCookies([
      { name: "portfolio.locale", value: "ja", url: `${baseURL}/` },
    ]);
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    expect(new URL(page.url()).pathname).toBe("/ja");
  });

  test("cookie en keeps / even with a Japan country header", async ({ page, context, baseURL }) => {
    await context.addCookies([
      { name: "portfolio.locale", value: "en", url: `${baseURL}/` },
    ]);
    await page.setExtraHTTPHeaders({ "x-vercel-ip-country": "JP" });
    await page.goto("/");
    await ready(page);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    expect(new URL(page.url()).pathname).toBe("/");
  });

  test("Japan country header without a cookie sends / to /ja", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-vercel-ip-country": "JP" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    expect(new URL(page.url()).pathname).toBe("/ja");
  });

  test("no cookie and no country header keeps / in English", async ({ page }) => {
    await page.goto("/");
    await ready(page);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    expect(new URL(page.url()).pathname).toBe("/");
  });
});

test.describe("language toggle", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("round-trips between / and /ja", async ({ page }) => {
    await page.goto("/");
    await ready(page);

    const group = page.getByRole("group", { name: "Language" });
    await expect(group.getByRole("link", { name: "EN" })).toHaveAttribute("aria-current", "page");

    await group.getByRole("link", { name: "日本語" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await ready(page);

    const jaGroup = page.getByRole("group", { name: "表示言語" });
    await expect(jaGroup.getByRole("link", { name: "日本語" })).toHaveAttribute(
      "aria-current",
      "page"
    );

    await jaGroup.getByRole("link", { name: "EN" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    expect(new URL(page.url()).pathname).toBe("/");
  });

  test("carries the current section across locales", async ({ page }) => {
    await page.goto("/#projects");
    await ready(page);

    await page
      .getByRole("group", { name: "Language" })
      .getByRole("link", { name: "日本語" })
      .click();

    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    expect(new URL(page.url()).pathname + new URL(page.url()).hash).toBe("/ja#projects");
  });

  test("preserves the persisted theme across a language switch", async ({ page }) => {
    await page.goto("/");
    await ready(page);

    await page.locator('button[aria-label="Switch to dark mode"]').click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page
      .getByRole("group", { name: "Language" })
      .getByRole("link", { name: "日本語" })
      .click();

    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    // The theme is stored under a locale-independent key, so /ja opens dark.
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});

test.describe("mobile language toggle", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("is reachable from the nav pill and the mobile menu", async ({ page }) => {
    await page.goto("/ja");
    await ready(page);

    await expect(
      page.locator("header").getByRole("link", { name: "EN" })
    ).toBeVisible();

    await page.locator('button[aria-label="メニューを開く"]').click();
    const menu = page.locator('[aria-hidden="false"]');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "EN" })).toBeVisible();
  });

  test("navigates Japanese sections from the mobile menu", async ({ page }) => {
    await page.goto("/ja");
    await ready(page);

    await page.locator('button[aria-label="メニューを開く"]').click();
    const menu = page.locator('[aria-hidden="false"]');
    await menu.getByRole("link", { name: "プロジェクト" }).click();
    await expect(page.locator('[aria-hidden="false"]')).toHaveCount(0);
    await expect(page.locator("#projects")).toBeInViewport({ timeout: 10_000 });
  });
});

test.describe("nav layout", () => {
  for (const width of [320, 375, 768, 1024, 1280]) {
    test(`nav pill stays inside the header gutter at ${width}px`, async ({ page }) => {
      test.setTimeout(90_000);
      await page.setViewportSize({ width, height: 800 });

      for (const path of ["/", "/ja"]) {
        await page.goto(path);
        await ready(page);

        const metrics = await page.evaluate(() => {
          const pill = document.querySelector("header > div") as HTMLElement;
          const rect = pill.getBoundingClientRect();
          return {
            width: rect.width,
            height: rect.height,
            left: rect.left,
            right: rect.right,
            viewport: window.innerWidth,
            scrollWidth: document.documentElement.scrollWidth,
          };
        });

        expect(metrics.left, `${path} @ ${width}`).toBeGreaterThanOrEqual(0);
        expect(metrics.right, `${path} @ ${width}`).toBeLessThanOrEqual(metrics.viewport);
        // The header reserves a 16px gutter on each side.
        expect(metrics.width, `${path} @ ${width}`).toBeLessThanOrEqual(metrics.viewport - 32);
        // A wrapped pill would roughly double in height.
        expect(metrics.height, `${path} @ ${width}`).toBeLessThan(70);
        expect(metrics.scrollWidth, `${path} @ ${width}`).toBeLessThanOrEqual(metrics.viewport);
      }
    });
  }
});

test.describe("Japanese contact form", () => {
  test("submits with Japanese labels and shows the Japanese confirmation", async ({ page }) => {
    await page.route("https://formspree.io/**", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: "{}" })
    );

    await page.goto("/ja#contact");
    await ready(page);

    await page.getByLabel("お名前").fill("山田 太郎");
    await page.getByLabel("メールアドレス").fill("taro@example.com");
    await page.getByLabel("メッセージ").fill("はじめまして。");
    await page.getByRole("button", { name: /送信する/ }).click();

    await expect(page.getByText("送信しました。")).toBeVisible({ timeout: 10_000 });
  });

  test("shows the Japanese validation message for a malformed email", async ({ page }) => {
    await page.goto("/ja#contact");
    await ready(page);

    await page.getByLabel("メールアドレス").fill("not-an-email");
    await expect(page.getByText("メールアドレスの形式が正しくありません")).toBeVisible();
  });
});
