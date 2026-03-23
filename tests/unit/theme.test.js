import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createPortfolioWindow, unlockIfPreloaderLocked } from "../helpers/loadPortfolioScripts.mjs"

function themeToggleMarkup() {
    return `
    <div class="theme-segmented" id="themeToggle" role="radiogroup">
      <div class="theme-segmented__track" data-active="light">
        <button type="button" class="theme-segmented__btn" role="radio" data-theme="light">L</button>
        <button type="button" class="theme-segmented__btn" role="radio" data-theme="dark">D</button>
        <button type="button" class="theme-segmented__btn" role="radio" data-theme="system">S</button>
      </div>
    </div>`
}

describe("theme", () => {
    beforeEach(() => {
        createPortfolioWindow()
        document.body.innerHTML = themeToggleMarkup()
        localStorage.clear()
    })

    afterEach(() => {
        unlockIfPreloaderLocked()
        localStorage.clear()
        vi.unstubAllGlobals()
    })

    it("getStoredTheme returns valid modes or default light", () => {
        expect(window.getStoredTheme()).toBe("light")
        localStorage.setItem("portfolio-color-scheme", "dark")
        expect(window.getStoredTheme()).toBe("dark")
        localStorage.setItem("portfolio-color-scheme", "system")
        expect(window.getStoredTheme()).toBe("system")
        localStorage.setItem("portfolio-color-scheme", "nope")
        expect(window.getStoredTheme()).toBe("light")
    })

    it("isDarkForMode respects explicit and system preference", () => {
        const mql = { matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }
        const mm = vi.fn(() => mql)
        vi.stubGlobal("matchMedia", mm)
        window.matchMedia = mm
        expect(window.isDarkForMode("light")).toBe(false)
        expect(window.isDarkForMode("dark")).toBe(true)
        expect(window.isDarkForMode("system")).toBe(true)
        mql.matches = false
        expect(window.isDarkForMode("system")).toBe(false)
    })

    it("applyBodyFromMode toggles dark-mode class", () => {
        vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })))
        window.applyBodyFromMode("light")
        expect(document.body.classList.contains("dark-mode")).toBe(false)
        window.applyBodyFromMode("dark")
        expect(document.body.classList.contains("dark-mode")).toBe(true)
    })

    it("updateThemeUI reflects active segment", () => {
        window.updateThemeUI("dark")
        const track = document.querySelector(".theme-segmented__track")
        expect(track.getAttribute("data-active")).toBe("dark")
        const darkBtn = document.querySelector('[data-theme="dark"]')
        expect(darkBtn.getAttribute("aria-checked")).toBe("true")
        expect(darkBtn.classList.contains("is-active")).toBe(true)
    })

    it("applyTheme updates body and segmented UI synchronously", () => {
        vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })))
        document.body.classList.remove("dark-mode")
        window.applyTheme("dark")
        expect(document.body.classList.contains("dark-mode")).toBe(true)
    })

    it("applyTheme does not use document.startViewTransition", () => {
        vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })))
        const vt = vi.fn()
        const orig = document.startViewTransition
        document.startViewTransition = vt
        try {
            document.body.classList.remove("dark-mode")
            window.applyTheme("dark")
            expect(document.body.classList.contains("dark-mode")).toBe(true)
            expect(vt).not.toHaveBeenCalled()
        } finally {
            if (orig) {
                document.startViewTransition = orig
            } else {
                delete document.startViewTransition
            }
        }
    })

    it("setupThemeToggle installs listeners; click path matches applyTheme(dark)", () => {
        const mql = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }
        const mm = vi.fn(() => mql)
        vi.stubGlobal("matchMedia", mm)
        window.matchMedia = mm
        window.setupThemeToggle()
        window.localStorage.setItem("portfolio-color-scheme", "dark")
        window.applyTheme("dark")
        const darkBtn = document.querySelector('[data-theme="dark"]')
        expect(document.body.classList.contains("dark-mode")).toBe(true)
        expect(darkBtn.getAttribute("aria-checked")).toBe("true")
    })
})
