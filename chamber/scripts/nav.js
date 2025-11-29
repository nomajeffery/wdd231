/* nav.js - header navigation & theme toggles
   Handles the mobile menu button and the dark mode toggle.
   Accessible, keyboard-friendly, and persists theme in localStorage.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Try multiple selectors for the toggler to support various pages/markup
  const mainNav = document.getElementById('main-nav') || document.querySelector('nav[aria-label="Primary Navigation"]') || document.querySelector('nav');
  let menuBtn = document.getElementById('menu-btn') || document.querySelector('button[aria-controls="main-nav"]') || document.querySelector('.site-toggler') || document.querySelector('.navbar-toggler') || document.getElementById('nav-toggler') || document.querySelector('#menu');
  const darkToggle = document.getElementById('dark-toggle');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  console.debug('nav.js init', { menuBtn: !!menuBtn, mainNav: !!mainNav, darkToggle: !!darkToggle });
  // If the page has a navigation but no toggler, create a lightweight toggler for mobile
  if (mainNav && !menuBtn) {
    console.debug('nav.js: no toggler found, creating fallback toggler');
    const fallback = document.createElement('button');
    fallback.id = 'menu-btn';
    fallback.type = 'button';
    fallback.className = 'site-toggler';
    fallback.setAttribute('aria-controls', 'main-nav');
    fallback.setAttribute('aria-expanded', 'false');
    fallback.setAttribute('aria-label', 'Toggle navigation menu');
    fallback.textContent = '☰';
    // Insert before the mainNav so it inherits CSS; prefer nav > first child
    if (mainNav.parentNode) mainNav.parentNode.insertBefore(fallback, mainNav);
    menuBtn = fallback;
  }
  // Mark the toggler as initialized so CSS debug helpers can highlight it
  if (menuBtn && typeof menuBtn.setAttribute === 'function') menuBtn.setAttribute('data-nav-initialized', 'true');
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
      // If mainNav hidden attribute is used to hide nav on some pages, clear it
      if (typeof mainNav.hidden !== 'undefined') mainNav.hidden = false;
      document.body.classList.add('nav-open');
    };
    const close = () => {
      menuBtn.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('open');
      const list = mainNav.querySelector('.list');
      if (list) list.classList.remove('open');
      menuBtn.classList.remove('open');
      if (typeof mainNav.hidden !== 'undefined') mainNav.hidden = true;
      document.body.classList.remove('nav-open');
    };

    const toggle = () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      console.debug('nav.js toggle, expanded:', expanded);
      return expanded ? close() : open();
    };

    // Pointer event support covers touch and mouse events consistently
    let ignoreNextClick = false;
    menuBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      // ensure button doesn't act as a submit button
      if (menuBtn.type !== 'button') menuBtn.type = 'button';
      // set a short flag to prevent the subsequent click event from double toggling
      ignoreNextClick = true;
      setTimeout(() => { ignoreNextClick = false; }, 200);
      toggle();
    });

    // click fallback (some environments rely on click)
    menuBtn.addEventListener('click', (e) => {
      if (ignoreNextClick) {
        // skip handled pointerdown
        e.preventDefault();
        return;
      }
      e.preventDefault();
      toggle();
    });

    // Log interactions for debugging
    ['pointerdown','click'].forEach(name => menuBtn.addEventListener(name, (e) => console.debug('nav.js event', name, 'expanded:', menuBtn.getAttribute('aria-expanded'))));

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
