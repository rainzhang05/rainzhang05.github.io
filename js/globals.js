// Global state variables shared across modules
let isPageInitialized = false
let hasIntroAnimated = false

let activeProjectModal = null
let lastFocusedElement = null
let projectModalIdCounter = 0

// Track scroll locking so the page width stays stable when project modals open
const modalScrollLockState = {
    locked: false,
    previousPaddingRight: "",
}
