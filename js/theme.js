// Theme: light / dark / system segmented control (see html/layout.html #themeToggle)
const THEME_STORAGE_KEY = "portfolio-color-scheme"

function getStoredTheme() {
    try {
        const v = localStorage.getItem(THEME_STORAGE_KEY)
        if (v === "light" || v === "dark" || v === "system") {
            return v
        }
    } catch (error) {
        // Ignore blocked storage and fall back to the default theme.
    }

    return "light"
}

function systemPrefersDark() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
}

function setStoredTheme(mode) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, mode)
    } catch (error) {
        // Ignore blocked storage; the in-memory theme change still applies.
    }
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

function applyBodyFromMode(mode) {
    if (!document.body) {
        return
    }

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

function applyTheme(mode) {
    applyBodyFromMode(mode)
    updateThemeUI(mode)
    return null
}

function setupThemeToggle() {
    const root = document.getElementById("themeToggle")
    if (!root) {
        return
    }

    const mode = getStoredTheme()
    applyTheme(mode)

    if (root.dataset.themeToggleBound === "true") {
        return
    }

    root.dataset.themeToggleBound = "true"

    root.querySelectorAll(".theme-segmented__btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const next = btn.getAttribute("data-theme")
            if (!next) {
                return
            }
            setStoredTheme(next)
            applyTheme(next)
        })
    })

    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    const handleSystemThemeChange = () => {
        if (getStoredTheme() === "system") {
            applyTheme("system")
        }
    }

    if (typeof mql.addEventListener === "function") {
        mql.addEventListener("change", handleSystemThemeChange)
    } else if (typeof mql.addListener === "function") {
        mql.addListener(handleSystemThemeChange)
    }
}
