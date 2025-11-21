// Main entry point - Event listeners and initialization

// Wait for sections to be loaded dynamically before initializing
document.addEventListener("sectionsLoaded", function handleSectionsLoaded() {
    document.removeEventListener("sectionsLoaded", handleSectionsLoaded)
    beginPreloadingSequence()
})

window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        document.body.classList.remove("intro-prep")
        document.body.classList.add("intro-animate")
    }
})
