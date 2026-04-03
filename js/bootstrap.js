const PORTFOLIO_SECTION_MANIFEST = [
    ["introduction-container", "html/introduction.html"],
    ["skills-container", "html/skills.html"],
    ["experience-container", "html/experience.html"],
    ["projects-container", "html/projects.html"],
    ["education-container", "html/education.html"],
    ["contact-container", "html/contact.html"],
    ["footer-container", "html/footer.html"],
]

async function loadSection(containerId, sectionPath) {
    const container = document.getElementById(containerId)
    if (!container) {
        return false
    }

    try {
        const response = await fetch(sectionPath)
        if (!response.ok) {
            throw new Error(`Failed to load ${sectionPath}`)
        }

        container.innerHTML = await response.text()
        return true
    } catch (error) {
        console.error(`Error loading section "${sectionPath}": ${error.message}`)
        return false
    }
}

async function loadPageSections() {
    await loadSection("layout-container", "html/layout.html")

    if (typeof setupThemeToggle === "function") {
        setupThemeToggle()
    }

    await Promise.all(
        PORTFOLIO_SECTION_MANIFEST.map(([containerId, sectionPath]) => loadSection(containerId, sectionPath))
    )

    document.dispatchEvent(new CustomEvent("sectionsLoaded"))
}

document.addEventListener("DOMContentLoaded", () => {
    loadPageSections()
})
