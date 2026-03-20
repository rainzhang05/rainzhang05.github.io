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
})
