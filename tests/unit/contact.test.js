import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createPortfolioWindow, unlockIfPreloaderLocked } from "../helpers/loadPortfolioScripts.mjs"

describe("contact form", () => {
    beforeEach(() => {
        createPortfolioWindow()
        document.body.innerHTML = `
      <form id="contactForm" action="https://formspree.io/f/test" method="POST">
        <input id="name" name="name" value="A">
        <input id="email" name="email" value="a@b.co">
        <textarea id="message" name="message">Hi</textarea>
        <button type="submit" id="submitBtn">Send</button>
      </form>
      <div id="successMessage" style="display:none"></div>`
    })

    afterEach(() => {
        unlockIfPreloaderLocked()
        vi.unstubAllGlobals()
    })

    it("alerts when required fields are empty", () => {
        const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {})
        document.getElementById("name").value = ""
        window.setupContactForm()
        document.getElementById("contactForm").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }))
        expect(alertMock).toHaveBeenCalledWith("Please fill in all fields")
        alertMock.mockRestore()
    })

    it("submits via fetch and shows success UI on ok", async () => {
        const fetchMock = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ ok: true }),
            })
        )
        vi.stubGlobal("fetch", fetchMock)
        window.fetch = fetchMock
        window.setupContactForm()
        const form = document.getElementById("contactForm")
        form.requestSubmit?.()
        if (!form.requestSubmit) {
            form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }))
        }
        await vi.waitFor(() => {
            expect(document.getElementById("successMessage").style.display).toBe("block")
        })
        const btn = document.getElementById("submitBtn")
        expect(btn.disabled).toBe(false)
        expect(btn.textContent).toBe("Send")
    })

    it("setupContactForm binds the submit handler only once", async () => {
        const fetchMock = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ ok: true }),
            })
        )
        vi.stubGlobal("fetch", fetchMock)
        window.fetch = fetchMock

        window.setupContactForm()
        window.setupContactForm()

        const form = document.getElementById("contactForm")
        form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }))

        await vi.waitFor(() => {
            expect(fetchMock).toHaveBeenCalledTimes(1)
        })
    })

    it("shows a pending button state and hides the success message again after the success timeout", async () => {
        vi.useFakeTimers()
        window.setTimeout = setTimeout
        window.clearTimeout = clearTimeout

        let resolveFetch
        const fetchMock = vi.fn(() => new Promise((resolve) => {
            resolveFetch = resolve
        }))
        vi.stubGlobal("fetch", fetchMock)
        window.fetch = fetchMock

        window.setupContactForm()
        const form = document.getElementById("contactForm")
        form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }))

        const btn = document.getElementById("submitBtn")
        expect(btn.disabled).toBe(true)
        expect(btn.textContent).toBe("Sending...")

        resolveFetch({
            ok: true,
            json: () => Promise.resolve({ ok: true }),
        })

        await Promise.resolve()
        await vi.waitFor(() => {
            expect(document.getElementById("successMessage").style.display).toBe("block")
        })
        await vi.advanceTimersByTimeAsync(5000)

        expect(document.getElementById("successMessage").style.display).toBe("none")
        expect(btn.disabled).toBe(false)
        expect(btn.textContent).toBe("Send")
    })

    it("alerts on failed response and restores button", async () => {
        const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {})
        const fetchMock = vi.fn(() =>
            Promise.resolve({
                ok: false,
                status: 500,
            })
        )
        vi.stubGlobal("fetch", fetchMock)
        window.fetch = fetchMock
        window.setupContactForm()
        document.getElementById("contactForm").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }))
        await vi.waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith("Failed to send message. Please try again later.")
        })
        expect(document.getElementById("submitBtn").disabled).toBe(false)
        expect(document.getElementById("successMessage").style.display).not.toBe("block")
        alertMock.mockRestore()
    })
})
