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
    const preloaderElement = document.getElementById("preloader")

    const completePreloading = () => {
        if (document.body.classList.contains("preloading-complete")) {
            return
        }

        document.body.classList.add("preloading-complete")
        document.body.classList.remove("is-preloading")

        if (preloaderElement) {
            const removePreloader = () => {
                preloaderElement.removeEventListener("transitionend", removePreloader)
                if (preloaderElement.parentNode) {
                    preloaderElement.parentNode.removeChild(preloaderElement)
                }
            }

            preloaderElement.addEventListener("transitionend", removePreloader)
            // Ensure the transition runs even if the browser does not trigger transitionend.
            setTimeout(removePreloader, 800)
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
