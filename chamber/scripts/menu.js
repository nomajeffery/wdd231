// Menu toggle
const menuBtn = document.getElementById("menu-btn");
const mainNav = document.getElementById("main-nav");

menuBtn.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", !expanded);
    mainNav.classList.toggle("open");
});
