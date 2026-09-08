import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const DESKTOP = { width: 1440, height: 900 };

/** goto, then wait for hydration to put the dock in the DOM — it is a client
 *  component, so it is not in the served HTML. */
async function open(page: Page, url = "/") {
  await page.goto(url);
  await page.locator(".section-dock").waitFor({ state: "attached" });
}

/**
 * Scroll there, then poll until the drawn state has been identical for several
 * consecutive frames. The entrance is a 540ms CSS sequence and the lens glides
 * between sections on a 0.32s time constant, so this is a self-calibrating
 * "everything has finished" detector — never a wall-clock guess.
 */
async function settleAt(page: Page, y: number) {
  return page.evaluate(async (top) => {
    const nav = document.querySelector<HTMLElement>(".section-dock");
    if (!nav) return null;
    const items = [...nav.querySelectorAll<HTMLElement>(".dock-item")];
    const dots = [...nav.querySelectorAll<HTMLElement>(".dock-dot")];
    const read = () =>
      JSON.stringify({
        visibility: getComputedStyle(nav).visibility,
        opacity: items.map((i) => getComputedStyle(i).opacity),
        dots: dots.map((d) => d.style.transform.replace(/\s+/g, "")),
      });

    window.scrollTo({ top, behavior: "instant" });

    let previous = "";
    let stable = 0;
    for (let i = 0; i < 300 && (i < 40 || stable < 6); i += 1) {
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      const now = read();
      stable = now === previous ? stable + 1 : 0;
      previous = now;
    }

    return {
      motion: previous,
      shown: nav.dataset.shown,
      visibility: getComputedStyle(nav).visibility,
      opacity: items.map((i) => getComputedStyle(i).opacity),
      dots: dots.map((d) => d.style.transform.replace(/\s+/g, "")),
      active: items.findIndex((i) => i.dataset.active === "true"),
      open: items.findIndex((i) => i.dataset.open === "true"),
    };
  }, y);
}

const allVisible = (opacity: string[] | undefined) =>
  (opacity ?? []).length === 5 && (opacity ?? []).every((o) => Number(o) === 1);

test.describe("section dock", () => {
  test("is out of the way at the top and fully formed once the bar has gone", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);

    const top = await settleAt(page, 0);
    expect(top?.shown).toBe("false");
    // The real claim: not merely transparent, but out of hit-testing, out of
    // the tab order and out of the accessibility tree.
    expect(top?.visibility).toBe("hidden");

    const docked = await settleAt(page, 900);
    expect(docked?.shown).toBe("true");
    expect(docked?.visibility).toBe("visible");
    expect(allVisible(docked?.opacity)).toBe(true);
  });

  test("unfurls its spine and lifts the bubbles in from the middle outward", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);
    await settleAt(page, 900);

    const choreography = await page.evaluate(() => {
      const nav = document.querySelector<HTMLElement>(".section-dock")!;
      const items = [...nav.querySelectorAll<HTMLElement>(".dock-item")];
      const first = getComputedStyle(items[0]);
      return {
        spine: getComputedStyle(nav, "::before").transform,
        property: first.transitionProperty,
        steps: items.map((i) => i.style.getPropertyValue("--dock-d").trim()),
        stepsOut: items.map((i) => i.style.getPropertyValue("--dock-d-out").trim()),
        delays: items.map((i) => getComputedStyle(i).transitionDelay.split(",")[0].trim()),
      };
    });

    // The declaration, not a mid-flight sample: a fraction of a transition is
    // timing-dependent and would flake.
    expect(choreography.property).toContain("opacity");
    expect(choreography.property).toContain("transform");
    expect(choreography.steps).toEqual(["2", "1", "0", "1", "2"]);
    expect(choreography.stepsOut).toEqual(["0", "1", "2", "1", "0"]);
    // Entering, the middle bubble goes first and the ends go last.
    expect(choreography.delays[2]).toBe("0s");
    expect(choreography.delays[0]).toBe(choreography.delays[4]);
    expect(choreography.delays[0]).not.toBe("0s");
    // The spine is drawn, not collapsed. scaleY(0) would end ",0,0,0)".
    expect(choreography.spine).not.toBe("none");
    expect(choreography.spine).toContain("matrix(1, 0, 0, 1");
  });

  test("settles into the same state whichever direction it arrives from", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);

    await settleAt(page, 0);
    const fromAbove = await settleAt(page, 900);

    await settleAt(page, 4000);
    const fromBelow = await settleAt(page, 900);

    expect(fromBelow?.motion).toEqual(fromAbove?.motion);
    expect(fromBelow?.active).toBe(fromAbove?.active);
  });

  test("holds its visibility across the boundary instead of flickering", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);

    // Derive the probe from the real threshold rather than hardcoding it.
    const probe = await page.evaluate(() => {
      const header = document.querySelector("header") as HTMLElement;
      let y = 0;
      let node: HTMLElement | null = header;
      while (node) {
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return y + header.offsetHeight + 16; // inside the 8..24 band
    });

    await settleAt(page, 0);
    expect((await settleAt(page, probe))?.shown).toBe("false");

    await settleAt(page, 900);
    expect((await settleAt(page, probe))?.shown).toBe("true");
  });

  test("arrives fully formed after a fling past every section", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);

    await settleAt(page, 0);
    const flung = await settleAt(page, 4000);

    expect(flung?.shown).toBe("true");
    expect(allVisible(flung?.opacity)).toBe(true);
  });

  test("is already formed, and never animates, when the page loads past the threshold", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);

    // Put the page past the threshold before React hydrates, which is what a
    // refresh mid-page or a restored session does.
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () =>
        window.scrollTo({ top: 1500, behavior: "instant" })
      );
    });
    await page.goto("/");
    await page.locator(".section-dock").waitFor({ state: "attached" });

    // Read at a moment when the correct answer is definitionally the endpoint:
    // if the entrance were running, opacity would still be climbing here.
    const first = await page.evaluate(() => {
      const nav = document.querySelector<HTMLElement>(".section-dock")!;
      const items = [...nav.querySelectorAll<HTMLElement>(".dock-item")];
      return {
        scrollY: Math.round(window.scrollY),
        shown: nav.dataset.shown,
        visibility: getComputedStyle(nav).visibility,
        opacity: items.map((i) => getComputedStyle(i).opacity),
      };
    });

    expect(first.scrollY).toBeGreaterThan(1000);
    expect(first.shown).toBe("true");
    expect(first.visibility).toBe("visible");
    expect(allVisible(first.opacity)).toBe(true);
  });

  test("settles into the dock after a hash link glides down the page", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page, "/#contact");

    // #contact is the last section and the page runs out of scroll before its
    // top reaches the viewport top, so wait for the glide to stop rather than
    // for a position. Scrolling it ourselves would cut it short.
    await page.waitForFunction(() => {
      const w = window as unknown as { __y?: number; __still?: number };
      const y = Math.round(window.scrollY);
      w.__still = y === w.__y ? (w.__still ?? 0) + 1 : 0;
      w.__y = y;
      return y > 1000 && (w.__still ?? 0) > 3;
    });

    const state = await settleAt(page, await page.evaluate(() => window.scrollY));
    expect(state?.shown).toBe("true");
    expect(allVisible(state?.opacity)).toBe(true);
    expect(state?.active).toBe(4);
  });

  test("tracks the section being read", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);

    // Introduction's own top is 64, which sits in the band where the dock is
    // still hidden, so it is checked from the first place the dock exists.
    const intro = await settleAt(page, 200);
    expect(intro?.active, "active while still in the intro").toBe(0);

    const ids = ["experience", "work", "background", "contact"];
    for (const [offset, id] of ids.entries()) {
      // Land with the section's top just above the 45% line, whatever its height.
      const target = await page.evaluate((section) => {
        const el = document.getElementById(section);
        if (!el) return 0;
        const top = el.getBoundingClientRect().top + window.scrollY;
        return Math.max(0, top - document.documentElement.clientHeight * 0.45 + 10);
      }, id);
      const state = await settleAt(page, target);
      expect(state?.active, `active while reading #${id}`).toBe(offset + 1);
    }
  });

  test("navigates from a dock bubble without flickering through the sections", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);
    await settleAt(page, 900);

    const dock = page.getByRole("navigation", { name: "On this page" });
    await dock.getByRole("button", { name: "Contact" }).click();

    // Watch the whole glide: the click starts a smooth scroll that fires the
    // scroll handler continuously, and the focus index must sit on the
    // destination the whole way rather than sweeping through the sections.
    const trace = await page.evaluate(async () => {
      const nav = document.querySelector<HTMLElement>(".section-dock")!;
      const items = [...nav.querySelectorAll<HTMLElement>(".dock-item")];
      const seen: { active: number; shown?: string }[] = [];
      for (let i = 0; i < 60; i += 1) {
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        seen.push({
          active: items.findIndex((it) => it.dataset.active === "true"),
          shown: nav.dataset.shown,
        });
      }
      return seen;
    });

    expect(new Set(trace.map((t) => t.active))).toEqual(new Set([4]));
    expect(trace.every((t) => t.shown === "true")).toBe(true);

    await expect(page.locator("section#contact")).toBeInViewport();
  });

  test("returns to the top of the page, and retires when it gets there", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);
    await settleAt(page, 1200);

    await page
      .getByRole("navigation", { name: "On this page" })
      .getByRole("button", { name: "Introduction" })
      .click();

    await page.waitForFunction(() => window.scrollY === 0);
    await expect(page.locator("h1")).toBeInViewport();

    // Landing at 0 is below the hide threshold, so the dock dismisses itself.
    await expect
      .poll(async () =>
        page.evaluate(() => document.querySelector<HTMLElement>(".section-dock")?.dataset.shown)
      )
      .toBe("false");
  });

  test("opens the label as the pointer approaches from the right", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);
    const supported = await page.evaluate(
      () => matchMedia("(hover: hover) and (pointer: fine)").matches
    );
    test.skip(!supported, "no hover hardware");
    await settleAt(page, 900);

    const geometry = await page.evaluate(() => {
      const nav = document.querySelector<HTMLElement>(".section-dock")!;
      const item = nav.querySelector<HTMLElement>(".dock-item")!;
      const box = item.getBoundingClientRect();
      const style = getComputedStyle(document.documentElement);
      const inset = parseFloat(style.getPropertyValue("--dock-inset"));
      const hit = parseFloat(style.getPropertyValue("--dock-hit"));
      return { right: inset + hit, y: box.top + box.height / 2 };
    });

    // Well clear of the button, still inside the reach.
    await page.mouse.move(geometry.right + 70, geometry.y);
    await expect
      .poll(async () =>
        page.evaluate(() => document.querySelector<HTMLElement>(".dock-item")?.dataset.open)
      )
      .toBe("true");

    // And nothing extra became clickable on the way: proximity is a
    // measurement, not a hit target.
    const underneath = await page.evaluate((x) => {
      const el = document.elementFromPoint(x, 200);
      return el?.closest(".section-dock") === null;
    }, geometry.right + 70);
    expect(underneath).toBe(true);
  });

  test("expands a label rightward on hover", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);
    const supported = await page.evaluate(
      () => matchMedia("(hover: hover) and (pointer: fine)").matches
    );
    test.skip(!supported, "no hover hardware");
    await settleAt(page, 900);

    const item = page
      .getByRole("navigation", { name: "On this page" })
      .getByRole("button", { name: "Background" });

    const hit = await page.evaluate(() =>
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--dock-hit"))
    );
    const width = () => item.evaluate((el) => el.getBoundingClientRect().width);

    const collapsed = await width();
    await item.hover();
    await expect.poll(width).toBeGreaterThan(collapsed + 40);

    expect(collapsed).toBeCloseTo(hit, 0);
  });

  test("keeps its label in the accessible name while collapsed", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);
    await settleAt(page, 900);

    const dock = page.getByRole("navigation", { name: "On this page" });
    for (const name of ["Introduction", "Experience", "Selected Work", "Background", "Contact"]) {
      await expect(dock.getByRole("button", { name })).toBeAttached();
    }
  });

  test("does not swallow clicks meant for the page beneath it", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await open(page);
    await settleAt(page, 900);

    await page.locator("#button-exp-mnt").click();
    await expect(page.locator("#panel-exp-mnt")).toBeVisible();
  });

  test("never appears below 640px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await open(page);
    await settleAt(page, 900);

    await expect(page.getByRole("navigation", { name: "On this page" })).toBeHidden();
  });

  test("appears without animating when the visitor asks for reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize(DESKTOP);
    await open(page);

    const docked = await settleAt(page, 900);

    // Still useful — it appears and it tracks the section — but the frame loop
    // never runs, so no dot is ever given a size. The global !important reset
    // handles the CSS half; this is the half it cannot reach.
    expect(docked?.shown).toBe("true");
    expect(docked?.visibility).toBe("visible");
    expect(docked?.dots.every((t) => t === "")).toBe(true);
    expect(docked?.active).toBe(2);
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
