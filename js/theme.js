// Theme Toggle Functionality - Updated for new theme toggle
function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function setupThemeToggle() {
    const themeToggle = document.getElementById("themeToggle")
    const body = document.body

    if (!themeToggle) {
        return
    }

    const toggleDarkMode = () => {
        body.classList.toggle("dark-mode")
    }

    themeToggle.addEventListener("click", () => {
        if (prefersReducedMotion()) {
            toggleDarkMode()
            return
        }
        if (document.startViewTransition) {
            document.startViewTransition(toggleDarkMode)
        } else {
            toggleDarkMode()
        }
    })
}
