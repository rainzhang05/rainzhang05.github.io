// Clearing up the URL after refreshing the page
function removeHash() {
    history.pushState("", document.title, window.location.pathname + window.location.search)
}

history.scrollRestoration = "manual"

document.addEventListener("DOMContentLoaded", initPage)
window.addEventListener("pageshow", initPage)
window.addEventListener("load", initPage)

function initPage(event) {
    if (event && event.persisted) {
        location.reload()
        return
    }

    removeHash()
    window.scrollTo(0, 0)
    animateIntro()
    initTypewriter()
    setupDockHoverEffects()
    setupThemeToggle()
    setupHomeButton()
    setupHashLinkBehavior()
}

// Blur in Effect for Intro Elements
function animateIntro() {
    const introElements = document.querySelectorAll(".navigationBar, .introduction, #introHeading, #introParagraph")

    introElements.forEach((element, index) => {
        element.style.opacity = "0"
        element.style.filter = "blur(10px)"
        element.style.transform = "translateY(20px)"

        setTimeout(() => {
            element.style.transition = "opacity 1s ease, transform 1s ease, filter 1s ease"
            element.style.opacity = "1"
            element.style.filter = "blur(0)"
            element.style.transform = "translateY(0)"
        }, index * 200)
    })

    // Fade in Effect for Sections
    const sections = document.querySelectorAll(".skills, .experience, .projects, .education")
    const fadeInSection = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1"
                entry.target.style.transform = "translateY(0)"
                observer.unobserve(entry.target)
            }
        })
    }

    const sectionObserver = new IntersectionObserver(fadeInSection, {
        root: null,
        threshold: 0.1,
        rootMargin: "-50px",
    })

    sections.forEach((section) => {
        section.style.opacity = "0"
        section.style.transform = "translateY(50px)"
        section.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"
        sectionObserver.observe(section)
    })
}

// Typewriter Effect
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement
        this.words = words
        this.txt = ""
        this.wordIndex = 0
        this.wait = wait
        this.isDeleting = false
        this.type()
    }

    type() {
        const current = this.wordIndex % this.words.length
        const fullTxt = this.words[current]

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1)
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1)
        }

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`

        let typeSpeed = 100
        if (this.isDeleting) {
            typeSpeed /= 2
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait
            this.isDeleting = true
        } else if (this.isDeleting && this.txt === "") {
            this.isDeleting = false
            this.wordIndex++
            typeSpeed = 500
        }

        setTimeout(() => this.type(), typeSpeed)
    }
}

// Initialize Typewriter
function initTypewriter() {
    const txtElement = document.querySelector("#introName")
    const words = ["Rain Zhang", "a student majoring in CS", "living in vancouver"]
    const wait = 2000
    new TypeWriter(txtElement, words, wait)
}

// Dock Hover Effects
function setupDockHoverEffects() {
    const dock = document.getElementById("dock")
    const dockItems = dock.querySelectorAll(".dock-item")

    dockItems.forEach((item) => {
        item.addEventListener("mouseover", () => {
            item.style.transform = "scale(1.1)"
        })
        item.addEventListener("mouseout", () => {
            item.style.transform = "scale(1.0)"
        })
    })
}

// Light and Dark Mode Toggle
function setupThemeToggle() {
    const themeToggle = document.getElementById("themeToggle")
    const themeIcon = document.getElementById("themeIcon")
    const body = document.body

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode")
        updateThemeIcon()
    })

    function updateThemeIcon() {
        if (body.classList.contains("dark-mode")) {
            themeIcon.src = "https://api.iconify.design/lucide:moon.svg"
        } else {
            themeIcon.src = "https://api.iconify.design/lucide:sun.svg"
        }
    }
}

// Home Button
function setupHomeButton() {
    const homeButton = document.getElementById("homeButton")
    homeButton.addEventListener("click", (e) => {
        e.preventDefault()
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    })
}

// Smooth Scrolling for Hash Links
function setupHashLinkBehavior() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault()
            const targetId = this.getAttribute("href").substring(1)
            const targetElement = document.getElementById(targetId)
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth",
                })
            }
        })
    })
}