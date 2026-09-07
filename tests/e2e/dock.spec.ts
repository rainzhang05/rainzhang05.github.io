import { expect, test, type Page } from "@playwright/test";

const DESKTOP = { width: 1440, height: 900 };
/** An item with no morph offset left to apply, as the browser spells it back. */
const REST = "translate3d(0px,0px,0px)";

/** goto, then wait for hydration to put the dock in the DOM — it is a client
 *  component, so it is not in the served HTML. */
async function open(page: Page, url = "/") {
  await page.goto(url);
  await page.locator(".section-dock").waitFor({ state: "attached" });
}

/** Scroll there, then let the dock's frame loop come to rest, so a sample is
 *  the settled state and not a frame of the magnifier easing. */
async function settleAt(page: Page, y: number) {
  return page.evaluate(async (top) => {
    const nav = document.querySelector<HTMLElement>(".section-dock");
    if (!nav) return null;
    const items = [...nav.querySelectorAll<HTMLElement>(".dock-item")];
    const dots = [...nav.querySelectorAll<HTMLElement>(".dock-dot")];
    // The drawn motion, without `shown` — that one is hysteretic on purpose,
    // so it is the one thing that is meant to differ between directions.
    const read = () =>
      JSON.stringify({
        opacity: nav.style.opacity,
        items: items.map((i) => i.style.transform.replace(/\s+/g, "")),
        dots: dots.map((d) => d.style.transform.replace(/\s+/g, "")),
        active: items.findIndex((i) => i.dataset.active === "true"),
      });

    window.scrollTo({ top, behavior: "instant" });

    let previous = "";
    let stable = 0;
    for (let i = 0; i < 120 && (i < 24 || stable < 4); i += 1) {
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      const now = read();
      stable = now === previous ? stable + 1 : 0;
      previous = now;
    }
    return {
      motion: previous.replace(/,"active":-?\d+/, ""),
      active: items.findIndex((i) => i.dataset.active === "true"),
      shown: nav.dataset.shown,
      opacity: nav.style.opacity,
      items: items.map((i) => i.style.transform.replace(/\s+/g, "")),
      dots: dots.map((d) => d.style.transform.replace(/\s+/g, "")),
    };
  }, y);
}

test.describe("section dock", () => {
  test("is absent at the top and formed once the bar has gone", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);

    const top = await settleAt(page, 0);
    expect(top?.shown).toBe("false");

    const docked = await settleAt(page, 900);
    expect(docked?.shown).toBe("true");
    expect(docked?.opacity).toBe("1");
    // State C: every item has returned to the position CSS gives it.
    expect(docked?.items).toEqual([REST, REST, REST, REST]);
  });

  test("retraces exactly when scrolled back up", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);

    const positions = [0, 40, 60, 90, 140, 200, 280, 360, 440, 520, 620, 760];

    const down: (string | undefined)[] = [];
    for (const y of positions) down.push((await settleAt(page, y))?.motion);

    const up: (string | undefined)[] = [];
    for (const y of [...positions].reverse()) up.push((await settleAt(page, y))?.motion);
    up.reverse();

    // Not a fade-out and a fade-in: the same motion, run backwards.
    expect(up).toEqual(down);
  });

  test("holds its visibility across a boundary instead of flickering", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);

    // 40px sits inside the band: coming up from rest it has not appeared yet,
    // and coming back down it has not left.
    await settleAt(page, 0);
    expect((await settleAt(page, 40))?.shown).toBe("false");

    await settleAt(page, 400);
    expect((await settleAt(page, 40))?.shown).toBe("true");
  });

  test("magnifies the current section's bubble, and its neighbours less", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);
    const state = await settleAt(page, 900);

    const scales = (state?.dots ?? []).map((t) => Number(/scale\(([\d.]+)\)/.exec(t)?.[1] ?? 0));
    const focused = scales[state?.active ?? 0];

    expect(focused).toBeCloseTo(1.5, 2);
    scales.forEach((s, i) => {
      if (i !== state?.active) expect(s).toBeLessThan(focused - 0.4);
    });
  });

  test("lands in the final state when a fling crosses every threshold at once", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);

    await settleAt(page, 0);
    const flung = await settleAt(page, 4000);

    expect(flung?.shown).toBe("true");
    expect(flung?.opacity).toBe("1");
    expect(flung?.items.every((t) => t === REST)).toBe(true);
  });

  test("is already formed when the page is refreshed mid-scroll", async ({ page }) => {
    await page.setViewportSize(DESKTOP);

    // Put the page past T4 before React hydrates, which is what a refresh
    // mid-page or a restored session does. Scroll restoration on reload is not
    // reliable across engines under automation, so drive it explicitly.
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () =>
        window.scrollTo({ top: 1500, behavior: "instant" })
      );
    });
    await page.goto("/");
    await page.locator(".section-dock").waitFor({ state: "attached" });

    const first = await page.evaluate(() => {
      const nav = document.querySelector<HTMLElement>(".section-dock");
      return {
        scrollY: Math.round(window.scrollY),
        shown: nav?.dataset.shown,
        opacity: nav?.style.opacity,
        items: [...(nav?.querySelectorAll<HTMLElement>(".dock-item") ?? [])].map((i) =>
          i.style.transform.replace(/\s+/g, "")
        ),
      };
    });

    expect(first.scrollY).toBeGreaterThan(1000);
    expect(first.shown).toBe("true");
    expect(first.opacity).toBe("1");
    expect(first.items.every((t) => t === REST)).toBe(true);
  });

  test("settles into the dock after a hash link glides down the page", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page, "/#contact");

    // A hash link smooth-scrolls, which is the site's existing behaviour, so
    // the dock forms along the way rather than on arrival. Let the glide land
    // before sampling — scrolling it ourselves would cut it short.
    // #contact is the last section and the page runs out of scroll before its
    // top reaches the viewport top, so wait for the glide to stop rather than
    // for a position.
    await page.waitForFunction(() => {
      const w = window as unknown as { __y?: number; __still?: number };
      const y = Math.round(window.scrollY);
      w.__still = y === w.__y ? (w.__still ?? 0) + 1 : 0;
      w.__y = y;
      return y > 1000 && (w.__still ?? 0) > 3;
    });

    const state = await settleAt(page, await page.evaluate(() => window.scrollY));
    expect(state?.shown).toBe("true");
    expect(state?.items.every((t) => t === REST)).toBe(true);
    expect(state?.active).toBe(3);
  });

  test("tracks the section being read", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);

    for (const [index, id] of ["experience", "work", "background", "contact"].entries()) {
      // Land with the section's top just above the 45% line, whatever its height.
      const target = await page.evaluate((section) => {
        const el = document.getElementById(section);
        if (!el) return 0;
        const top = el.getBoundingClientRect().top + window.scrollY;
        return Math.max(0, top - document.documentElement.clientHeight * 0.45 + 10);
      }, id);
      const state = await settleAt(page, target);
      expect(state?.active, `active while reading #${id}`).toBe(index);
    }
  });

  test("navigates from a dock bubble without flickering through the sections", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);
    await settleAt(page, 900);

    const dock = page.getByRole("navigation", { name: "On this page" });
    await dock.getByRole("button", { name: "Contact" }).click();

    // Watch the whole glide, not just where it ends: the click starts a smooth
    // scroll that fires the scroll handler continuously, and the focus index
    // must sit on the destination the entire way rather than sweeping through
    // Work and Background en route.
    const trace = await page.evaluate(async () => {
      const nav = document.querySelector<HTMLElement>(".section-dock")!;
      const items = [...nav.querySelectorAll<HTMLElement>(".dock-item")];
      const seen: { active: number; shown?: string; rest: boolean }[] = [];
      for (let i = 0; i < 60; i += 1) {
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        seen.push({
          active: items.findIndex((it) => it.dataset.active === "true"),
          shown: nav.dataset.shown,
          rest: items.every((it) => /translate3d\(0px,\s*0px,\s*0px\)/.test(it.style.transform)),
        });
      }
      return seen;
    });

    expect(new Set(trace.map((t) => t.active))).toEqual(new Set([3]));
    expect(trace.every((t) => t.shown === "true")).toBe(true);
    // And the dock does not morph on the way: it stays formed throughout.
    expect(trace.every((t) => t.rest)).toBe(true);

    await expect(page.locator("section#contact")).toBeInViewport();
  });

  test("expands a label rightward on hover", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);
    // The capsule is gated behind (hover: hover) and (pointer: fine) on purpose,
    // so there is nothing to assert on a touch-emulated project.
    test.skip(
      !(await page.evaluate(() => matchMedia("(hover: hover) and (pointer: fine)").matches)),
      "no hover hardware"
    );
    await settleAt(page, 900);

    const item = page
      .getByRole("navigation", { name: "On this page" })
      .getByRole("button", { name: "Background" });

    const collapsed = await item.evaluate((el) => el.getBoundingClientRect().width);
    await item.hover();
    await page.waitForTimeout(400);
    const expanded = await item.evaluate((el) => el.getBoundingClientRect().width);

    expect(collapsed).toBeLessThan(40);
    expect(expanded).toBeGreaterThan(collapsed + 40);
  });

  test("keeps its label in the accessible name while collapsed", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);
    await settleAt(page, 900);

    const dock = page.getByRole("navigation", { name: "On this page" });
    for (const name of ["Experience", "Selected Work", "Background", "Contact"]) {
      await expect(dock.getByRole("button", { name })).toBeAttached();
    }
  });

  test("does not swallow clicks meant for the page beneath it", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);
    await settleAt(page, 900);

    // A row on the far left of the content column, with the dock overlaying.
    await page.locator("#button-exp-mnt").click();
    await expect(page.locator("#panel-exp-mnt")).toBeVisible();
  });

  test("never appears below 640px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await open(page);
    await settleAt(page, 900);

    await expect(page.getByRole("navigation", { name: "On this page" })).toBeHidden();
  });

  test("skips the morph entirely when the visitor asks for reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize(DESKTOP);
    await open(page);

    const parked = await settleAt(page, 300);
    const docked = await settleAt(page, 900);

    // Still useful — it appears and it tracks the section — but nothing moves:
    // no transform is ever written, so the dots keep their resting CSS size.
    expect(docked?.shown).toBe("true");
    expect(docked?.opacity).toBe("1");
    expect(parked?.items.every((t) => t === "")).toBe(true);
    expect(docked?.items.every((t) => t === "")).toBe(true);
    expect(docked?.dots.every((t) => t === "")).toBe(true);
    expect(docked?.active).toBe(1);
  });

  test("adds no horizontal overflow once formed", async ({ page }) => {
    for (const width of [640, 768, 1024, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      await open(page);
      await settleAt(page, 900);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
    }
  });
});

test.describe("section dock on a touch tablet", () => {
  test.use({ hasTouch: true, viewport: { width: 834, height: 1112 } });

  test("navigates on a tap rather than only opening a label", async ({ page }) => {
    await open(page);
    await settleAt(page, 900);

    await page
      .getByRole("navigation", { name: "On this page" })
      .getByRole("button", { name: "Contact" })
      .tap();

    await expect(page.locator("section#contact")).toBeInViewport();
  });
});
