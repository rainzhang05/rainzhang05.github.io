document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.querySelector('.custom-cursor');
    document.addEventListener("mousemove", (e) => {
        cursor.style.left = e.pageX + "px";
        cursor.style.top = e.pageY + "px";
    });

    document.querySelectorAll(".button").forEach(button => {
        button.addEventListener("mouseover", () => {
            cursor.classList.add("cursor-hover");
        });
        button.addEventListener("mouseleave", () => {
            cursor.classList.remove("cursor-hover");
        });
    });

    const sections = document.querySelectorAll(".animate-section");
    const options = { threshold: 0.2 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => observer.observe(section));
});
