import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createPortfolioWindow, unlockIfPreloaderLocked } from "../helpers/loadPortfolioScripts.mjs"

describe("dock", () => {
    beforeEach(() => {
        createPortfolioWindow({ url: "http://localhost:8080/page" })
    })

    afterEach(() => {
        unlockIfPreloaderLocked()
    })

    it("isSameOriginImage accepts same-origin URLs and rejects cross-origin or invalid", () => {
        expect(window.isSameOriginImage("/icons/a.png")).toBe(true)
        expect(window.isSameOriginImage("http://localhost:8080/icons/a.png")).toBe(true)
        expect(window.isSameOriginImage("https://evil.example/x.png")).toBe(false)
        expect(window.isSameOriginImage("http://a b.com/x.png")).toBe(false)
    })

    it("normalizeDockIcons skips theme-icon and already-normalized images", () => {
        document.body.innerHTML = `
      <div id="dock">
        <a class="dock-item"><img class="theme-icon" src="http://localhost:8080/icons/x.png" alt=""></a>
        <a class="dock-item"><img data-normalized="true" src="http://localhost:8080/icons/y.png" alt=""></a>
      </div>`
        const dock = document.getElementById("dock")
        const imgs = [...dock.querySelectorAll("img")]
        window.normalizeDockIcons(dock)
        expect(imgs[0].src).toContain("x.png")
        expect(imgs[1].src).toContain("y.png")
    })

    it("normalizeDockIcons skips incomplete cross-origin src", () => {
        document.body.innerHTML = `
      <div id="dock">
        <a class="dock-item"><img src="https://api.iconify.design/x.svg" alt=""></a>
      </div>`
        const dock = document.getElementById("dock")
        const img = dock.querySelector("img")
        window.normalizeDockIcons(dock)
        expect(img.src).toContain("iconify")
    })

    it("setupDockHoverEffects calls normalize when dock exists", () => {
        document.body.innerHTML = `<div id="dock"><a class="dock-item"><img src="x" alt=""></a></div>`
        const spy = vi.spyOn(window, "normalizeDockIcons")
        window.setupDockHoverEffects()
        expect(spy).toHaveBeenCalled()
        spy.mockRestore()
    })

    it("setupDockHoverEffects no-ops without dock", () => {
        document.body.innerHTML = ""
        const spy = vi.spyOn(window, "normalizeDockIcons")
        window.setupDockHoverEffects()
        expect(spy).not.toHaveBeenCalled()
        spy.mockRestore()
    })
})
