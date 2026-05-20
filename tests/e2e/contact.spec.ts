import { expect, test } from "@playwright/test";

test("contact form sends to Formspree and shows success state", async ({ page }) => {
  await page.route("**/formspree.io/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" })
  );

  await page.goto("/#contact");

  const form = page.locator("#contact form");
  // Use pressSequentially so React's onChange fires consistently across
  // chromium / firefox / mobile WebKit (mobile devices with hasTouch can
  // skip change events on .fill() depending on input focus state).
  await form.locator('input[type="text"]').first().click();
  await form.locator('input[type="text"]').first().pressSequentially("Rain");
  await form.locator('input[type="email"]').click();
  await form.locator('input[type="email"]').pressSequentially("rain@example.com");
  await form.locator("textarea").click();
  await form.locator("textarea").pressSequentially("Hello from Playwright!");

  // Submit via the form element directly (rather than clicking the button)
  // so the test works identically across desktop Chromium/Firefox and mobile
  // WebKit, where touch-to-click translation around overlay focus rings can
  // intermittently swallow the click on the submit button.
  await Promise.all([
    page.waitForResponse((res) => res.url().includes("formspree.io")),
    form.evaluate((el) => (el as HTMLFormElement).requestSubmit()),
  ]);

  await expect(page.getByText("Message sent.")).toBeVisible();
});
