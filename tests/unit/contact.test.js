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
        alertMock.mockRestore()
    })
})
