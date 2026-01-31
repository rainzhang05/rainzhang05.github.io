// Intro sequence and animations

function runIntroSequence() {
    const startIntro = () => {
        animateIntro()
        initTypewriter()
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
function animateIntro() {
    if (hasIntroAnimated) {
        return
    }

    const selectors = [
        ".navigationBar",
        "#introHeading",
        "#introName",
        "#introParagraph",
        ".resumeButton",
        ".intro-photo",
        "#dock",
    ]
    const introElements = selectors
        .map((selector) => document.querySelector(selector))
        .filter((element) => Boolean(element))

    if (!introElements.length) {
        document.body.classList.remove("intro-prep")
        document.body.classList.add("intro-animate")
        hasIntroAnimated = true
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
    })

    hasIntroAnimated = true
}
