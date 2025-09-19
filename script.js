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
    setupProjectCards() // Updated function for project cards
}

let activeProjectModal = null
let lastFocusedElement = null
let projectModalIdCounter = 0

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

    // We don't use fade-in effect for sections anymore as per user's requirement
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

// Enhanced Dock Hover Effects - Updated for more subtle magnification
function setupDockHoverEffects() {
    const dock = document.getElementById("dock")
    const dockItems = dock.querySelectorAll(".dock-item")

    // More subtle magnification effect for dock
    dockItems.forEach((item) => {
        if (!item.classList.contains("dock-separator")) {
            item.addEventListener("mouseenter", () => {
                // Apply a more subtle scale to the hovered item
                item.style.transform = "scale(1.08) translateY(-3px)"
            })

            item.addEventListener("mouseleave", () => {
                item.style.transform = "scale(1)"
            })
        }
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

// Theme Toggle Functionality - Updated for new theme toggle
function setupThemeToggle() {
    const themeToggle = document.getElementById("themeToggle")
    const body = document.body

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode")
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

// Setup Project Cards - open project details in a modal dialog
function setupProjectCards() {
    const projectCards = document.querySelectorAll(".project-card")

    projectCards.forEach((card) => {
        if (card.dataset.modalBound === "true") return

        card.dataset.modalBound = "true"

        if (!card.hasAttribute("tabindex")) {
            card.setAttribute("tabindex", "0")
        }

        if (!card.hasAttribute("role")) {
            card.setAttribute("role", "button")
        }

        const title = card.querySelector(".project-header h3")
        if (title && !card.hasAttribute("aria-label")) {
            card.setAttribute("aria-label", `Open details for the ${title.textContent.trim()} project`)
        }

        const cardContent = card.querySelector(".project-content")

        card.addEventListener("click", (event) => {
            if (cardContent && !cardContent.contains(event.target)) {
                return
            }

            event.preventDefault()
            openProjectModal(card)
        })

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault()
                openProjectModal(card)
            } else if (event.key === " ") {
                event.preventDefault()
            }
        })

        card.addEventListener("keyup", (event) => {
            if (event.key === " ") {
                event.preventDefault()
                openProjectModal(card)
            }
        })
    })
}

function openProjectModal(card) {
    if (!card) return

    // Close any existing modal instantly before opening a new one
    closeProjectModal({ immediate: true })

    lastFocusedElement = document.activeElement

    const overlay = document.createElement("div")
    overlay.className = "project-modal-overlay"

    const modal = document.createElement("div")
    modal.className = "project-modal"
    modal.setAttribute("role", "dialog")
    modal.setAttribute("aria-modal", "true")

    const closeButton = document.createElement("button")
    closeButton.className = "project-modal-close"
    closeButton.setAttribute("aria-label", "Close project details")
    closeButton.innerHTML = "&times;"
    closeButton.type = "button"

    modal.appendChild(closeButton)

    const header = card.querySelector(".project-header")
    if (header) {
        const headerClone = header.cloneNode(true)
        const heading = headerClone.querySelector("h3")

        if (heading) {
            projectModalIdCounter += 1
            const titleId = `project-modal-title-${projectModalIdCounter}`
            heading.id = titleId
            modal.setAttribute("aria-labelledby", titleId)
        } else {
            const fallbackTitle = header.querySelector("h3")
            if (fallbackTitle) {
                modal.setAttribute("aria-label", fallbackTitle.textContent.trim())
            }
        }

        modal.appendChild(headerClone)
    } else {
        const fallbackTitle = card.querySelector(".project-header h3")
        if (fallbackTitle) {
            modal.setAttribute("aria-label", fallbackTitle.textContent.trim())
        }
    }

    const content = card.querySelector(".project-content")
    if (content) {
        const contentClone = content.cloneNode(true)
        const readMoreButton = contentClone.querySelector(".read-more")
        if (readMoreButton) {
            readMoreButton.remove()
        }
        modal.appendChild(contentClone)
    }

    overlay.appendChild(modal)
    document.body.appendChild(overlay)

    document.body.classList.add("modal-open")

    const cardRect = card.getBoundingClientRect()
    const cardStyles = window.getComputedStyle(card)
    const modalRect = modal.getBoundingClientRect()
    const deltaX = cardRect.left - modalRect.left
    const deltaY = cardRect.top - modalRect.top
    const scaleX = modalRect.width === 0 ? 1 : cardRect.width / modalRect.width
    const scaleY = modalRect.height === 0 ? 1 : cardRect.height / modalRect.height
    const initialBorderRadius = cardStyles.borderRadius

    modal.classList.add("project-modal-animating")
    if (initialBorderRadius) {
        modal.style.borderRadius = initialBorderRadius
    }
    modal.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`

    const handleOpenTransitionEnd = (event) => {
        if (event.target !== modal || event.propertyName !== "transform") return
        modal.classList.remove("project-modal-animating")
        modal.removeEventListener("transitionend", handleOpenTransitionEnd)
    }

    modal.addEventListener("transitionend", handleOpenTransitionEnd)

    requestAnimationFrame(() => {
        overlay.classList.add("active")
        requestAnimationFrame(() => {
            modal.style.transform = ""
            modal.style.borderRadius = ""
        })
    })

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            event.preventDefault()
            closeProjectModal()
        }
    }

    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            closeProjectModal()
        }
    })

    closeButton.addEventListener("click", () => {
        closeProjectModal()
    })

    document.addEventListener("keydown", handleKeyDown)

    const handleFocusTrap = (event) => {
        if (event.key !== "Tab") return

        const focusableSelectors =
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        const focusable = modal.querySelectorAll(focusableSelectors)
        if (!focusable.length) return

        const firstElement = focusable[0]
        const lastElement = focusable[focusable.length - 1]

        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                event.preventDefault()
                lastElement.focus()
            }
        } else if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
        }
    }

    modal.addEventListener("keydown", handleFocusTrap)

    closeButton.focus({ preventScroll: true })

    activeProjectModal = {
        overlay,
        handleKeyDown,
        modal,
        handleFocusTrap,
        card,
        handleOpenTransitionEnd,
        isClosing: false,
    }
}

function closeProjectModal(options = {}) {
    if (!activeProjectModal) return

    const { immediate = false } = options
    const { overlay, handleKeyDown, modal, handleFocusTrap, card, handleOpenTransitionEnd } = activeProjectModal

    if (activeProjectModal.isClosing && !immediate) {
        return
    }

    document.removeEventListener("keydown", handleKeyDown)

    if (modal && handleFocusTrap) {
        modal.removeEventListener("keydown", handleFocusTrap)
    }

    if (modal && handleOpenTransitionEnd) {
        modal.removeEventListener("transitionend", handleOpenTransitionEnd)
    }

    let cleanupCalled = false
    const cleanup = () => {
        if (cleanupCalled) return
        cleanupCalled = true

        if (overlay && overlay.parentElement) {
            overlay.remove()
        }

        document.body.classList.remove("modal-open")

        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus({ preventScroll: true })
        }
        lastFocusedElement = null

        activeProjectModal = null
    }

    if (immediate) {
        cleanup()
        return
    }

    if (!card || !document.body.contains(card)) {
        overlay.classList.remove("active")
        setTimeout(() => {
            cleanup()
        }, 300)
        return
    }

    activeProjectModal.isClosing = true

    overlay.classList.remove("active")
    modal.classList.add("project-modal-animating")

    const modalRect = modal.getBoundingClientRect()
    const cardRect = card.getBoundingClientRect()
    const deltaX = cardRect.left - modalRect.left
    const deltaY = cardRect.top - modalRect.top
    const scaleX = modalRect.width === 0 ? 1 : cardRect.width / modalRect.width
    const scaleY = modalRect.height === 0 ? 1 : cardRect.height / modalRect.height
    const targetBorderRadius = window.getComputedStyle(card).borderRadius

    if (targetBorderRadius) {
        modal.style.borderRadius = targetBorderRadius
    }

    modal.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`

    const handleCloseTransitionEnd = (event) => {
        if (event.target !== modal || event.propertyName !== "transform") return
        modal.removeEventListener("transitionend", handleCloseTransitionEnd)
        cleanup()
    }

    modal.addEventListener("transitionend", handleCloseTransitionEnd)

    setTimeout(() => {
        modal.removeEventListener("transitionend", handleCloseTransitionEnd)
        cleanup()
    }, 650)
}