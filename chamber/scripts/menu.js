// Menu toggle
const menuBtn = document.getElementById("menu-btn");
const mainNav = document.getElementById("main-nav");

if (menuBtn && mainNav) {
    menuBtn.addEventListener("click", () => {
        const expanded = menuBtn.getAttribute("aria-expanded") === "true";
        menuBtn.setAttribute("aria-expanded", String(!expanded));
        mainNav.classList.toggle("open");
    });
}
