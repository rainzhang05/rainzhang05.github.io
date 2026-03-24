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

    it("applyIntroTerminalReducedMotion fills greeting and first cycling line", () => {
        document.body.innerHTML = `<span id="introGreeting"></span><p id="introName"></p>`
        window.applyIntroTerminalReducedMotion()
        expect(document.getElementById("introGreeting").textContent).toBe("Hello, I'm Rain Zhang")
        expect(document.getElementById("introGreeting").innerHTML).toContain("intro-terminal__line1-static")
        expect(document.getElementById("introName").innerHTML).toContain("Computer Science undergraduate")
    })

    it("initIntroTerminalTyping types greeting then starts typewriter on introName", async () => {
        document.body.innerHTML = `<span id="introGreeting"></span><p id="introName"></p>`
        const p = window.initIntroTerminalTyping()
        await vi.advanceTimersByTimeAsync(3400)
        await p
        expect(document.getElementById("introGreeting").textContent).toBe("Hello, I'm Rain Zhang")
        expect(document.getElementById("introGreeting").innerHTML).toContain("intro-terminal__line1-static")
        expect(window.activeTypewriter).toBeDefined()
        await vi.advanceTimersByTimeAsync(3000)
        expect(document.getElementById("introName").innerHTML).toMatch(/txt/)
    })

    it("initIntroTerminalTyping keeps stable spans across the line-1 to line-2 caret handoff", async () => {
        document.body.innerHTML = `
            <span id="introGreeting"><span class="txt is-caret-hidden"></span></span>
            <p id="introName"><span class="txt is-caret-hidden"></span></p>
        `

        const greetingSpan = document.querySelector("#introGreeting .txt")
        const nameSpan = document.querySelector("#introName .txt")

        const p = window.initIntroTerminalTyping()

        await vi.advanceTimersByTimeAsync(3400)
        await p

        const greetingAfterHandoff = document.querySelector("#introGreeting span")
        const nameAfterHandoff = document.querySelector("#introName span")

        expect(greetingAfterHandoff).toBe(greetingSpan)
        expect(nameAfterHandoff).toBe(nameSpan)
        expect(greetingAfterHandoff.classList.contains("intro-terminal__line1-static")).toBe(true)
        expect(greetingAfterHandoff.classList.contains("is-caret-hidden")).toBe(true)
        expect(nameAfterHandoff.classList.contains("is-caret-active")).toBe(true)

        expect(document.querySelector("#introGreeting span")).toBe(greetingSpan)
        expect(document.querySelector("#introName span")).toBe(nameSpan)
    })
})
