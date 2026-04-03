import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createPortfolioWindow, unlockIfPreloaderLocked } from "../helpers/loadPortfolioScripts.mjs"

describe("shared utils", () => {
    beforeEach(() => {
        createPortfolioWindow({ url: "http://localhost:8080/path/" })
    })

    afterEach(() => {
        unlockIfPreloaderLocked()
        vi.unstubAllGlobals()
    })

    it("getDocumentScrollTop resolves the active scroll offset", () => {
        Object.defineProperty(document, "scrollingElement", {
            value: { scrollTop: 240 },
            configurable: true,
        })
        vi.spyOn(window, "scrollY", "get").mockReturnValue(0)

        expect(window.getDocumentScrollTop()).toBe(240)
    })

    it("ensureIntroTextSpan creates and reuses the intro text span", () => {
        document.body.innerHTML = `<div id="introGreeting"></div>`
        const greeting = document.getElementById("introGreeting")

        const first = window.ensureIntroTextSpan(greeting)
        const second = window.ensureIntroTextSpan(greeting)

        expect(first).toBe(second)
        expect(first.classList.contains("txt")).toBe(true)
    })

    it("primeIntroTextSpan keeps the intro span ready with the caret hidden", () => {
        document.body.innerHTML = `<div id="introGreeting"><span class="txt is-caret-active">Hi</span></div>`
        const greeting = document.getElementById("introGreeting")

        const primed = window.primeIntroTextSpan(greeting)

        expect(primed.classList.contains("is-caret-hidden")).toBe(true)
        expect(primed.classList.contains("is-caret-active")).toBe(false)
    })

    it("normalizeAssetUrl and parseSrcsetUrls normalize preload inputs", () => {
        expect(window.normalizeAssetUrl("/icons/mail.png")).toBe("http://localhost:8080/icons/mail.png")
        expect(window.normalizeAssetUrl("not a url")).toBe("http://localhost:8080/path/not%20a%20url")
        expect(window.parseSrcsetUrls("/a.png 1x, /b.png 2x")).toEqual(["/a.png", "/b.png"])
    })
})
