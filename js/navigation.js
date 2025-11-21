// Fix the home button to make it more reliable
function setupHomeButton() {
    const homeButton = document.getElementById("homeButton")

    if (homeButton) {
        // Remove any existing event listeners to prevent duplicates
        homeButton.removeEventListener("click", scrollToTop)

        // Add the event listener
        homeButton.addEventListener("click", scrollToTop)

        // Make the button more obviously clickable
        homeButton.style.cursor = "pointer"
    }
}

// Separate function for the scroll action to make it easier to debug
function scrollToTop(e) {
    e.preventDefault()
    e.stopPropagation() // Prevent event bubbling

    // Scroll to top with animation
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    })

    // Remove any hash from URL
    history.pushState("", document.title, window.location.pathname + window.location.search)

    // Debug message
    console.log("Home button clicked, scrolling to top")

    return false // Ensure the event is fully canceled
}

// Smooth Scrolling for Hash Links with improved animation
function setupHashLinkBehavior() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault()
            const targetId = this.getAttribute("href").substring(1)
            const targetElement = document.getElementById(targetId)

            if (targetElement) {
                // Highlight the section briefly
                targetElement.classList.add("section-highlight")

                // Smooth scroll with custom easing
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                })

                // Remove highlight after animation
                setTimeout(() => {
                    targetElement.classList.remove("section-highlight")
                }, 1000)
            }
        })
    })
}
