import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { afterEach, describe, expect, it, vi } from "vitest"
import { createPortfolioWindow, runClassicScript, unlockIfPreloaderLocked } from "../helpers/loadPortfolioScripts.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, "../..")

describe("main.js wiring", () => {
    afterEach(() => {
        unlockIfPreloaderLocked()
    })

    it("sectionsLoaded triggers beginPreloadingSequence once", () => {
        createPortfolioWindow()
        const spy = vi.spyOn(window, "beginPreloadingSequence").mockImplementation(() => {})
        const mainSrc = readFileSync(resolve(REPO_ROOT, "js/main.js"), "utf8")
        runClassicScript(window, mainSrc)

        document.dispatchEvent(new window.CustomEvent("sectionsLoaded"))
        document.dispatchEvent(new window.CustomEvent("sectionsLoaded"))

        expect(spy).toHaveBeenCalledTimes(1)
        spy.mockRestore()
    })

    it("pageshow with persisted restores intro-animate classes", () => {
        createPortfolioWindow()
        const mainSrc = readFileSync(resolve(REPO_ROOT, "js/main.js"), "utf8")
        runClassicScript(window, mainSrc)

        document.body.classList.add("intro-prep")
        document.body.classList.remove("intro-animate")
        const ev = new window.Event("pageshow")
        Object.defineProperty(ev, "persisted", { value: true })
        window.dispatchEvent(ev)

        expect(document.body.classList.contains("intro-prep")).toBe(false)
        expect(document.body.classList.contains("intro-animate")).toBe(true)
    })
})
