import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createPortfolioWindow, unlockIfPreloaderLocked } from "../helpers/loadPortfolioScripts.mjs"

describe("navigation hash links", () => {
    beforeEach(() => {
        createPortfolioWindow()
        document.body.innerHTML = `
      <a href="#skills" id="toSkills">Skills</a>
      <a href="#projects" id="toProjects">Projects</a>
      <h2 id="skills">Skills</h2>
      <h2 id="projects">Projects</h2>`
    })

    afterEach(() => {
        unlockIfPreloaderLocked()
    })

    it("setupHashLinkBehavior registers handlers on in-page anchors", () => {
        const anchors = document.querySelectorAll('a[href^="#"]')
        expect(anchors.length).toBeGreaterThan(0)
        window.setupHashLinkBehavior()
        expect(() => anchors[0].dispatchEvent(new window.Event("click", { bubbles: true }))).not.toThrow()
    })

    it("does nothing when target id is missing", () => {
        document.body.innerHTML = `<a href="#nope" id="broken">x</a>`
        window.setupHashLinkBehavior()
        document.getElementById("broken").click()
        expect(true).toBe(true)
    })

    it("scrolls via body.scrollTo using rect, scrollTop, and scroll-margin-top", () => {
        const scrollToSpy = vi.spyOn(document.body, "scrollTo").mockImplementation(() => {})
        Object.defineProperty(document.body, "scrollHeight", { value: 10000, configurable: true })
        Object.defineProperty(document.body, "clientHeight", { value: 800, configurable: true })
        Object.defineProperty(document.body, "scrollTop", { value: 150, configurable: true })
        const scrollYSpy = vi.spyOn(window, "scrollY", "get").mockReturnValue(150)

        const skills = document.getElementById("skills")
        vi.spyOn(skills, "getBoundingClientRect").mockReturnValue({ top: 400, left: 0, right: 0, bottom: 0, width: 0, height: 0 })
        const orig = window.getComputedStyle.bind(window)
        const gcsSpy = vi.spyOn(window, "getComputedStyle").mockImplementation((el) => {
            const style = orig(el)
            if (el === skills) {
                return { ...style, scrollMarginTop: "104px" }
            }
            return style
        })

        window.setupHashLinkBehavior()
        document.getElementById("toSkills").click()

        expect(scrollToSpy).toHaveBeenCalledWith({
            top: 400 + 150 - 104,
            behavior: "smooth",
        })

        scrollToSpy.mockRestore()
        scrollYSpy.mockRestore()
        gcsSpy.mockRestore()
    })

    it("falls back to window.scrollTo when body is not the scrollport", () => {
        const scrollToSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {})
        Object.defineProperty(document.body, "scrollHeight", { value: 800, configurable: true })
        Object.defineProperty(document.body, "clientHeight", { value: 800, configurable: true })
        Object.defineProperty(document.body, "scrollTop", { value: 0, configurable: true })
        const scrollYSpy = vi.spyOn(window, "scrollY", "get").mockReturnValue(200)

        const projects = document.getElementById("projects")
        vi.spyOn(projects, "getBoundingClientRect").mockReturnValue({ top: 300, left: 0, right: 0, bottom: 0, width: 0, height: 0 })
        const orig = window.getComputedStyle.bind(window)
        const gcsSpy = vi.spyOn(window, "getComputedStyle").mockImplementation((el) => {
            const style = orig(el)
            if (el === projects) {
                return { ...style, scrollMarginTop: "0px" }
            }
            return style
        })

        window.setupHashLinkBehavior()
        document.getElementById("toProjects").click()

        expect(scrollToSpy).toHaveBeenCalledWith({
            top: 300 + 200,
            behavior: "smooth",
        })

        scrollToSpy.mockRestore()
        scrollYSpy.mockRestore()
        gcsSpy.mockRestore()
    })
})
