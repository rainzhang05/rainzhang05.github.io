import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { Window } from "happy-dom"

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, "../..")

/** Matches [index.html](index.html) script order, excluding main.js (event wiring tested separately). */
export const PORTFOLIO_SCRIPT_ORDER = [
    "globals.js",
    "modal.js",
    "preloader.js",
    "intro.js",
    "typewriter.js",
    "dock.js",
    "theme.js",
    "navigation.js",
    "contact.js",
    "projects.js",
]

/**
 * Execute a classic global script in the window realm (same as `<script>` in HTML).
 * @param {import('happy-dom').Window} win
 * @param {string} source
 */
export function runClassicScript(win, source) {
    const doc = win.document
    const el = doc.createElement("script")
    el.textContent = source
    ;(doc.head || doc.documentElement).appendChild(el)
    el.remove()
}

/**
 * Point Node test globals at this window so mixed `globalThis` / `window` access stays consistent.
 * @param {import('happy-dom').Window} win
 */
export function bindGlobalThisToWindow(win) {
    const g = globalThis
    g.window = win
    g.self = win
    g.document = win.document
    g.navigator = win.navigator
    g.location = win.location
    g.history = win.history
    g.localStorage = win.localStorage
    g.sessionStorage = win.sessionStorage
    g.getComputedStyle = win.getComputedStyle.bind(win)
    g.requestAnimationFrame = win.requestAnimationFrame.bind(win)
    g.cancelAnimationFrame = win.cancelAnimationFrame.bind(win)
    g.CustomEvent = win.CustomEvent
    g.Event = win.Event
    g.KeyboardEvent = win.KeyboardEvent
    g.MouseEvent = win.MouseEvent
    g.FocusEvent = win.FocusEvent
    g.WheelEvent = win.WheelEvent
    g.HTMLFormElement = win.HTMLFormElement
    g.HTMLImageElement = win.HTMLImageElement
    g.HTMLCanvasElement = win.HTMLCanvasElement
    g.CanvasRenderingContext2D = win.CanvasRenderingContext2D
    g.Image = win.Image
}

/**
 * Fresh browser-like environment + portfolio scripts (preloader locks interactions until unlock).
 * @param {{ url?: string }} [options]
 * @returns {{ window: import('happy-dom').Window }}
 */
export function createPortfolioWindow(options = {}) {
    const url = options.url ?? "http://localhost:8080/"
    const win = new Window({ url })
    bindGlobalThisToWindow(win)

    const noopAlert = function () {
        /* portfolio contact.js calls alert(); happy-dom may omit it */
    }
    win.alert = noopAlert
    globalThis.alert = noopAlert

    // One concatenated classic script so `let`/`const` in globals.js share a scope with
    // other modules (happy-dom evaluates each <script> append in an isolated scope).
    const combined = PORTFOLIO_SCRIPT_ORDER.map((name) =>
        readFileSync(resolve(REPO_ROOT, "js", name), "utf8")
    ).join("\n\n")

    runClassicScript(win, combined)

    return { window: win }
}

/**
 * Remove preloader interaction capture listeners (portfolio scripts register on load).
 * Classic scripts attach names to the Window object, not Node's globalThis.
 */
export function unlockIfPreloaderLocked() {
    const w = globalThis.window
    if (w && typeof w.unlockPreloaderInteractions === "function") {
        w.unlockPreloaderInteractions()
    }
}
