// Theme: light / dark / system segmented control (see html/layout.html #themeToggle)
// Theme uses a temporary root transition class for smooth screen-wide changes.
const THEME_STORAGE_KEY = "portfolio-color-scheme"
const THEME_TRANSITION_CLASS = "theme-transitioning"
const THEME_VIEW_TRANSITION_CLASS = "theme-view-transitioning"
const THEME_TRANSITION_DURATION_MS = 300

let themeTransitionTimeoutId = null

function getStoredTheme() {
    const v = localStorage.getItem(THEME_STORAGE_KEY)
    if (v === "light" || v === "dark" || v === "system") {
        return v
    }
    return "light"
}

function systemPrefersDark() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
}

function isDarkForMode(mode) {
    if (mode === "dark") {
        return true
    }
    if (mode === "light") {
        return false
    }
    return systemPrefersDark()
}

function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function stopThemeTransition() {
    if (themeTransitionTimeoutId !== null) {
        window.clearTimeout(themeTransitionTimeoutId)
        themeTransitionTimeoutId = null
    }
    document.documentElement.classList.remove(THEME_TRANSITION_CLASS)
}

function startThemeTransition() {
    if (prefersReducedMotion()) {
        stopThemeTransition()
        return
    }

    stopThemeTransition()
    document.documentElement.classList.add(THEME_TRANSITION_CLASS)
    themeTransitionTimeoutId = window.setTimeout(() => {
        document.documentElement.classList.remove(THEME_TRANSITION_CLASS)
        themeTransitionTimeoutId = null
    }, THEME_TRANSITION_DURATION_MS)
}

function finishViewTransition() {
    document.documentElement.classList.remove(THEME_VIEW_TRANSITION_CLASS)
}

function runViewTransition(updateTheme) {
    if (typeof document.startViewTransition !== "function" || prefersReducedMotion()) {
        return null
    }

    stopThemeTransition()
    document.documentElement.classList.add(THEME_VIEW_TRANSITION_CLASS)

    const transition = document.startViewTransition(() => {
        updateTheme()
    })

    Promise.resolve(transition.finished)
        .catch(() => {})
        .finally(() => {
            finishViewTransition()
        })

    return transition
}

function applyBodyFromMode(mode) {
    const dark = isDarkForMode(mode)
    if (dark) {
        document.body.classList.add("dark-mode")
    } else {
        document.body.classList.remove("dark-mode")
    }
}

function updateThemeUI(mode) {
    const root = document.getElementById("themeToggle")
    if (!root) {
        return
    }
    const track = root.querySelector(".theme-segmented__track")
    if (track) {
        track.setAttribute("data-active", mode)
    }
    root.querySelectorAll(".theme-segmented__btn").forEach((btn) => {
        const t = btn.getAttribute("data-theme")
        const on = t === mode
        btn.setAttribute("aria-checked", on ? "true" : "false")
        btn.classList.toggle("is-active", on)
    })
}

function applyTheme(mode, animate = true) {
    const updateTheme = () => {
        applyBodyFromMode(mode)
        updateThemeUI(mode)
    }

    if (animate) {
        const viewTransition = runViewTransition(updateTheme)
        if (viewTransition) {
            return viewTransition
        }

        startThemeTransition()
        // Commit the transition class before the theme tokens change so the
        // color swap enters a stable animated state instead of flashing.
        void document.documentElement.offsetWidth
    } else {
        stopThemeTransition()
        finishViewTransition()
    }

    updateTheme()
    return null
}

function setupThemeToggle() {
    const root = document.getElementById("themeToggle")
    if (!root) {
        return
    }

    const mode = getStoredTheme()
    applyTheme(mode, false)

    root.querySelectorAll(".theme-segmented__btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const next = btn.getAttribute("data-theme")
            if (!next) {
                return
            }
            localStorage.setItem(THEME_STORAGE_KEY, next)
            applyTheme(next)
        })
    })

    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    mql.addEventListener("change", () => {
        if (getStoredTheme() === "system") {
            applyTheme("system")
        }
    })
}
