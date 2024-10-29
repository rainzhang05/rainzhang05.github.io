document.addEventListener("DOMContentLoaded", () => {
    // Add fade-in effect to sections as they come into view
    const sections = document.querySelectorAll(".animate-section");
    const options = { threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => observer.observe(section));

    document.querySelectorAll(".button").forEach(button => {
        button.addEventListener("mouseover", () => {
            button.style.boxShadow = "0px 4px 15px rgba(138, 43, 226, 0.5)";
        });
        button.addEventListener("mouseleave", () => {
            button.style.boxShadow = "none";
        });
    });
});
