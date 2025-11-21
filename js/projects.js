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

        card.addEventListener("click", (event) => {
            const interactiveElement = event.target.closest(".project-link-button, a, button")
            if (interactiveElement) {
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

function bindOpenProjectLinks(root = document) {
    const projectLinkTriggers = root.querySelectorAll("[data-open-project]")

    projectLinkTriggers.forEach((trigger) => {
        if (trigger.dataset.openProjectBound === "true") {
            return
        }

        trigger.dataset.openProjectBound = "true"

        trigger.addEventListener("click", (event) => {
            const targetId = trigger.getAttribute("data-open-project")

            if (!targetId) {
                return
            }

            const projectCard = document.getElementById(targetId)

            if (!projectCard) {
                return
            }

            event.preventDefault()

            closeProjectModal({ immediate: true })

            // Directly open the modal without scrolling
            if (typeof projectCard.focus === "function") {
                projectCard.focus({ preventScroll: true })
            }
            openProjectModal(projectCard)
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

    // Set project ID for CSS targeting (e.g., compact modals)
    if (card.id) {
        modal.setAttribute("data-project-id", card.id)
    }

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
        const summaryInClone = contentClone.querySelector(".project-summary")
        if (summaryInClone) {
            summaryInClone.remove()
        }
        const experienceRelated = contentClone.querySelector(".experience-related")
        if (experienceRelated) {
            experienceRelated.remove()
        }
        const projectCoverInClone = contentClone.querySelector(".project-cover")
        if (projectCoverInClone) {
            projectCoverInClone.remove()
        }
        const readMoreButton = contentClone.querySelector(".read-more")
        if (readMoreButton) {
            readMoreButton.remove()
        }
        bindOpenProjectLinks(contentClone)
        modal.appendChild(contentClone)
    }

    overlay.appendChild(modal)

    applyModalScrollLock()
    document.body.appendChild(overlay)

    requestAnimationFrame(() => {
        overlay.classList.add("active")
        modal.classList.add("project-modal-open")
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
        isClosing: false,
    }
}

function closeProjectModal(options = {}) {
    if (!activeProjectModal) return

    const { immediate = false } = options
    const { overlay, handleKeyDown, modal, handleFocusTrap } = activeProjectModal

    if (activeProjectModal.isClosing && !immediate) {
        return
    }

    document.removeEventListener("keydown", handleKeyDown)

    if (modal && handleFocusTrap) {
        modal.removeEventListener("keydown", handleFocusTrap)
    }

    let cleanupCalled = false
    const cleanup = () => {
        if (cleanupCalled) return
        cleanupCalled = true

        if (overlay && overlay.parentElement) {
            overlay.remove()
        }

        releaseModalScrollLock()

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

    activeProjectModal.isClosing = true

    overlay.classList.remove("active")
    modal.classList.remove("project-modal-open")
    modal.classList.add("project-modal-closing")

    const handleCloseTransitionEnd = (event) => {
        if (event.target !== modal || event.propertyName !== "opacity") return
        modal.removeEventListener("transitionend", handleCloseTransitionEnd)
        cleanup()
    }

    modal.addEventListener("transitionend", handleCloseTransitionEnd)

    setTimeout(() => {
        modal.removeEventListener("transitionend", handleCloseTransitionEnd)
        cleanup()
    }, 400)
}
