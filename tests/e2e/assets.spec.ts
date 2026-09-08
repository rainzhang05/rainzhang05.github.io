import { expect, test } from "@playwright/test";

/**
 * The marks are the original files from the previous site; the two resumes are
 * the PDFs the resume page offers for download.
 * These serve straight from public/, so a rename or a missed file is a 404.
 */
const files = [
  "/rain-zhang-resume.pdf",
  "/rain-zhang-resume-ja.pdf",
  "/logos/feitian.svg",
  "/logos/mnt-realty.svg",
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

  test("keeps the company logos in their own colours", async ({ request }) => {
    // The design export stripped these <style> blocks, which would have made
    // both logos render black. These assertions guard the original files.
    const feitian = await (await request.get("/logos/feitian.svg")).text();
    expect(feitian).toContain("#0075C9");

    const mnt = await (await request.get("/logos/mnt-realty.svg")).text();
    expect(mnt).toContain("#106CB0");
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
