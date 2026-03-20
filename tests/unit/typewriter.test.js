import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createPortfolioWindow, unlockIfPreloaderLocked } from "../helpers/loadPortfolioScripts.mjs"

describe("TypeWriter", () => {
    beforeEach(() => {
        vi.useFakeTimers()
        createPortfolioWindow()
        document.body.innerHTML = `<span id="introName"></span>`
    })

    afterEach(() => {
        vi.useRealTimers()
        unlockIfPreloaderLocked()
        delete window.activeTypewriter
    })

    it("initTypewriter drives cycling text on #introName", () => {
        window.initTypewriter()
        const el = document.getElementById("introName")
        expect(window.activeTypewriter).toBeDefined()
        for (let i = 0; i < 60; i++) {
            vi.advanceTimersByTime(150)
        }
        expect(el.innerHTML).toMatch(/txt/)
    })

    it("second initTypewriter replaces activeTypewriter", () => {
        window.initTypewriter()
        const first = window.activeTypewriter
        window.initTypewriter()
        expect(window.activeTypewriter).not.toBe(first)
    })
})
