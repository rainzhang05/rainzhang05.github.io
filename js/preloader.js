// Interaction lock while preloading
let preloaderInteractionsLocked = false
const preloaderInteractionEvents = [
    "click",
    "mousedown",
    "mouseup",
    "pointerdown",
    "pointerup",
    "touchstart",
    "touchmove",
    "wheel",
    "keydown",
]
const preloaderInteractionOptions = { passive: false, capture: true }

function preventPreloaderInteraction(event) {
    if (!document.documentElement.classList.contains("is-preloading")) {
        return
    }

    if (event.cancelable) {
        event.preventDefault()
    }

    event.stopPropagation()
}

function lockPreloaderInteractions() {
    if (preloaderInteractionsLocked) {
        return
    }

    preloaderInteractionsLocked = true
    preloaderInteractionEvents.forEach((eventName) => {
        document.addEventListener(eventName, preventPreloaderInteraction, preloaderInteractionOptions)
    })

    document.documentElement.classList.add("is-preloading")
    if (document.body) {
        document.body.classList.add("is-preloading")
    }
}

function unlockPreloaderInteractions() {
    if (!preloaderInteractionsLocked) {
        return
    }

    preloaderInteractionsLocked = false
    preloaderInteractionEvents.forEach((eventName) => {
        document.removeEventListener(eventName, preventPreloaderInteraction, preloaderInteractionOptions)
    })

    document.documentElement.classList.remove("is-preloading")
}

lockPreloaderInteractions()

// Clearing up the URL after refreshing the page
function removeHash() {
    history.pushState("", document.title, window.location.pathname + window.location.search)
}

function waitForWindowLoad() {
    if (document.readyState === "complete") {
        return Promise.resolve()
    }

    return new Promise((resolve) => {
        window.addEventListener(
            "load",
            () => {
                resolve()
            },
            { once: true }
        )
    })
}

function waitForFonts() {
    if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === "function") {
        return document.fonts.ready.catch(() => {})
    }

    return Promise.resolve()
}

function waitForImages() {
    const imageElements = Array.from(document.querySelectorAll("img"))

    if (!imageElements.length) {
        return Promise.resolve()
    }

    const loadPromises = imageElements.map((image) => {
        if (image.complete && image.naturalWidth !== 0) {
            return Promise.resolve()
        }

        return new Promise((resolve) => {
            const finalize = () => {
                image.removeEventListener("load", finalize)
                image.removeEventListener("error", finalize)
                resolve()
            }

            image.addEventListener("load", finalize)
            image.addEventListener("error", finalize)
        })
    })

    return Promise.all(loadPromises)
}

function beginPreloadingSequence() {
    lockPreloaderInteractions()
    const preloaderElement = document.getElementById("preloader")

    const completePreloading = () => {
        if (document.body.classList.contains("preloading-complete")) {
            return
        }

        document.body.classList.add("preloading-complete")

        if (preloaderElement) {
            const removePreloader = () => {
                preloaderElement.removeEventListener("transitionend", removePreloader)
                if (preloaderElement.parentNode) {
                    preloaderElement.parentNode.removeChild(preloaderElement)
                }

                document.body.classList.remove("is-preloading")
                unlockPreloaderInteractions()
            }

            preloaderElement.addEventListener("transitionend", removePreloader)
            // Ensure the transition runs even if the browser does not trigger transitionend.
            setTimeout(removePreloader, 800)
        } else {
            document.body.classList.remove("is-preloading")
            unlockPreloaderInteractions()
        }

        initPage()
    }

    const minimumDisplayTime = new Promise((resolve) => {
        setTimeout(resolve, 400)
    })

    const assetPromises = Promise.all([waitForWindowLoad(), waitForFonts(), waitForImages()]).catch(() => {})
    const fallbackTimeout = new Promise((resolve) => {
        setTimeout(resolve, 10000)
    })

    Promise.all([minimumDisplayTime, Promise.race([assetPromises, fallbackTimeout])]).then(() => {
        completePreloading()
    })
}

function initPage() {
    if (isPageInitialized) {
        return
    }

    isPageInitialized = true
    removeHash()

    runIntroSequence()
    setupDockHoverEffects()
    setupThemeToggle()
    setupHomeButton()
    setupHashLinkBehavior()
    setupContactForm()
    setupProjectCards()
    bindOpenProjectLinks()
}
