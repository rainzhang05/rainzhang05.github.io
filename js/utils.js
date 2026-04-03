function getDocumentScrollTop() {
    const scrollingElement = document.scrollingElement

    return (
        window.scrollY ||
        window.pageYOffset ||
        (scrollingElement && scrollingElement.scrollTop) ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
    )
}

function ensureIntroTextSpan(container) {
    if (!container) {
        return null
    }

    let textSpan = container.querySelector(".txt")
    if (!textSpan) {
        textSpan = container.querySelector("span")

        if (!textSpan) {
            textSpan = document.createElement("span")
            container.textContent = ""
            container.appendChild(textSpan)
        }

        textSpan.classList.add("txt")
    }

    return textSpan
}

function primeIntroTextSpan(container) {
    const textSpan = ensureIntroTextSpan(container)
    if (!textSpan) {
        return null
    }

    textSpan.classList.add("is-caret-hidden")
    textSpan.classList.remove("is-caret-active")
    return textSpan
}

function normalizeAssetUrl(url) {
    if (!url) {
        return ""
    }

    try {
        return new URL(url, window.location.href).href
    } catch (error) {
        return ""
    }
}

function parseSrcsetUrls(srcset) {
    if (!srcset) {
        return []
    }

    return srcset
        .split(",")
        .map((entry) => entry.trim().split(/\s+/)[0])
        .filter(Boolean)
}
