import { expect, test } from "@playwright/test"

test.describe("portfolio (static server)", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/")
        await page.waitForFunction(() => document.body.classList.contains("preloading-complete"), null, {
            timeout: 30_000,
        })
        await expect(page.locator("#preloader")).toHaveCount(0)
    })

    test("dock and primary sections render", async ({ page }) => {
        await expect(page.locator("#dock")).toBeVisible()
        await expect(page.locator("h2#projects")).toBeVisible()
        await expect(page.getByRole("heading", { name: "Contact Me" })).toBeVisible()
    })

    test("project modal opens from card title and closes with Escape", async ({ page }) => {
        const firstTitle = page.locator(".project-card .project-header h3").first()
        await firstTitle.click()
        await expect(page.locator(".project-modal-overlay.active")).toBeVisible()
        await expect(page.locator(".project-modal[role='dialog']")).toBeVisible()
        await page.keyboard.press("Escape")
        await expect(page.locator(".project-modal-overlay")).toHaveCount(0)
    })

    test("theme segmented control toggles dark class", async ({ page }) => {
        await page.locator('#themeToggle [data-theme="dark"]').click()
        await expect(page.locator("body")).toHaveClass(/dark-mode/)
        await page.locator('#themeToggle [data-theme="light"]').click()
        await expect(page.locator("body")).not.toHaveClass(/dark-mode/)
    })

    test("hash link to #skills reveals skills heading", async ({ page }) => {
        await page.goto("/#skills")
        await page.waitForFunction(() => document.body.classList.contains("preloading-complete"), null, {
            timeout: 30_000,
        })
        await expect(page.locator("#skills-section")).not.toHaveAttribute("inert")
        await expect(page.getByRole("heading", { name: "Skills" }).first()).toBeVisible()
    })

    test("contact form validation blocks empty submit", async ({ page }) => {
        page.once("dialog", (d) => {
            expect(d.message()).toContain("fill in all fields")
            d.dismiss()
        })
        await page.locator("#contactForm").evaluate((form) => {
            form.querySelectorAll("[required]").forEach((el) => el.removeAttribute("required"))
            form.querySelector("#name").value = ""
            form.querySelector("#email").value = ""
            form.querySelector("#message").value = ""
            form.requestSubmit()
        })
        await expect(page.locator("#successMessage")).not.toBeVisible()
    })

    test("contact form success path with mocked Formspree", async ({ page }) => {
        await page.route("https://formspree.io/**", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ ok: true }),
            })
        })
        await page.fill("#name", "Test User")
        await page.fill("#email", "test@example.com")
        await page.fill("#message", "Hello from Playwright")
        await page.locator("#contactForm").evaluate((form) => form.requestSubmit())
        await expect(page.locator("#successMessage")).toBeVisible({ timeout: 10_000 })
    })
})
