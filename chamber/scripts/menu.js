// Menu toggle (robust version)
document.addEventListener('DOMContentLoaded', () => {
    let menuBtn = document.getElementById('menu-btn');
    const mainNav = document.getElementById('main-nav');

    // fallback - try to find a button that controls the main nav
    if (!menuBtn) menuBtn = document.querySelector('button[aria-controls="main-nav"]');

    if (!menuBtn || !mainNav) return;

    const openNav = () => {
        menuBtn.setAttribute('aria-expanded', 'true');
        mainNav.classList.add('open');
        menuBtn.classList.add('open');
        document.body.classList.add('nav-open');
    };

    const closeNav = () => {
        menuBtn.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('open');
        menuBtn.classList.remove('open');
        document.body.classList.remove('nav-open');
    };

    const toggleNav = () => {
        const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
        if (expanded) closeNav(); else openNav();
    };

    // click handler
    menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleNav();
    });

    // keyboard support: Enter/Space toggles, Escape closes
    menuBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleNav();
        }
    });

    // Close when pressing Escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
            if (expanded) closeNav();
        }
    });

    // Close when clicking outside the nav + menu button
    document.addEventListener('click', (e) => {
        if (!mainNav.classList.contains('open')) return;
        const target = e.target;
        if (target === menuBtn || menuBtn.contains(target)) return;
        if (mainNav.contains(target)) return;
        closeNav();
    });

    // Close on resize (desktop breakpoint)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeNav();
    });
});
