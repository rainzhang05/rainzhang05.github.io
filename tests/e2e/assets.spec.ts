import { expect, test } from "./fixtures";

/**
 * The marks are the original files from the previous site; the two resumes are
 * the PDFs the resume page offers for download.
 * These serve straight from public/, so a rename or a missed file is a 404.
 */
const files = [
  "/rain-zhang-resume.pdf",
  "/rain-zhang-resume-ja.pdf",
  "/logos/feitian.png",
  "/logos/mnt-realty.svg",
  "/logos/sfu.png",
  "/tech/rust.png",
  "/tech/nextjs.svg",
  "/tech/microsoft-graph.svg",
  "/projects/webauthn-platform.webp",
];

test.describe("static assets", () => {
  for (const file of files) {
    test(`serves ${file}`, async ({ request }) => {
      const response = await request.get(file);
      expect(response.status(), file).toBe(200);
    });
  }

  test("keeps the company logo in its own colours", async ({ request }) => {
    // The design export stripped this <style> block, which would have made the
    // logo render black. This assertion guards the original file.
    const mnt = await (await request.get("/logos/mnt-realty.svg")).text();
    expect(mnt).toContain("#106CB0");
  });

  test("carries the FEITIAN mark on transparency, not on a white box", async ({ page }) => {
    // The source was a JPEG of blue on white, trimmed and matted to alpha here.
    // On the page's cream background a surviving white field reads as a card,
    // and any left-over padding throws the mark off the shared cap height.
    await page.goto("/");
    const probe = await page.evaluate(async () => {
      const img = new Image();
      img.src = "/logos/feitian.png";
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const at = (x: number, y: number) => Array.from(ctx.getImageData(x, y, 1, 1).data);
      return {
        size: [img.naturalWidth, img.naturalHeight],
        topLeft: at(0, 0),
        bottomRight: at(img.naturalWidth - 1, img.naturalHeight - 1),
        ink: at(Math.round(img.naturalWidth * 0.03), Math.round(img.naturalHeight * 0.3)),
      };
    });

    expect(probe.topLeft[3]).toBe(0);
    expect(probe.bottomRight[3]).toBe(0);
    // Opaque FEITIAN blue, not white and not black.
    expect(probe.ink[3]).toBe(255);
    expect(probe.ink.slice(0, 3)).toEqual([18, 103, 170]);
  });

  test("loads every image the page references", async ({ page }) => {
    const failed: string[] = [];
    page.on("response", (response) => {
      if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`);
    });

    await page.goto("/");
    await page.locator("#button-work-webauthn").click();
    await page.waitForLoadState("networkidle");

    expect(failed).toEqual([]);
  });

  test("serves the favicon", async ({ request }) => {
    const response = await request.get("/icon.svg");
    expect(response.status()).toBe(200);
  });
});
