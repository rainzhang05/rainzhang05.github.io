// Intro Fade in Effect
document.addEventListener("DOMContentLoaded", () => {
    const introElements = document.querySelectorAll(".navigationBar, .introduction, #introHeading, #introParagraph")
    introElements.forEach((element, index) => {
        element.style.opacity = "0"
        element.style.transform = "translateY(20px)"
        setTimeout(() => {
            element.style.transition = "opacity 1s ease, transform 1s ease"
            element.style.opacity = "1"
            element.style.transform = "translateY(0)"
        }, index * 200)
    })

    // Fade in Effect for Sections on Scroll
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

    // Typewriter Effect
    class TypeWriter {
        constructor(txtElement, words, wait = 3000) {
            this.txtElement = txtElement
            this.words = words
            this.txt = ""
            this.wordIndex = 0
            this.wait = Number.parseInt(wait, 10)
            this.type()
            this.isDeleting = false
        }

        type() {
            const current = this.wordIndex % this.words.length
            const fullTxt = this.words[current]

            // Check if deleting
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

            // If the word is complete
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

    // Init Typewriter
    function init() {
        const txtElement = document.querySelector("#introName")
        const words = ["Rain Zhang", "a Computer Science Student", "Studying in Vancouver"]
        const wait = 2000
        new TypeWriter(txtElement, words, wait)
    }

    init()
})