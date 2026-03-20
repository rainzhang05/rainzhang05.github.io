import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createPortfolioWindow, unlockIfPreloaderLocked } from "../helpers/loadPortfolioScripts.mjs"

describe("preloader and initPage", () => {
    afterEach(() => {
        unlockIfPreloaderLocked()
        vi.unstubAllGlobals()
        vi.useRealTimers()
    })

    it("removeHash calls history.pushState with path without hash", () => {
        createPortfolioWindow({ url: "http://localhost:8080/foo#bar" })
        const push = vi.spyOn(window.history, "pushState").mockImplementation(() => {})
        window.removeHash()
        expect(push).toHaveBeenCalled()
        const args = push.mock.calls[0]
        expect(String(args[2] || "")).not.toContain("#")
        push.mockRestore()
    })

    it("initPage runs once and wires feature setup functions", () => {
        vi.useFakeTimers()
        createPortfolioWindow()
        document.body.innerHTML = `
      <div id="preloader"></div>
      <div id="dock"></div>
      <div id="skills-section" class="skills--await-scroll"><h2 id="skills">S</h2></div>
      <form id="contactForm"><input id="name"><input id="email"><textarea id="message"></textarea><button type="submit" id="submitBtn">x</button></form>
      <div id="successMessage" style="display:none"></div>
      <div class="project-card" id="c1"><div class="project-header"><h3>T</h3></div><div class="project-content"></div></div>`

        const runIntro = vi.spyOn(window, "runIntroSequence").mockImplementation(() => {})
        const dock = vi.spyOn(window, "setupDockHoverEffects").mockImplementation(() => {})
        const theme = vi.spyOn(window, "setupThemeToggle").mockImplementation(() => {})
        const hash = vi.spyOn(window, "setupHashLinkBehavior").mockImplementation(() => {})
        const contact = vi.spyOn(window, "setupContactForm").mockImplementation(() => {})
        const cards = vi.spyOn(window, "setupProjectCards").mockImplementation(() => {})
        const links = vi.spyOn(window, "bindOpenProjectLinks").mockImplementation(() => {})
        const skills = vi.spyOn(window, "setupSkillsScrollReveal").mockImplementation(() => {})

        window.initPage()
        window.initPage()

        expect(runIntro).toHaveBeenCalledTimes(1)
        expect(dock).toHaveBeenCalledTimes(1)
        expect(theme).toHaveBeenCalledTimes(1)
        expect(hash).toHaveBeenCalledTimes(1)
        expect(contact).toHaveBeenCalledTimes(1)
        expect(cards).toHaveBeenCalledTimes(1)
        expect(links).toHaveBeenCalledTimes(1)
        expect(skills).toHaveBeenCalledTimes(1)

        ;[
            runIntro,
            dock,
            theme,
            hash,
            contact,
            cards,
            links,
            skills,
        ].forEach((s) => s.mockRestore())
    })

    it("setupSkillsScrollReveal skips wait for #skills initial hash", () => {
        createPortfolioWindow()
        document.body.innerHTML = `<div id="skills-section" class="skills--await-scroll" inert><h2 id="skills">S</h2></div>`
        const mql = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }
        vi.stubGlobal("matchMedia", vi.fn(() => mql))
        window.setupSkillsScrollReveal("#skills")
        const root = document.getElementById("skills-section")
        expect(root.classList.contains("skills--await-scroll")).toBe(false)
        expect(root.hasAttribute("inert")).toBe(false)
    })

    it("revealSkillsSection adds visible class and removes inert", () => {
        createPortfolioWindow()
        document.body.innerHTML = `<div id="skills-section" inert class="skills--await-scroll"></div>`
        window.revealSkillsSection()
        const root = document.getElementById("skills-section")
        expect(root.classList.contains("skills--visible")).toBe(true)
        expect(root.hasAttribute("inert")).toBe(false)
    })

    it("beginPreloadingSequence completes preloading and removes preloader from DOM", async () => {
        createPortfolioWindow()
        document.body.innerHTML = `<div id="preloader"></div><span id="introName"></span>`
        Object.defineProperty(document, "readyState", { value: "complete", configurable: true })
        Object.defineProperty(document, "fonts", {
            value: { ready: Promise.resolve() },
            configurable: true,
        })

        window.beginPreloadingSequence()
        await new Promise((r) => setTimeout(r, 2000))

        expect(document.body.classList.contains("preloading-complete")).toBe(true)
        expect(document.getElementById("preloader")).toBeNull()
    })
})
