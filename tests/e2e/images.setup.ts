import { expect, test } from "@playwright/test";

test("finishes cold image transforms before browsers can abort them", async ({ request }) => {
  test.setTimeout(120_000);

  // next start can permanently wedge an uncached transform when its first
  // client disconnects (https://github.com/vercel/next.js/issues/96538).
  // Early arrival tests close pages with image requests still in flight.
  // Finish every srcset candidate first, including widths selected on resize.
  // Use HTTP only: opening a browser here would introduce the same abort race.
  const response = await request.get("/");
  await expect(response).toBeOK();
  const html = await response.text();
  const urls = new Set<string>();
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    for (const [url] of tag.matchAll(/\/_next\/image\?[^"\s<>]+/g)) {
      urls.add(url.replaceAll("&amp;", "&"));
    }
  }
  expect(urls.size, "the home page must expose optimized image candidates").toBeGreaterThan(0);

  // Match the browsers' negotiated format and await each complete body before
  // releasing its connection. Sequential requests avoid saturating CI's CPU.
  for (const url of urls) {
    await test.step(url, async () => {
      const image = await request.get(url, {
        headers: { Accept: "image/webp" },
        timeout: 30_000,
      });
      await expect(image).toBeOK();
      expect(image.headers()["content-type"]).toMatch(/^image\//);
      expect((await image.body()).length).toBeGreaterThan(0);
      await image.dispose();
    });
  }
});
