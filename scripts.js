document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".skill, .project-card").forEach(item => {
        item.addEventListener("mouseover", () => {
            item.style.boxShadow = "0px 4px 20px rgba(0, 0, 0, 0.2)";
        });
        item.addEventListener("mouseleave", () => {
            item.style.boxShadow = "none";
        });
    });
});
