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
    let lastFocusedTrigger = null;

    const openModal = (modal, trigger) => {
        if (!modal) return;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        lastFocusedTrigger = trigger || document.activeElement;
        // Set aria-expanded on the learn-more button if available (preferred) or on the trigger if it's interactive
        try {
            let btn = null;
            if (lastFocusedTrigger && lastFocusedTrigger.tagName === 'BUTTON') btn = lastFocusedTrigger;
            else if (lastFocusedTrigger && lastFocusedTrigger.querySelector) btn = lastFocusedTrigger.querySelector('.learn-more');
            if (btn) btn.setAttribute('aria-expanded', 'true');
            else if (lastFocusedTrigger) lastFocusedTrigger.setAttribute('aria-expanded', 'true');
        } catch (err) { /* ignore */ }
        // focus on the first focusable element in modal
        const focusable = modal.querySelector('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) focusable.focus();
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        if (lastFocusedTrigger) {
            lastFocusedTrigger.focus();
            try {
                let btn = null;
                if (lastFocusedTrigger && lastFocusedTrigger.tagName === 'BUTTON') btn = lastFocusedTrigger;
                else if (lastFocusedTrigger && lastFocusedTrigger.querySelector) btn = lastFocusedTrigger.querySelector('.learn-more');
                if (btn) btn.setAttribute('aria-expanded', 'false');
                else lastFocusedTrigger.setAttribute('aria-expanded', 'false');
            } catch (err) { /* ignore */ }
        }
        lastFocusedTrigger = null;
    };

    cards.forEach(card => {
        card.addEventListener("click", (e) => {
            const id = card.getAttribute("data-modal");
            const modal = document.getElementById(id);
            openModal(modal, e.currentTarget);
        });
        //  support keyboard activation (Enter / Space)
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const id = card.getAttribute("data-modal");
                const modal = document.getElementById(id);
                e.preventDefault();
                openModal(modal, card);
            }
        });
    });
    // prevent anchors inside cards from changing the url/hash and instead delegate to card
    // support 'learn more' buttons in cards
    const learnBtns = document.querySelectorAll('.learn-more');
    learnBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const card = btn.closest('.card');
            const id = card ? card.getAttribute('data-modal') : btn.getAttribute('aria-controls');
            const modal = document.getElementById(id);
            openModal(modal, btn);
        });
    });

    closes.forEach(close => {
        close.addEventListener("click", () => {
            const modal = close.closest('.modal');
            closeModal(modal);
        });
    });

    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            closeModal(e.target);
        }
    });

    // Handle Escape key for modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModalEl = document.querySelector('.modal[aria-hidden="false"]');
            if (openModalEl) closeModal(openModalEl);
        }
    });
});
