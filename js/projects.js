const PROJECT_MODAL_FOCUSABLE_SELECTORS =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
const PROJECT_MODAL_CLOSE_TIMEOUT_MS = 350

function decorateProjectCardTitle(title) {
    title.classList.add("project-card-title-trigger")
    title.setAttribute("role", "button")
    title.setAttribute("tabindex", "0")
    title.setAttribute("aria-label", `Open details: ${title.textContent.trim()}`)
}

function focusProjectCardTitle(projectCard) {
    const titleTrigger =
        projectCard.querySelector(".project-card-title-trigger") ||
        projectCard.querySelector(".project-header h3")

    if (titleTrigger && typeof titleTrigger.focus === "function") {
        titleTrigger.focus({ preventScroll: true })
    }
}

function bindProjectCardTitle(card, title) {
    decorateProjectCardTitle(title)

    title.addEventListener("click", (event) => {
        event.preventDefault()
        event.stopPropagation()
        openProjectModal(card, { clientX: event.clientX, clientY: event.clientY })
    })

    title.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            openProjectModal(card)
        }
    })
}

function setupProjectCards() {
    document.querySelectorAll(".project-card").forEach((card) => {
        if (card.dataset.modalBound === "true") {
            return
        }

        const title = card.querySelector(".project-header h3")
        if (!title) {
            return
        }

        card.dataset.modalBound = "true"
        bindProjectCardTitle(card, title)
    })
}

function bindOpenProjectLinks(root = document) {
    root.querySelectorAll("[data-open-project]").forEach((trigger) => {
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
            focusProjectCardTitle(projectCard)
            openProjectModal(projectCard, { clientX: event.clientX, clientY: event.clientY })
        })
    })
}

function setProjectModalTransformOrigin(modal, viewportPointX, viewportPointY) {
    const viewportCenterX = Math.max(1, window.innerWidth / 2)
    const viewportCenterY = Math.max(1, window.innerHeight / 2)
    const originX = ((viewportPointX - viewportCenterX) / viewportCenterX) * 50 + 50
    const originY = ((viewportPointY - viewportCenterY) / viewportCenterY) * 50 + 50
    modal.style.transformOrigin = `${originX}% ${originY}%`
}

function createProjectModalOverlay() {
    const overlay = document.createElement("div")
    overlay.className = "project-modal-overlay"
    return overlay
}

function createProjectModal(card) {
    const modal = document.createElement("div")
    modal.className = "project-modal"
    modal.setAttribute("role", "dialog")
    modal.setAttribute("aria-modal", "true")

    if (card.id) {
        modal.setAttribute("data-project-id", card.id)
    }

    return modal
}

function createProjectModalCloseButton() {
    const closeButton = document.createElement("button")
    closeButton.className = "project-modal-close"
    closeButton.setAttribute("aria-label", "Close project details")
    closeButton.innerHTML = "&times;"
    closeButton.type = "button"
    return closeButton
}

function createProjectModalTitleId() {
    PORTFOLIO_STATE.modal.projectModalIdCounter += 1
    return `project-modal-title-${PORTFOLIO_STATE.modal.projectModalIdCounter}`
}

function applyProjectModalAccessibleName(modal, sourceCard, headerClone) {
    const heading = headerClone ? headerClone.querySelector("h3") : null
    if (heading) {
        heading.removeAttribute("role")
        heading.removeAttribute("tabindex")
        heading.removeAttribute("aria-label")
        heading.classList.remove("project-card-title-trigger")
        const titleId = createProjectModalTitleId()
        heading.id = titleId
        modal.setAttribute("aria-labelledby", titleId)
        return
    }

    const fallbackTitle = sourceCard.querySelector(".project-header h3")
    if (fallbackTitle) {
        modal.setAttribute("aria-label", fallbackTitle.textContent.trim())
    }
}

function appendProjectModalHeader(card, modal) {
    const header = card.querySelector(".project-header")
    if (!header) {
        applyProjectModalAccessibleName(modal, card, null)
        return
    }

    const headerClone = header.cloneNode(true)
    applyProjectModalAccessibleName(modal, card, headerClone)
    modal.appendChild(headerClone)
}

function stripProjectModalOnlyElements(contentClone) {
    [
        ".project-summary",
        ".experience-related",
        ".project-cover",
        ".read-more",
    ].forEach((selector) => {
        contentClone.querySelectorAll(selector).forEach((element) => {
            element.remove()
        })
    })
}

function appendProjectModalContent(card, modal) {
    const content = card.querySelector(".project-content")
    if (!content) {
        return
    }

    const contentClone = content.cloneNode(true)
    stripProjectModalOnlyElements(contentClone)
    bindOpenProjectLinks(contentClone)
    modal.appendChild(contentClone)
}

function resolveProjectModalOrigin(card, originOptions) {
    const cardRect = card.getBoundingClientRect()
    const fallbackX = cardRect.left + cardRect.width / 2
    const fallbackY = cardRect.top + cardRect.height / 2
    const usePointer =
        originOptions &&
        Number.isFinite(originOptions.clientX) &&
        Number.isFinite(originOptions.clientY)

    return {
        x: usePointer ? originOptions.clientX : fallbackX,
        y: usePointer ? originOptions.clientY : fallbackY,
    }
}

function trapProjectModalFocus(event, modal) {
    if (event.key !== "Tab") {
        return
    }

    const focusable = modal.querySelectorAll(PROJECT_MODAL_FOCUSABLE_SELECTORS)
    if (!focusable.length) {
        return
    }

    const firstElement = focusable[0]
    const lastElement = focusable[focusable.length - 1]

    if (event.shiftKey) {
        if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
        }
        return
    }

    if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
    }
}

function registerProjectModalInteractions(overlay, modal, closeButton) {
    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            event.preventDefault()
            closeProjectModal()
        }
    }

    const handleFocusTrap = (event) => {
        trapProjectModalFocus(event, modal)
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
    modal.addEventListener("keydown", handleFocusTrap)

    return { handleKeyDown, handleFocusTrap }
}

function focusProjectModalCloseButton(closeButton) {
    try {
        closeButton.focus({ preventScroll: true, focusVisible: false })
    } catch (error) {
        closeButton.focus({ preventScroll: true })
    }
}

function createProjectModalRecord(card) {
    const overlay = createProjectModalOverlay()
    const modal = createProjectModal(card)
    const closeButton = createProjectModalCloseButton()

    modal.appendChild(closeButton)
    appendProjectModalHeader(card, modal)
    appendProjectModalContent(card, modal)
    overlay.appendChild(modal)

    return { overlay, modal, closeButton }
}

function openProjectModal(card, originOptions) {
    if (!card) {
        return
    }

    closeProjectModal({ immediate: true })
    PORTFOLIO_STATE.modal.lastFocusedElement = document.activeElement

    const { overlay, modal, closeButton } = createProjectModalRecord(card)
    const origin = resolveProjectModalOrigin(card, originOptions)
    const interactions = registerProjectModalInteractions(overlay, modal, closeButton)

    applyModalScrollLock()
    document.body.appendChild(overlay)
    setProjectModalTransformOrigin(modal, origin.x, origin.y)

    requestAnimationFrame(() => {
        overlay.classList.add("active")
        modal.classList.add("project-modal-open")
    })

    focusProjectModalCloseButton(closeButton)

    PORTFOLIO_STATE.modal.activeProjectModal = {
        overlay,
        modal,
        closeButton,
        handleKeyDown: interactions.handleKeyDown,
        handleFocusTrap: interactions.handleFocusTrap,
        isClosing: false,
    }
}

function restoreProjectModalFocus() {
    const lastFocusedElement = PORTFOLIO_STATE.modal.lastFocusedElement
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus({ preventScroll: true })
    }

    PORTFOLIO_STATE.modal.lastFocusedElement = null
}

function cleanupProjectModal(activeModal) {
    if (activeModal.overlay && activeModal.overlay.parentElement) {
        activeModal.overlay.remove()
    }

    releaseModalScrollLock()
    restoreProjectModalFocus()
    PORTFOLIO_STATE.modal.activeProjectModal = null
}

function closeProjectModal(options = {}) {
    const activeModal = PORTFOLIO_STATE.modal.activeProjectModal
    if (!activeModal) {
        return
    }

    const { immediate = false } = options
    if (activeModal.isClosing && !immediate) {
        return
    }

    document.removeEventListener("keydown", activeModal.handleKeyDown)
    activeModal.modal.removeEventListener("keydown", activeModal.handleFocusTrap)

    let cleanedUp = false
    const cleanup = () => {
        if (cleanedUp) {
            return
        }

        cleanedUp = true
        cleanupProjectModal(activeModal)
    }

    if (immediate) {
        cleanup()
        return
    }

    activeModal.isClosing = true
    activeModal.overlay.classList.remove("active")
    activeModal.modal.classList.remove("project-modal-open")
    activeModal.modal.classList.add("project-modal-closing")

    const handleCloseTransitionEnd = (event) => {
        if (event.target !== activeModal.modal || event.propertyName !== "opacity") {
            return
        }

        activeModal.modal.removeEventListener("transitionend", handleCloseTransitionEnd)
        cleanup()
    }

    activeModal.modal.addEventListener("transitionend", handleCloseTransitionEnd)
    setTimeout(() => {
        activeModal.modal.removeEventListener("transitionend", handleCloseTransitionEnd)
        cleanup()
    }, PROJECT_MODAL_CLOSE_TIMEOUT_MS)
}
