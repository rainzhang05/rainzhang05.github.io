import { expect, test } from "@playwright/test";

test("contact form sends to Formspree and shows success state", async ({ page }) => {
  await page.route("**/formspree.io/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" })
  );

  await page.goto("/#contact");

  // Wait for the preloader to dismiss and the contact section to be visible
  const form = page.locator("#contact form");
  await form.waitFor({ state: "visible", timeout: 10_000 });

  // Target the visible Name input by its label, avoiding the hidden honeypot
  const nameInput = form.getByLabel("Name");
  const emailInput = form.getByLabel("Email");
  const messageInput = form.getByLabel("Message");

  await nameInput.click();
  await nameInput.pressSequentially("Rain");
  await emailInput.click();
  await emailInput.pressSequentially("rain@example.com");
  await messageInput.click();
  await messageInput.pressSequentially("Hello from Playwright!");

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
