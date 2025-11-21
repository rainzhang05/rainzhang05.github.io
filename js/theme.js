// Theme Toggle Functionality - Updated for new theme toggle
function setupThemeToggle() {
    const themeToggle = document.getElementById("themeToggle")
    const body = document.body

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode")
    })
}
