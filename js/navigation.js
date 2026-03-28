// Smooth scrolling for in-page hash links
function getScrollTop() {
    const se = document.scrollingElement
    return (
        window.scrollY ||
        window.pageYOffset ||
        (se && se.scrollTop) ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
    )
}

function scrollNavigationTargetIntoView(targetElement) {
    const rect = targetElement.getBoundingClientRect()
    const marginTop = parseFloat(getComputedStyle(targetElement).scrollMarginTop)
    const scrollMarginTop = Number.isFinite(marginTop) ? marginTop : 0
    const targetY = rect.top + getScrollTop() - scrollMarginTop
    const top = Math.max(0, targetY)

    const body = document.body
    if (typeof body.scrollTo === "function" && body.scrollHeight > body.clientHeight) {
        body.scrollTo({ top, behavior: "smooth" })
    } else {
        window.scrollTo({ top, behavior: "smooth" })
    }
}

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

                scrollNavigationTargetIntoView(targetElement)

                setTimeout(() => {
                    targetElement.classList.remove("section-highlight")
                }, 1000)
            }
        })
    })
}
