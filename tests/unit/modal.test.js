import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createPortfolioWindow, unlockIfPreloaderLocked } from "../helpers/loadPortfolioScripts.mjs"

describe("modal scroll lock", () => {
    beforeEach(() => {
        createPortfolioWindow()
        document.documentElement.style.paddingRight = ""
        document.body.className = ""
        document.documentElement.className = ""
    })

    afterEach(() => {
        unlockIfPreloaderLocked()
    })

    it("applies and releases scrollbar compensation and modal-open classes", () => {
        const html = document.documentElement
        const innerWidthSpy = vi.spyOn(window, "innerWidth", "get").mockReturnValue(1200)
        const clientWidthSpy = vi.spyOn(html, "clientWidth", "get").mockReturnValue(1180)

        window.applyModalScrollLock()
        expect(html.classList.contains("modal-open")).toBe(true)
        expect(document.body.classList.contains("modal-open")).toBe(true)
        expect(html.style.paddingRight).toBe("20px")

        window.applyModalScrollLock()
        expect(html.style.paddingRight).toBe("20px")

        window.releaseModalScrollLock()
        expect(html.classList.contains("modal-open")).toBe(false)
        expect(document.body.classList.contains("modal-open")).toBe(false)
        expect(html.style.paddingRight).toBe("")

        innerWidthSpy.mockRestore()
        clientWidthSpy.mockRestore()
    })
})
