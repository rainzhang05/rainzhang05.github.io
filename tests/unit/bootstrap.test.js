import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createPortfolioWindow, runClassicScript, unlockIfPreloaderLocked } from "../helpers/loadPortfolioScripts.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, "../..")
const bootstrapSrc = readFileSync(resolve(REPO_ROOT, "js/bootstrap.js"), "utf8")

function sectionContainersMarkup() {
    return `
        <div id="layout-container"></div>
        <div id="introduction-container"></div>
        <div id="skills-container"></div>
        <div id="experience-container"></div>
        <div id="projects-container"></div>
        <div id="education-container"></div>
        <div id="contact-container"></div>
        <div id="footer-container"></div>
    `
}

describe("bootstrap", () => {
    beforeEach(() => {
        createPortfolioWindow()
        document.body.innerHTML = sectionContainersMarkup()
    })

    afterEach(() => {
        unlockIfPreloaderLocked()
        vi.unstubAllGlobals()
    })

    it("loadSection injects fetched HTML into the requested container", async () => {
        const fetchMock = vi.fn(async () => ({
            ok: true,
            text: async () => "<section>Loaded</section>",
        }))
        vi.stubGlobal("fetch", fetchMock)
        window.fetch = fetchMock
        runClassicScript(window, bootstrapSrc)

        const loaded = await window.loadSection("projects-container", "html/projects.html")

        expect(loaded).toBe(true)
        expect(document.getElementById("projects-container").innerHTML).toContain("Loaded")
    })

    it("loadSection returns false and logs when a fetch fails", async () => {
        const fetchMock = vi.fn(async () => ({ ok: false }))
        const errorSpy = vi.spyOn(window.console, "error").mockImplementation(() => {})
        vi.stubGlobal("fetch", fetchMock)
        window.fetch = fetchMock
        runClassicScript(window, bootstrapSrc)

        const loaded = await window.loadSection("projects-container", "html/projects.html")

        expect(loaded).toBe(false)
        expect(errorSpy).toHaveBeenCalledTimes(1)
        errorSpy.mockRestore()
    })

    it("loadPageSections loads layout first, initializes the theme toggle, and dispatches sectionsLoaded once", async () => {
        const fetchMock = vi.fn(async (path) => ({
            ok: true,
            text: async () => `<section data-path="${path}">${path}</section>`,
        }))
        vi.stubGlobal("fetch", fetchMock)
        window.fetch = fetchMock

        const themeSpy = vi.spyOn(window, "setupThemeToggle").mockImplementation(() => {
            expect(document.getElementById("layout-container").innerHTML).toContain("html/layout.html")
        })

        const sectionsLoadedSpy = vi.fn()
        document.addEventListener("sectionsLoaded", sectionsLoadedSpy)
        runClassicScript(window, bootstrapSrc)

        await window.loadPageSections()

        expect(fetchMock.mock.calls[0][0]).toBe("html/layout.html")
        expect(fetchMock).toHaveBeenCalledTimes(8)
        expect(themeSpy).toHaveBeenCalledTimes(1)
        expect(sectionsLoadedSpy).toHaveBeenCalledTimes(1)

        themeSpy.mockRestore()
    })
})
