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

function stubThemeMedia({ prefersDark = false, reducedMotion = false } = {}) {
    const colorSchemeMql = {
        matches: prefersDark,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    }
    const reducedMotionMql = {
        matches: reducedMotion,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    }
    const mm = vi.fn((query) => {
        if (query === "(prefers-color-scheme: dark)") {
            return colorSchemeMql
        }
        if (query === "(prefers-reduced-motion: reduce)") {
            return reducedMotionMql
        }
        return { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }
    })
    vi.stubGlobal("matchMedia", mm)
    window.matchMedia = mm
    return { colorSchemeMql, reducedMotionMql, mm }
}

function bindWindowTimersToGlobals() {
    window.setTimeout = setTimeout
    window.clearTimeout = clearTimeout
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
        vi.useRealTimers()
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

    it("applyTheme adds a temporary root transition class and removes it after the timeout", () => {
        vi.useFakeTimers()
        bindWindowTimersToGlobals()
        stubThemeMedia()
        window.applyTheme("dark")
        expect(document.body.classList.contains("dark-mode")).toBe(true)
        expect(document.documentElement.classList.contains("theme-transitioning")).toBe(true)
        vi.advanceTimersByTime(299)
        expect(document.documentElement.classList.contains("theme-transitioning")).toBe(true)
        vi.advanceTimersByTime(1)
        expect(document.documentElement.classList.contains("theme-transitioning")).toBe(false)
    })

    it("applyTheme restarts the transition timer on rapid toggles", () => {
        vi.useFakeTimers()
        bindWindowTimersToGlobals()
        stubThemeMedia()
        window.applyTheme("dark")
        vi.advanceTimersByTime(200)
        window.applyTheme("light")
        expect(document.body.classList.contains("dark-mode")).toBe(false)
        expect(document.documentElement.classList.contains("theme-transitioning")).toBe(true)
        vi.advanceTimersByTime(299)
        expect(document.documentElement.classList.contains("theme-transitioning")).toBe(true)
        vi.advanceTimersByTime(1)
        expect(document.documentElement.classList.contains("theme-transitioning")).toBe(false)
    })

    it("applyTheme skips the temporary root transition when reduced motion is enabled", () => {
        stubThemeMedia({ reducedMotion: true })
        window.applyTheme("dark")
        expect(document.body.classList.contains("dark-mode")).toBe(true)
        expect(document.documentElement.classList.contains("theme-transitioning")).toBe(false)
    })

    it("applyTheme uses document.startViewTransition when available", async () => {
        stubThemeMedia()
        const vt = vi.fn((update) => {
            update()
            return {
                finished: Promise.resolve(),
            }
        })
        const orig = document.startViewTransition
        document.startViewTransition = vt
        try {
            document.body.classList.remove("dark-mode")
            const transition = window.applyTheme("dark")
            expect(document.body.classList.contains("dark-mode")).toBe(true)
            expect(vt).toHaveBeenCalledTimes(1)
            expect(document.documentElement.classList.contains("theme-view-transitioning")).toBe(true)
            await transition.finished
            expect(document.documentElement.classList.contains("theme-transitioning")).toBe(false)
        } finally {
            if (orig) {
                document.startViewTransition = orig
            } else {
                delete document.startViewTransition
            }
        }
    })

    it("setupThemeToggle applies the stored theme without animating the initial paint", () => {
        stubThemeMedia({ prefersDark: true })
        localStorage.setItem("portfolio-color-scheme", "dark")
        window.setupThemeToggle()
        expect(document.body.classList.contains("dark-mode")).toBe(true)
        expect(document.documentElement.classList.contains("theme-transitioning")).toBe(false)
    })

    it("setupThemeToggle installs listeners; click path matches applyTheme(dark)", () => {
        vi.useFakeTimers()
        bindWindowTimersToGlobals()
        stubThemeMedia()
        delete document.startViewTransition
        window.setupThemeToggle()
        unlockIfPreloaderLocked()
        const darkBtn = document.querySelector('[data-theme="dark"]')
        darkBtn.click()
        expect(document.body.classList.contains("dark-mode")).toBe(true)
        expect(darkBtn.getAttribute("aria-checked")).toBe("true")
        expect(window.localStorage.getItem("portfolio-color-scheme")).toBe("dark")
        expect(document.documentElement.classList.contains("theme-transitioning")).toBe(true)
        vi.advanceTimersByTime(300)
        expect(document.documentElement.classList.contains("theme-transitioning")).toBe(false)
    })
})
