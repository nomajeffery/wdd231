/* nav.js - header navigation & theme toggles
   Handles the mobile menu button and the dark mode toggle.
   Accessible, keyboard-friendly, and persists theme in localStorage.
*/

document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const mainNav = document.getElementById('main-nav');
  const darkToggle = document.getElementById('dark-toggle');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // If element not found, skip gracefully - allow pages without nav.
  if (!menuBtn && !darkToggle) return;

  // ---------- Menu behavior ----------
  if (menuBtn && mainNav) {
    const open = () => {
      menuBtn.setAttribute('aria-expanded', 'true');
      mainNav.classList.add('open');
      // Also ensure the internal list toggles for CSS that targets .list.open
      const list = mainNav.querySelector('.list');
      if (list) list.classList.add('open');
      menuBtn.classList.add('open');
      document.body.classList.add('nav-open');
    };
    const close = () => {
      menuBtn.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('open');
      const list = mainNav.querySelector('.list');
      if (list) list.classList.remove('open');
      menuBtn.classList.remove('open');
      document.body.classList.remove('nav-open');
    };

    const toggle = () => (menuBtn.getAttribute('aria-expanded') === 'true' ? close() : open());

    menuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggle();
    });

    menuBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });

    // Close when pressing Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
        close();
      }
    });

    // Close when clicking outside the nav + menu button
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('open')) {
        const t = e.target;
        if (t === menuBtn || menuBtn.contains(t)) return;
        if (mainNav.contains(t)) return;
        close();
      }
    });

    // Close when clicking a nav link (useful for single-page or long-scroll anchors)
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        // close the mobile navigation
        if (mainNav.classList.contains('open')) close();
      });
    });

    // Close on breakpoint change
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mainNav.classList.contains('open')) {
        close();
      }
    });
  }

  // ---------- Theme / Dark Mode Toggle ----------
  const setTheme = (theme) => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
      if (darkToggle) {
        darkToggle.setAttribute('aria-pressed', 'true');
        darkToggle.textContent = '☀️';
      }
    } else {
      document.body.classList.remove('dark');
      if (darkToggle) {
        darkToggle.setAttribute('aria-pressed', 'false');
        darkToggle.textContent = '🌙';
      }
    }
  };

  const initTheme = () => {
    const stored = localStorage.getItem('site-theme');
    if (stored === 'dark') return setTheme('dark');
    if (stored === 'light') return setTheme('light');
    if (prefersDark) return setTheme('dark');
    return setTheme('light');
  };

  if (darkToggle) {
    darkToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const current = document.body.classList.contains('dark') ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
      try { localStorage.setItem('site-theme', next); } catch (err) { /* ignore */ }
    });

    darkToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        darkToggle.click();
      }
    });
  }

  // Initialize theme and nav initial state
  initTheme();

  // If menu button exists, ensure aria-expanded is defined
  if (menuBtn) menuBtn.setAttribute('aria-expanded', menuBtn.getAttribute('aria-expanded') || 'false');
});
