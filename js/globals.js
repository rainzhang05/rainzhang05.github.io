const PORTFOLIO_CONFIG = {
    themeStorageKey: "portfolio-color-scheme",
    preloaderAssetTimeoutMs: 15000,
    preloaderFallbackTimeoutMs: 16000,
    skillsRevealScrollTop: 28,
}

const PORTFOLIO_STATE = {
    page: {
        isInitialized: false,
        hasIntroAnimated: false,
    },
    modal: {
        activeProjectModal: null,
        lastFocusedElement: null,
        projectModalIdCounter: 0,
        scrollLockState: {
            locked: false,
            previousPaddingRight: "",
        },
    },
    intro: {
        activeTypewriter: null,
    },
    preloader: {
        interactionsLocked: false,
    },
    contact: {
        successMessageTimeoutId: null,
    },
}

window.PORTFOLIO_CONFIG = PORTFOLIO_CONFIG
window.PORTFOLIO_STATE = PORTFOLIO_STATE

Object.defineProperty(window, "isPageInitialized", {
    get() {
        return PORTFOLIO_STATE.page.isInitialized
    },
    set(value) {
        PORTFOLIO_STATE.page.isInitialized = Boolean(value)
    },
    configurable: true,
})

Object.defineProperty(window, "hasIntroAnimated", {
    get() {
        return PORTFOLIO_STATE.page.hasIntroAnimated
    },
    set(value) {
        PORTFOLIO_STATE.page.hasIntroAnimated = Boolean(value)
    },
    configurable: true,
})

Object.defineProperty(window, "activeProjectModal", {
    get() {
        return PORTFOLIO_STATE.modal.activeProjectModal
    },
    set(value) {
        PORTFOLIO_STATE.modal.activeProjectModal = value
    },
    configurable: true,
})

Object.defineProperty(window, "lastFocusedElement", {
    get() {
        return PORTFOLIO_STATE.modal.lastFocusedElement
    },
    set(value) {
        PORTFOLIO_STATE.modal.lastFocusedElement = value
    },
    configurable: true,
})

Object.defineProperty(window, "projectModalIdCounter", {
    get() {
        return PORTFOLIO_STATE.modal.projectModalIdCounter
    },
    set(value) {
        PORTFOLIO_STATE.modal.projectModalIdCounter = value
    },
    configurable: true,
})

Object.defineProperty(window, "modalScrollLockState", {
    get() {
        return PORTFOLIO_STATE.modal.scrollLockState
    },
    configurable: true,
})

Object.defineProperty(window, "activeTypewriter", {
    get() {
        return PORTFOLIO_STATE.intro.activeTypewriter
    },
    set(value) {
        PORTFOLIO_STATE.intro.activeTypewriter = value
    },
    configurable: true,
})
