// Smooth scrolling for in-page hash links
function setupHashLinkBehavior() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault()
            const targetId = this.getAttribute("href").substring(1)
            const targetElement = document.getElementById(targetId)

            if (targetElement) {
                if (targetId === "skills" && typeof revealSkillsSection === "function") {
                    revealSkillsSection()
                }

                targetElement.classList.add("section-highlight")

                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                })

                setTimeout(() => {
                    targetElement.classList.remove("section-highlight")
                }, 1000)
            }
        })
    })
}
