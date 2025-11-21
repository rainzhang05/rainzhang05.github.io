// Modal scroll lock functions

function applyModalScrollLock() {
    if (modalScrollLockState.locked) {
        return
    }

    const rootElement = document.documentElement
    const scrollbarWidth = Math.max(0, window.innerWidth - rootElement.clientWidth)

    modalScrollLockState.previousPaddingRight = rootElement.style.paddingRight

    if (scrollbarWidth > 0) {
        rootElement.style.paddingRight = `${scrollbarWidth}px`
    }

    rootElement.classList.add("modal-open")
    document.body.classList.add("modal-open")

    modalScrollLockState.locked = true
}

function releaseModalScrollLock() {
    const rootElement = document.documentElement

    rootElement.classList.remove("modal-open")
    document.body.classList.remove("modal-open")

    rootElement.style.paddingRight = modalScrollLockState.previousPaddingRight

    modalScrollLockState.locked = false
    modalScrollLockState.previousPaddingRight = ""
}
