// Clearing up the URL after refreshing the page
function removeHash() {
    history.pushState("", document.title, window.location.pathname + window.location.search)
}

history.scrollRestoration = "manual"

document.addEventListener("DOMContentLoaded", initPage)
window.addEventListener("pageshow", initPage)
window.addEventListener("load", initPage)

function initPage(event) {
    if (event && event.persisted) {
        location.reload()
        return
    }

    removeHash()
    window.scrollTo(0, 0)
    animateIntro()
    initTypewriter()
    setupDockHoverEffects()
    setupThemeToggle()
    setupHomeButton()
    setupHashLinkBehavior()
    setupContactForm()
    setupFormAnimations()
}

// Blur in Effect for Intro Elements with improved animation
function animateIntro() {
    const introElements = document.querySelectorAll(".navigationBar, .introduction, #introHeading, #introParagraph")

    introElements.forEach((element, index) => {
        element.style.opacity = "0"
        element.style.filter = "blur(10px)"
        element.style.transform = "translateY(20px)"

        setTimeout(() => {
            element.style.transition =
                "opacity 1s cubic-bezier(0.34, 1.56, 0.64, 1), transform 1s cubic-bezier(0.34, 1.56, 0.64, 1), filter 1s cubic-bezier(0.34, 1.56, 0.64, 1)"
            element.style.opacity = "1"
            element.style.filter = "blur(0)"
            element.style.transform = "translateY(0)"
        }, index * 200)
    })

    // Fade in Effect for Sections with improved animation
    const sections = document.querySelectorAll(".skills, .experience, .projects, .education, .contact")
    const fadeInSection = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.transition =
                    "opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
                entry.target.style.opacity = "1"
                entry.target.style.transform = "translateY(0)"
                observer.unobserve(entry.target)
            }
        })
    }

    const sectionObserver = new IntersectionObserver(fadeInSection, {
        root: null,
        threshold: 0.1,
        rootMargin: "-50px",
    })

    sections.forEach((section) => {
        section.style.opacity = "0"
        section.style.transform = "translateY(50px)"
        sectionObserver.observe(section)
    })
}

// Typewriter Effect
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement
        this.words = words
        this.txt = ""
        this.wordIndex = 0
        this.wait = wait
        this.isDeleting = false

        // Add a flag to ensure only one instance is running
        if (window.activeTypewriter) {
            window.activeTypewriter.txtElement.innerHTML = ""
        }
        window.activeTypewriter = this

        this.type()
    }

    type() {
        // Check if this instance is still the active one
        if (window.activeTypewriter !== this) return

        const current = this.wordIndex % this.words.length
        const fullTxt = this.words[current]

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1)
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1)
        }

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`

        let typeSpeed = 100
        if (this.isDeleting) {
            typeSpeed /= 2
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait
            this.isDeleting = true
        } else if (this.isDeleting && this.txt === "") {
            this.isDeleting = false
            this.wordIndex++
            typeSpeed = 500
        }

        setTimeout(() => this.type(), typeSpeed)
    }
}

// Initialize Typewriter
function initTypewriter() {
    const txtElement = document.querySelector("#introName")
    const words = ["Rain Zhang", "a Computer Science Student", "a Software Developer", "Based in Vancouver"]
    const wait = 2000
    new TypeWriter(txtElement, words, wait)
}

// Enhanced Dock Hover Effects
function setupDockHoverEffects() {
    const dock = document.getElementById("dock")
    const dockItems = dock.querySelectorAll(".dock-item")

    // Add tooltips to dock items
    dockItems.forEach((item) => {
        if (item.id === "homeButton") {
            item.setAttribute("data-tooltip", "Home")
        } else if (item.id === "githubDock") {
            item.setAttribute("data-tooltip", "GitHub")
        } else if (item.id === "emailDock") {
            item.setAttribute("data-tooltip", "Email")
        } else if (item.id === "phoneDock") {
            item.setAttribute("data-tooltip", "Phone")
        } else if (item.id === "discordDock") {
            item.setAttribute("data-tooltip", "Discord")
        } else if (item.id === "themeToggle") {
            item.setAttribute("data-tooltip", "Toggle Theme")
        } else {
            // Extract alt text for tooltip
            const img = item.querySelector("img")
            if (img && img.alt) {
                item.setAttribute("data-tooltip", img.alt)
            }
        }
    })

    // Magnification effect for dock
    dock.addEventListener("mousemove", (e) => {
        const dockRect = dock.getBoundingClientRect()
        const mouseX = e.clientX - dockRect.left

        dockItems.forEach((item) => {
            if (!item.classList.contains("dock-separator")) {
                const itemRect = item.getBoundingClientRect()
                const itemX = itemRect.left + itemRect.width / 2 - dockRect.left
                const distance = Math.abs(mouseX - itemX)

                // Calculate scale based on distance (max scale: 1.2, min scale: 1.0)
                const maxDistance = 100
                const scale = distance < maxDistance ? 1 + 0.2 * (1 - distance / maxDistance) : 1

                item.style.transform = `scale(${scale})`

                // Add slight y-axis movement for a more dynamic effect
                if (scale > 1.05) {
                    item.style.transform += ` translateY(${(scale - 1) * -10}px)`
                }
            }
        })
    })

    // Reset all items when mouse leaves the dock
    dock.addEventListener("mouseleave", () => {
        dockItems.forEach((item) => {
            if (!item.classList.contains("dock-separator")) {
                item.style.transform = "scale(1)"
            }
        })
    })
}

// Theme Toggle Functionality
function setupThemeToggle() {
    const themeToggle = document.getElementById("themeToggle")
    const themeIcon = document.getElementById("themeIcon")
    const body = document.body

    // Force browser to recognize initial transform state
    themeIcon.style.transform = "rotate(0deg)"

    themeToggle.addEventListener("click", () => {
        // Add transition class for smooth animation
        body.classList.add("theme-transition")

        // Toggle dark mode
        body.classList.toggle("dark-mode")

        // Ensure first-click animation works by forcing a reflow
        themeIcon.getBoundingClientRect() // Forces the browser to recognize the change

        // Update icon with animation
        themeIcon.style.transform = "rotate(360deg)"
        setTimeout(() => {
            themeIcon.src = body.classList.contains("dark-mode")
                ? "https://api.iconify.design/lucide:moon.svg"
                : "https://api.iconify.design/lucide:sun.svg"
            themeIcon.style.transform = "rotate(0deg)"
        }, 150)

        // Remove transition class after animation completes
        setTimeout(() => {
            body.classList.remove("theme-transition")
        }, 500)
    })
}

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

// Setup Contact Form
function setupContactForm() {
    const contactForm = document.getElementById("contactForm")
    if (!contactForm) return

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault()

        // Get form values
        const name = document.getElementById("name").value
        const email = document.getElementById("email").value
        const message = document.getElementById("message").value

        // Simple validation
        if (!name || !email || !message) {
            alert("Please fill in all fields")
            return
        }

        // Store the original button text
        const submitBtn = document.getElementById("submitBtn")
        const originalText = submitBtn.textContent

        // Change button text and disable
        submitBtn.textContent = "Sending..."
        submitBtn.disabled = true

        // Get the form data
        const formData = new FormData(contactForm)

        // Send the form data using fetch
        fetch(contactForm.action, {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json",
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error("Form submission failed")
                }
            })
            .then((data) => {
                // Show success message
                const successMessage = document.getElementById("successMessage")
                successMessage.style.display = "block"

                // Reset form
                contactForm.reset()

                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = "none"
                }, 5000)
            })
            .catch((error) => {
                console.error("Error:", error)
                alert("Failed to send message. Please try again later.")
            })
            .finally(() => {
                // Reset button regardless of success or failure
                submitBtn.textContent = originalText
                submitBtn.disabled = false
            })
    })
}

// Setup Form Animations
function setupFormAnimations() {
    const formInputs = document.querySelectorAll(".form-group input, .form-group textarea")

    formInputs.forEach((input) => {
        // Create and append animation element
        const animationEl = document.createElement("span")
        animationEl.classList.add("input-animation")
        input.parentNode.appendChild(animationEl)

        // Focus animation
        input.addEventListener("focus", () => {
            input.parentNode.classList.add("input-focused")
        })

        // Blur animation
        input.addEventListener("blur", () => {
            input.parentNode.classList.remove("input-focused")
        })

        // Add floating label effect
        input.addEventListener("input", () => {
            if (input.value.trim() !== "") {
                input.classList.add("has-content")
            } else {
                input.classList.remove("has-content")
            }
        })
    })
}