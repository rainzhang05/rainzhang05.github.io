// Modal scroll lock functions

function applyModalScrollLock() {
    const scrollLockState = PORTFOLIO_STATE.modal.scrollLockState

    if (scrollLockState.locked) {
        return
    }

    const rootElement = document.documentElement
    const scrollbarWidth = Math.max(0, window.innerWidth - rootElement.clientWidth)

    scrollLockState.previousPaddingRight = rootElement.style.paddingRight

    if (scrollbarWidth > 0) {
        rootElement.style.paddingRight = `${scrollbarWidth}px`
    }

    rootElement.classList.add("modal-open")
    document.body.classList.add("modal-open")

    scrollLockState.locked = true
}

function releaseModalScrollLock() {
    const scrollLockState = PORTFOLIO_STATE.modal.scrollLockState
    const rootElement = document.documentElement

    rootElement.classList.remove("modal-open")
    document.body.classList.remove("modal-open")

    rootElement.style.paddingRight = scrollLockState.previousPaddingRight

    scrollLockState.locked = false
    scrollLockState.previousPaddingRight = ""
}
