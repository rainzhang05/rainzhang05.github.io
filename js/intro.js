// Intro sequence and animations

function primeIntroTerminalLineIfNeeded(container) {
    primeIntroTextSpan(container)
}

function primeIntroTerminalShellIfNeeded() {
    primeIntroTerminalLineIfNeeded(document.querySelector("#introGreeting"))
    primeIntroTerminalLineIfNeeded(document.querySelector("#introName"))
    /* Keep both rows structurally stable; caret visibility is toggled later to keep one visible caret. */
}

function runIntroSequence() {
    const startIntro = () => {
        animateIntro(() => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                applyIntroTerminalReducedMotion()
                return
            }
            initIntroTerminalTyping()
        })
    }

    if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === "function") {
        document.fonts.ready.then(
            () => {
                startIntro()
            },
            () => {
                startIntro()
            }
        )
    } else {
        startIntro()
    }
}

// Reveal in Effect for Intro Elements with improved animation
function animateIntro(onIntroTerminalReady) {
    if (PORTFOLIO_STATE.page.hasIntroAnimated) {
        return
    }

    const selectors = [
        "#dock",
        "#introParagraph",
        ".resumeButton",
        ".intro-photo",
    ]
    const introElements = selectors
        .map((selector) => document.querySelector(selector))
        .filter((element) => Boolean(element))

    const notifyTerminalReady =
        typeof onIntroTerminalReady === "function" ? onIntroTerminalReady : null

    if (!introElements.length) {
        document.body.classList.remove("intro-prep")
        document.body.classList.add("intro-animate")
        PORTFOLIO_STATE.page.hasIntroAnimated = true
        if (notifyTerminalReady) {
            notifyTerminalReady()
        }
        return
    }

    introElements.forEach((element, index) => {
        element.classList.add("intro-target")
        element.style.setProperty("--intro-delay", `${index * 0.12}s`)

        const clearIntroState = () => {
            element.classList.remove("intro-target")
            element.style.removeProperty("--intro-delay")
        }

        const handleAnimationEnd = (event) => {
            if (event.target !== element) {
                return
            }

            clearIntroState()
            element.removeEventListener("animationend", handleAnimationEnd)
            clearTimeout(fallbackTimeout)
        }

        element.addEventListener("animationend", handleAnimationEnd)

        const fallbackTimeout = setTimeout(() => {
            if (element.classList.contains("intro-target")) {
                clearIntroState()
                element.removeEventListener("animationend", handleAnimationEnd)
            }
        }, 1200 + index * 120)
    })

    requestAnimationFrame(() => {
        document.body.classList.add("intro-animate")
        document.body.classList.remove("intro-prep")
        primeIntroTerminalShellIfNeeded()

        if (!notifyTerminalReady) {
            return
        }

        const terminal = document.querySelector("#introTerminal")
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        const terminalIsAnimated = Boolean(terminal && introElements.includes(terminal))

        if (reducedMotion || !terminalIsAnimated) {
            requestAnimationFrame(() => {
                notifyTerminalReady()
            })
            return
        }

        let finished = false
        const finish = () => {
            if (finished) {
                return
            }
            finished = true
            terminal.removeEventListener("animationend", onAnimationEnd)
            requestAnimationFrame(() => {
                notifyTerminalReady()
            })
        }

        const onAnimationEnd = (event) => {
            if (event.target !== terminal) {
                return
            }
            finish()
        }

        terminal.addEventListener("animationend", onAnimationEnd)

        const terminalIndex = introElements.indexOf(terminal)
        const staggerMs = terminalIndex >= 0 ? terminalIndex * 120 : 0
        const fallbackMs = staggerMs + 750 + 100
        setTimeout(finish, fallbackMs)
    })

    PORTFOLIO_STATE.page.hasIntroAnimated = true
}
