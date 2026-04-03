import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createPortfolioWindow, unlockIfPreloaderLocked } from "../helpers/loadPortfolioScripts.mjs"

function minimalCardHtml(id = "project-test") {
    return `
    <div class="project-card" id="${id}">
      <div class="project-header"><h3>Test Project</h3></div>
      <div class="project-content">
        <p class="project-summary">Summary</p>
        <div class="experience-related">Related</div>
        <div class="project-cover">Cover</div>
        <button type="button" class="read-more">More</button>
        <p class="project-description">Body</p>
      </div>
    </div>
    <button type="button" data-open-project="${id}" id="crossOpen">Open</button>`
}

describe("project cards and modal", () => {
    beforeEach(() => {
        createPortfolioWindow()
        vi.stubGlobal("requestAnimationFrame", (cb) => {
            cb(0)
            return 0
        })
        document.body.innerHTML = minimalCardHtml()
    })

    afterEach(() => {
        if (window.activeProjectModal) {
            window.closeProjectModal({ immediate: true })
        }
        unlockIfPreloaderLocked()
        vi.unstubAllGlobals()
    })

    it("setupProjectCards decorates title and openProjectModal works for bound card", () => {
        window.setupProjectCards()
        const title = document.querySelector(".project-header h3")
        expect(title.classList.contains("project-card-title-trigger")).toBe(true)
        expect(title.getAttribute("role")).toBe("button")
        expect(document.getElementById("project-test").dataset.modalBound).toBe("true")

        window.openProjectModal(document.getElementById("project-test"))
        expect(document.querySelector(".project-modal-overlay")).toBeTruthy()
    })

    it("openProjectModal strips summary, experience-related, cover, read-more from clone", () => {
        window.setupProjectCards()
        const card = document.getElementById("project-test")
        window.openProjectModal(card)
        const modal = document.querySelector(".project-modal")
        expect(modal).toBeTruthy()
        expect(modal.querySelector(".project-summary")).toBeNull()
        expect(modal.querySelector(".experience-related")).toBeNull()
        expect(modal.querySelector(".project-cover")).toBeNull()
        expect(modal.querySelector(".read-more")).toBeNull()
        expect(modal.querySelector(".project-description")).toBeTruthy()
    })

    it("closeProjectModal() without immediate uses transition timeout cleanup", async () => {
        window.setupProjectCards()
        window.openProjectModal(document.getElementById("project-test"))
        expect(document.querySelector(".project-modal-overlay")).toBeTruthy()

        window.closeProjectModal()
        await new Promise((r) => setTimeout(r, 450))
        expect(document.querySelector(".project-modal-overlay")).toBeNull()

        window.openProjectModal(document.getElementById("project-test"))
        window.closeProjectModal({ immediate: true })
        expect(document.querySelector(".project-modal-overlay")).toBeNull()
    })

    it("bindOpenProjectLinks marks triggers once", () => {
        window.setupProjectCards()
        window.bindOpenProjectLinks()
        const openBtn = document.getElementById("crossOpen")
        expect(openBtn.dataset.openProjectBound).toBe("true")
    })

    it("closeProjectModal immediate skips transition", () => {
        window.setupProjectCards()
        window.openProjectModal(document.getElementById("project-test"))
        window.closeProjectModal({ immediate: true })
        expect(document.querySelector(".project-modal-overlay")).toBeNull()
    })

    it("restores focus to the last focused element when the modal closes", () => {
        const opener = document.getElementById("crossOpen")
        opener.focus()

        window.setupProjectCards()
        window.openProjectModal(document.getElementById("project-test"))
        window.closeProjectModal({ immediate: true })

        expect(document.activeElement).toBe(opener)
    })

    it("opening a second modal replaces the first overlay immediately", () => {
        document.body.innerHTML = `
            ${minimalCardHtml("project-a")}
            <div class="project-card" id="project-b">
                <div class="project-header"><h3>Project B</h3></div>
                <div class="project-content"><p class="project-description">Body</p></div>
            </div>
        `

        window.setupProjectCards()
        window.openProjectModal(document.getElementById("project-a"))
        window.openProjectModal(document.getElementById("project-b"))

        expect(document.querySelectorAll(".project-modal-overlay").length).toBe(1)
        expect(document.querySelector(".project-modal").getAttribute("data-project-id")).toBe("project-b")
    })
})
