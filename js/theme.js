// Theme: light / dark / system segmented control (see html/layout.html #themeToggle)
// Theme applies synchronously (no View Transition API) so scroll position stays stable.
const THEME_STORAGE_KEY = "portfolio-color-scheme"

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

function applyTheme(mode) {
    applyBodyFromMode(mode)
    updateThemeUI(mode)
}

function setupThemeToggle() {
    const root = document.getElementById("themeToggle")
    if (!root) {
        return
    }

    const mode = getStoredTheme()
    applyTheme(mode)

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
            applyBodyFromMode("system")
        }
    })
}
