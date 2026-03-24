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
    const loadGateElement = document.getElementById("load-gate")

    const completePreloading = () => {
        if (document.body.classList.contains("preloading-complete")) {
            return
        }

        document.body.classList.add("preloading-complete")

        if (loadGateElement) {
            const removeLoadGate = () => {
                loadGateElement.removeEventListener("transitionend", removeLoadGate)
                if (loadGateElement.parentNode) {
                    loadGateElement.parentNode.removeChild(loadGateElement)
                }

                document.body.classList.remove("is-preloading")
                unlockPreloaderInteractions()
            }

            loadGateElement.addEventListener("transitionend", removeLoadGate)
            // Ensure the transition runs even if the browser does not trigger transitionend.
            setTimeout(removeLoadGate, 800)
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
    const initialHash = (window.location.hash || "").toLowerCase()
    removeHash()

    runIntroSequence()
    setupDockHoverEffects()
    setupThemeToggle()
    setupHashLinkBehavior()
    setupContactForm()
    setupProjectCards()
    bindOpenProjectLinks()
    setupSkillsScrollReveal(initialHash)
}

function revealSkillsSection() {
    const skillsRoot = document.getElementById("skills-section")
    if (!skillsRoot) {
        return
    }

    skillsRoot.classList.add("skills--visible")
    skillsRoot.removeAttribute("inert")
}

function setupSkillsScrollReveal(initialHash) {
    const skillsRoot = document.getElementById("skills-section")
    if (!skillsRoot) {
        return
    }

    function scrollTopCombined() {
        const se = document.scrollingElement
        return (
            window.scrollY ||
            window.pageYOffset ||
            (se && se.scrollTop) ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0
        )
    }

    let revealed = false
    const minScrollToReveal = 28

    const scrollOpts = { passive: true }
    const documentScrollOpts = { passive: true, capture: true }

    function checkScroll() {
        if (scrollTopCombined() >= minScrollToReveal) {
            finish()
        }
    }

    function onWheel(event) {
        if (event.deltaY > 0 || event.deltaX !== 0) {
            finish()
        }
    }

    function teardown() {
        window.removeEventListener("scroll", checkScroll, scrollOpts)
        document.removeEventListener("scroll", checkScroll, documentScrollOpts)
        document.documentElement.removeEventListener("scroll", checkScroll, scrollOpts)
        document.body.removeEventListener("scroll", checkScroll, scrollOpts)
        window.removeEventListener("wheel", onWheel, scrollOpts)
    }

    function finish() {
        if (revealed) {
            return
        }
        revealed = true
        revealSkillsSection()
        teardown()
    }

    const skipWait =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        scrollTopCombined() >= minScrollToReveal ||
        initialHash === "#skills"

    if (skipWait) {
        skillsRoot.classList.remove("skills--await-scroll")
        skillsRoot.removeAttribute("inert")
        return
    }

    skillsRoot.setAttribute("inert", "")

    window.addEventListener("scroll", checkScroll, scrollOpts)
    document.addEventListener("scroll", checkScroll, documentScrollOpts)
    document.documentElement.addEventListener("scroll", checkScroll, scrollOpts)
    document.body.addEventListener("scroll", checkScroll, scrollOpts)
    window.addEventListener("wheel", onWheel, scrollOpts)
}
