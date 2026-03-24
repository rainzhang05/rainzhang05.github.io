import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createPortfolioWindow, unlockIfPreloaderLocked } from "../helpers/loadPortfolioScripts.mjs"

describe("intro", () => {
    afterEach(() => {
        unlockIfPreloaderLocked()
        vi.unstubAllGlobals()
    })

    it("animateIntro toggles body classes when no intro elements exist", () => {
        createPortfolioWindow()
        document.body.classList.add("intro-prep")
        document.body.classList.remove("intro-animate")
        window.animateIntro()
        expect(document.body.classList.contains("intro-prep")).toBe(false)
        expect(document.body.classList.contains("intro-animate")).toBe(true)
    })

    it("animateIntro does not run twice when hasIntroAnimated is already set", () => {
        createPortfolioWindow()
        document.body.innerHTML = `<div id="dock"></div>`
        const raf = vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 0)
        window.animateIntro()
        expect(raf).toHaveBeenCalled()
        raf.mockClear()
        window.animateIntro()
        expect(raf).not.toHaveBeenCalled()
        raf.mockRestore()
    })

    it("runIntroSequence starts when fonts.ready is missing", () => {
        createPortfolioWindow()
        const orig = document.fonts
        Reflect.deleteProperty(document, "fonts")
        const mql = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }
        vi.stubGlobal("matchMedia", vi.fn(() => mql))
        const spy = vi.spyOn(window, "animateIntro").mockImplementation((cb) => {
            if (typeof cb === "function") {
                cb()
            }
        })
        const typing = vi.spyOn(window, "initIntroTerminalTyping").mockImplementation(() => {})
        try {
            window.runIntroSequence()
            expect(spy).toHaveBeenCalled()
            expect(typing).toHaveBeenCalled()
        } finally {
            Object.defineProperty(document, "fonts", { value: orig, configurable: true })
            spy.mockRestore()
            typing.mockRestore()
            vi.unstubAllGlobals()
        }
    })
})
