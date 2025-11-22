document.addEventListener("DOMContentLoaded", () => {

    // Update year
    const yearElement = document.getElementById("year");
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    // Timestamp
    const timestampField = document.getElementById("timestamp");
    if (timestampField) timestampField.value = new Date().toISOString();

    // Dark mode toggle
    const darkToggle = document.getElementById("dark-toggle");
    if (darkToggle) {
        darkToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark");
        });
    }

    // Membership Pricing
    const prices = { np: "₦0", bronze: "₦50,000", silver: "₦120,000", gold: "₦250,000" };
    const membershipSelect = document.getElementById("membershipLevel");
    const priceDisplay = document.getElementById("membership-price");

    if (membershipSelect && priceDisplay) {
        membershipSelect.addEventListener("change", () => {
            const val = membershipSelect.value;
            priceDisplay.textContent = prices[val] ? `Price: ${prices[val]}` : "";
        });
    }

    // Modal functionality
    const cards = document.querySelectorAll(".card");
    const closes = document.querySelectorAll(".close");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-modal");
            const modal = document.getElementById(id);
            if (modal) modal.style.display = "flex";
        });
    });

    closes.forEach(close => {
        close.addEventListener("click", () => {
            close.parentElement.parentElement.style.display = "none";
        });
    });

    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) e.target.style.display = "none";
    });
});
