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
    const related = page.locator("#panel-exp-feitian button");

    // The authenticator first, then the developer platform, then the demo.
    await expect(related).toHaveText([
      "FIDO2 Software Authenticator",
      "WebAuthn Developer Platform",
      "Authentication Demo Platform",
    ]);

    await related.first().click();

    await expect(page.locator("#button-work-authenticator")).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    await expect(page.locator("#row-work-authenticator")).toBeInViewport();
  });

  test("opens a short row and a tall row at the same speed", async ({ page }) => {
    await page.goto("/");

    /**
     * Opens a row, pauses its transition, and seeks it to fixed times: how far
     * it has come 30 and 60ms in, and how far it has left 100 and 200ms before
     * it stops. Seeking rather than sampling frames, so a slow machine cannot
     * make two rows look different.
     */
    const motion = (id: string) =>
      page.evaluate(async (id) => {
        const panel = document.getElementById("panel-" + id)!;
        const content = panel.firstElementChild!.firstElementChild!;
        document.getElementById("button-" + id)!.click();

        let rows: Animation | undefined;
        for (let i = 0; i < 100 && !rows; i++) {
          await new Promise((r) => setTimeout(r, 10));
          rows = panel
            .getAnimations()
            .find((a) => (a as CSSTransition).transitionProperty === "grid-template-rows");
        }
        rows!.pause();
        const end = Number(rows!.effect!.getComputedTiming().endTime);
        const height = content.scrollHeight;
        const at = (t: number) => {
          rows!.currentTime = t;
          return panel.getBoundingClientRect().height;
        };
        const result = {
          after30: at(30),
          after60: at(60),
          left200: height - at(end - 200),
          left100: height - at(end - 100),
        };
        rows!.finish();
        return result;
      }, id);

    // Wait for both rows to have measured themselves.
    await expect(page.locator("#panel-exp-feitian")).toHaveAttribute("style", /--panel-ease/);
    await expect(page.locator("#panel-work-mnt-platform")).toHaveAttribute("style", /--panel-ease/);

    const short = await motion("exp-feitian");
    const tall = await motion("work-mnt-platform");

    // The tall panel is about twice the height of the short one. When its
    // duration was simply in proportion, it trailed by over 20px after 60ms.
    for (const key of ["after30", "after60", "left200", "left100"] as const) {
      expect(Math.abs(short[key] - tall[key]), key).toBeLessThan(2);
    }
  });

  test("closes a tall row with no wait while its edge is below the fold", async ({ page }) => {
    await page.goto("/");
    const panel = page.locator("#panel-work-mnt-platform");
    await expect(panel).toHaveAttribute("style", /--panel-ease/);

    await page.locator("#button-work-mnt-platform").click();
    await expect
      .poll(() =>
        panel.evaluate(
          (el) => el.getBoundingClientRect().height - el.firstElementChild!.scrollHeight
        )
      )
      .toBeGreaterThan(-1);

    // Its row near the top of the screen, so the panel runs far past the fold.
    const edge = await page.evaluate(async () => {
      const row = document.getElementById("row-work-mnt-platform")!;
      const panel = document.getElementById("panel-work-mnt-platform")!;
      window.scrollTo({
        top: window.scrollY + row.getBoundingClientRect().top - 100,
        behavior: "instant",
      });
      await new Promise((r) => setTimeout(r, 200));
      const fold = document.documentElement.clientHeight;
      const before = panel.getBoundingClientRect().bottom - fold;

      document.getElementById("button-work-mnt-platform")!.click();
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return { before, after: panel.getBoundingClientRect().bottom - fold };
    });

    // It started well below the fold, and two frames in it is already on screen
    // rather than still travelling where nobody can see it.
    expect(edge.before).toBeGreaterThan(200);
    expect(edge.after).toBeLessThanOrEqual(1);
  });

  test("keeps the clicked row in place when the open row above it closes", async ({ page }) => {
    await page.goto("/");
    const above = page.locator("#panel-work-mnt-platform");
    await expect(above).toHaveAttribute("style", /--panel-ease/);

    await page.locator("#button-work-mnt-platform").click();
    await expect
      .poll(() =>
        above.evaluate(
          (el) => el.getBoundingClientRect().height - el.firstElementChild!.scrollHeight
        )
      )
      .toBeGreaterThan(-1);

    const drift = await page.evaluate(async () => {
      const row = document.getElementById("row-work-authenticator")!;
      window.scrollTo({
        top: window.scrollY + row.getBoundingClientRect().top - 300,
        behavior: "instant",
      });
      await new Promise((r) => setTimeout(r, 200));
      const start = row.getBoundingClientRect().top;

      document.getElementById("button-work-authenticator")!.click();
      let worst = 0;
      const t0 = performance.now();
      await new Promise<void>((done) => {
        const frame = () => {
          worst = Math.max(worst, Math.abs(row.getBoundingClientRect().top - start));
          if (performance.now() - t0 < 1000) requestAnimationFrame(frame);
          else done();
        };
        requestAnimationFrame(frame);
      });
      return worst;
    });

    // Without the hold, the panel above collapsing carried it 900px off the top.
    expect(drift).toBeLessThanOrEqual(3);
    await expect(page.locator("#button-work-authenticator")).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  test("is operable from the keyboard", async ({ page }) => {
    await page.goto("/");

    const button = page.locator("#button-exp-mnt");
    await button.focus();
    await page.keyboard.press("Enter");

    await expect(button).toHaveAttribute("aria-expanded", "true");
  });
});
