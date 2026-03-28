import { expect, test } from "@playwright/test"

async function getPageScrollState(page) {
    return await page.evaluate(() => {
        const footer = document.querySelector(".site-footer")
        return {
            scrollTop:
                window.scrollY ||
                window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0,
            footerTop: footer ? footer.getBoundingClientRect().top : null,
        }
    })
}

async function scrollPageToBottom(page) {
    await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = "auto"
        document.body.style.scrollBehavior = "auto"

        const bottom = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
        document.documentElement.scrollTop = bottom
        document.body.scrollTop = bottom
        window.scrollTo(0, bottom)
    })
}

test.describe("portfolio (static server)", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/")
        await page.waitForFunction(() => document.body.classList.contains("preloading-complete"), null, {
            timeout: 30_000,
        })
        await expect(page.locator("#load-gate")).toHaveCount(0)
    })

    test("dock and primary sections render", async ({ page }) => {
        await expect(page.locator("#dock")).toBeVisible()
        await expect(page.locator("h2#projects")).toBeVisible()
        await expect(page.getByRole("heading", { name: "Contact Me" })).toBeVisible()
    })

    test("theme toggle works while the preload gate is still active", async ({ page }) => {
        await page.route("**/images/portfolio-photo.png", async (route) => {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            await route.continue()
        })

        await page.goto("/", { waitUntil: "domcontentloaded" })
        await expect(page.locator("#themeToggle")).toBeVisible()
        await expect
            .poll(() => page.evaluate(() => document.body.classList.contains("preloading-complete")))
            .toBe(false)

        await page.locator('#themeToggle [data-theme="dark"]').click()
        await expect(page.locator("body")).toHaveClass(/dark-mode/)
    })

    test("intro terminal remains stable right before line-1 typing starts", async ({ page }) => {
        await page.goto("/")

        const movement = await page.evaluate(async () => {
            let terminal = null
            let greeting = null
            const samples = []
            const startedAt = performance.now()
            let sampleStartedAt = null
            let firstCharAt = null

            const delta = (list, key) => {
                const values = list.map((item) => item[key])
                return Math.max(...values) - Math.min(...values)
            }

            return new Promise((resolve) => {
                const capture = (now) => {
                    if (!terminal || !greeting) {
                        terminal = document.querySelector("#introTerminal")
                        greeting = document.querySelector("#introGreeting")
                        if (terminal && greeting && sampleStartedAt === null) {
                            sampleStartedAt = now
                        }
                    }

                    if (terminal && greeting) {
                        const rect = terminal.getBoundingClientRect()
                        const greetingLength = (greeting.textContent || "").length

                        samples.push({
                            now,
                            width: rect.width,
                            height: rect.height,
                            top: rect.top,
                            left: rect.left,
                            greetingLength,
                        })

                        if (firstCharAt === null && greetingLength > 0) {
                            firstCharAt = now
                        }
                    }

                    if (firstCharAt !== null && now > firstCharAt + 48) {
                        const preStart = Math.max(sampleStartedAt ?? startedAt, firstCharAt - 180)
                        const preEnd = firstCharAt - 20
                        const preWindowSamples = samples.filter(
                            (sample) => sample.now >= preStart && sample.now <= preEnd
                        )

                        resolve({
                            sampleCount: preWindowSamples.length,
                            deltaWidth: preWindowSamples.length ? delta(preWindowSamples, "width") : Infinity,
                            deltaHeight: preWindowSamples.length ? delta(preWindowSamples, "height") : Infinity,
                            deltaTop: preWindowSamples.length ? delta(preWindowSamples, "top") : Infinity,
                            deltaLeft: preWindowSamples.length ? delta(preWindowSamples, "left") : Infinity,
                        })
                        return
                    }

                    if (now - startedAt > 8_000) {
                        resolve(null)
                        return
                    }

                    requestAnimationFrame(capture)
                }

                requestAnimationFrame(capture)
            })
        })

        expect(movement).not.toBeNull()
        expect(movement.sampleCount).toBeGreaterThan(4)
        expect(movement.deltaWidth).toBeLessThan(1.2)
        expect(movement.deltaHeight).toBeLessThan(1.2)
        expect(movement.deltaTop).toBeLessThan(1.2)
        expect(movement.deltaLeft).toBeLessThan(1.2)
    })

    test("intro terminal stays stable during the greeting-to-typer caret handoff", async ({ page }) => {
        await page.waitForSelector("#introGreeting .intro-terminal__line1-static", { timeout: 15_000 })

        const movement = await page.evaluate(async () => {
            const terminal = document.querySelector("#introTerminal")
            if (!terminal) {
                return null
            }

            const sampleDurationMs = 320

            return new Promise((resolve) => {
                const samples = []
                const startedAt = performance.now()

                const capture = (now) => {
                    const rect = terminal.getBoundingClientRect()
                    samples.push({
                        width: rect.width,
                        height: rect.height,
                        top: rect.top,
                        left: rect.left,
                    })

                    if (now - startedAt >= sampleDurationMs) {
                        const delta = (key) => {
                            const values = samples.map((sample) => sample[key])
                            return Math.max(...values) - Math.min(...values)
                        }

                        resolve({
                            sampleCount: samples.length,
                            deltaWidth: delta("width"),
                            deltaHeight: delta("height"),
                            deltaTop: delta("top"),
                            deltaLeft: delta("left"),
                        })
                        return
                    }

                    requestAnimationFrame(capture)
                }

                requestAnimationFrame(capture)
            })
        })

        expect(movement).not.toBeNull()
        expect(movement.sampleCount).toBeGreaterThan(5)
        expect(movement.deltaWidth).toBeLessThan(1.2)
        expect(movement.deltaHeight).toBeLessThan(1.2)
        expect(movement.deltaTop).toBeLessThan(1.2)
        expect(movement.deltaLeft).toBeLessThan(1.2)
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

    test("page scrolls with wheel input after preloading completes", async ({ page }) => {
        const before = await getPageScrollState(page)

        await page.mouse.move(700, 500)
        await page.mouse.wheel(0, 1200)
        await page.waitForTimeout(250)

        const after = await getPageScrollState(page)
        expect(after.scrollTop).toBeGreaterThan(before.scrollTop)
    })

    test("theme toggle keeps the viewport anchored near the footer", async ({ page }) => {
        await scrollPageToBottom(page)
        const before = await getPageScrollState(page)

        await page.locator('#themeToggle [data-theme="dark"]').click()
        const afterDark = await getPageScrollState(page)
        expect(afterDark.scrollTop).toBe(before.scrollTop)
        expect(afterDark.footerTop).toBe(before.footerTop)

        await page.locator('#themeToggle [data-theme="light"]').click()
        const afterLight = await getPageScrollState(page)
        expect(afterLight.scrollTop).toBe(before.scrollTop)
        expect(afterLight.footerTop).toBe(before.footerTop)
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
