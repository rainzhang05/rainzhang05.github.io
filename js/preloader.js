const PRELOADER_INTERACTION_EVENTS = ["touchmove", "wheel", "keydown"]
const PRELOADER_INTERACTION_OPTIONS = { passive: false, capture: true }
const PRELOADER_SCROLL_KEYS = new Set([
    " ",
    "Spacebar",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "PageUp",
    "PageDown",
    "Home",
    "End",
])

function isEditablePreloaderTarget(target) {
    return Boolean(
        target &&
            typeof target.closest === "function" &&
            target.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]')
    )
}

function isInteractivePreloaderTarget(target) {
    return Boolean(
        target &&
            typeof target.closest === "function" &&
            target.closest('button, [role="button"], a[href], input, textarea, select')
    )
}

function shouldPreventPreloaderInteraction(event) {
    if (event.type === "keydown") {
        if (!PRELOADER_SCROLL_KEYS.has(event.key)) {
            return false
        }

        if (isEditablePreloaderTarget(event.target)) {
            return false
        }

        if ((event.key === " " || event.key === "Spacebar") && isInteractivePreloaderTarget(event.target)) {
            return false
        }
    }

    return true
}

function preventPreloaderInteraction(event) {
    if (!document.documentElement.classList.contains("is-preloading")) {
        return
    }

    if (!shouldPreventPreloaderInteraction(event)) {
        return
    }

    if (event.cancelable) {
        event.preventDefault()
    }

    event.stopPropagation()
}

function setPreloaderClassState(isPreloading) {
    document.documentElement.classList.toggle("is-preloading", isPreloading)
    if (document.body) {
        document.body.classList.toggle("is-preloading", isPreloading)
    }
}

function lockPreloaderInteractions() {
    if (PORTFOLIO_STATE.preloader.interactionsLocked) {
        return
    }

    PORTFOLIO_STATE.preloader.interactionsLocked = true
    PRELOADER_INTERACTION_EVENTS.forEach((eventName) => {
        document.addEventListener(eventName, preventPreloaderInteraction, PRELOADER_INTERACTION_OPTIONS)
    })

    setPreloaderClassState(true)
}

function unlockPreloaderInteractions() {
    if (!PORTFOLIO_STATE.preloader.interactionsLocked) {
        return
    }

    PORTFOLIO_STATE.preloader.interactionsLocked = false
    PRELOADER_INTERACTION_EVENTS.forEach((eventName) => {
        document.removeEventListener(eventName, preventPreloaderInteraction, PRELOADER_INTERACTION_OPTIONS)
    })

    setPreloaderClassState(false)
}

function waitForDelay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

function prefersReducedMotion() {
    try {
        return Boolean(
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
    } catch (error) {
        return false
    }
}

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

function collectRenderableImageUrls() {
    const imageUrls = new Set()
    const addUrl = (value) => {
        const normalized = normalizeAssetUrl(value)
        if (normalized) {
            imageUrls.add(normalized)
        }
    }

    document.querySelectorAll("img").forEach((image) => {
        image.loading = "eager"
        image.decoding = "async"

        addUrl(image.currentSrc || image.getAttribute("src") || image.src)
        parseSrcsetUrls(image.getAttribute("srcset") || image.srcset).forEach(addUrl)
    })

    document.querySelectorAll("source[srcset]").forEach((source) => {
        parseSrcsetUrls(source.getAttribute("srcset") || "").forEach(addUrl)
    })

    return Array.from(imageUrls)
}

function preloadImageUrl(url) {
    return new Promise((resolve) => {
        const preloaderImage = new Image()
        let isResolved = false

        const finalize = () => {
            if (isResolved) {
                return
            }

            isResolved = true
            clearTimeout(timeoutId)
            preloaderImage.removeEventListener("load", finalize)
            preloaderImage.removeEventListener("error", finalize)
            resolve()
        }

        const timeoutId = setTimeout(finalize, PORTFOLIO_CONFIG.preloaderAssetTimeoutMs)

        preloaderImage.addEventListener("load", finalize)
        preloaderImage.addEventListener("error", finalize)
        preloaderImage.decoding = "async"
        preloaderImage.src = url

        if (preloaderImage.complete) {
            finalize()
        }
    })
}

function waitForImages() {
    const imageUrls = collectRenderableImageUrls()
    if (!imageUrls.length) {
        return Promise.resolve()
    }

    return Promise.all(imageUrls.map((url) => preloadImageUrl(url)))
}

function waitForPreloadAssets() {
    return Promise.all([waitForWindowLoad(), waitForFonts(), waitForImages()]).catch(() => {})
}

function removeLoadGate(loadGateElement) {
    if (!loadGateElement) {
        unlockPreloaderInteractions()
        return
    }

    let removed = false
    const finalizeRemoval = () => {
        if (removed) {
            return
        }

        removed = true
        loadGateElement.removeEventListener("transitionend", finalizeRemoval)
        if (loadGateElement.parentNode) {
            loadGateElement.parentNode.removeChild(loadGateElement)
        }

        unlockPreloaderInteractions()
    }

    loadGateElement.addEventListener("transitionend", finalizeRemoval)
    setTimeout(finalizeRemoval, 800)
}

function completePreloading(loadGateElement) {
    if (document.body.classList.contains("preloading-complete")) {
        return
    }

    document.body.classList.add("preloading-complete")
    removeLoadGate(loadGateElement)
    initPage()
}

function beginPreloadingSequence() {
    lockPreloaderInteractions()

    const minimumDisplayTime = waitForDelay(400)
    const fallbackTimeout = waitForDelay(PORTFOLIO_CONFIG.preloaderFallbackTimeoutMs)
    const loadGateElement = document.getElementById("load-gate")

    Promise.all([
        minimumDisplayTime,
        Promise.race([waitForPreloadAssets(), fallbackTimeout]),
    ]).then(() => {
        completePreloading(loadGateElement)
    })
}

function initPage() {
    if (PORTFOLIO_STATE.page.isInitialized) {
        return
    }

    PORTFOLIO_STATE.page.isInitialized = true

    const initialHash = (window.location.hash || "").toLowerCase()
    removeHash()

    runIntroSequence()
    setupDockHoverEffects()
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

    const shouldRevealImmediately =
        prefersReducedMotion() ||
        getDocumentScrollTop() >= PORTFOLIO_CONFIG.skillsRevealScrollTop ||
        initialHash === "#skills"

    if (shouldRevealImmediately) {
        skillsRoot.classList.remove("skills--await-scroll")
        skillsRoot.removeAttribute("inert")
        return
    }

    let revealed = false
    const scrollOptions = { passive: true }
    const documentScrollOptions = { passive: true, capture: true }

    const finishReveal = () => {
        if (revealed) {
            return
        }

        revealed = true
        revealSkillsSection()
        teardownRevealListeners()
    }

    const checkScroll = () => {
        if (getDocumentScrollTop() >= PORTFOLIO_CONFIG.skillsRevealScrollTop) {
            finishReveal()
        }
    }

    const onWheel = (event) => {
        if (event.deltaY > 0 || event.deltaX !== 0) {
            finishReveal()
        }
    }

    function teardownRevealListeners() {
        window.removeEventListener("scroll", checkScroll, scrollOptions)
        document.removeEventListener("scroll", checkScroll, documentScrollOptions)
        document.documentElement.removeEventListener("scroll", checkScroll, scrollOptions)
        document.body.removeEventListener("scroll", checkScroll, scrollOptions)
        window.removeEventListener("wheel", onWheel, scrollOptions)
    }

    skillsRoot.setAttribute("inert", "")
    window.addEventListener("scroll", checkScroll, scrollOptions)
    document.addEventListener("scroll", checkScroll, documentScrollOptions)
    document.documentElement.addEventListener("scroll", checkScroll, scrollOptions)
    document.body.addEventListener("scroll", checkScroll, scrollOptions)
    window.addEventListener("wheel", onWheel, scrollOptions)
}

lockPreloaderInteractions()
