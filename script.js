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
})