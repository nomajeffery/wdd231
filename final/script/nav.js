// nav.js - final site navbar module
// Exported function: initNavbar()
// Provides toggling for the #nav-toggler button and #main-nav collapse element
export default function initNavbar() {
  const toggler = document.getElementById('nav-toggler') || document.querySelector('button[aria-controls="main-nav"]');
  const mainNav = document.getElementById('main-nav');
  if (!toggler || !mainNav) return;

  const open = () => {
    toggler.setAttribute('aria-expanded', 'true');
    mainNav.classList.add('open');
    mainNav.hidden = false;
  };
  const close = () => {
    toggler.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('open');
    mainNav.hidden = true;
  };

  const toggle = () => (toggler.getAttribute('aria-expanded') === 'true' ? close() : open());

  toggler.addEventListener('click', (e) => {
    e.preventDefault();
    toggle();
  });

  toggler.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });

  // close on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggler.getAttribute('aria-expanded') === 'true') {
      close();
    }
  });

  // close when clicking outside
  document.addEventListener('click', (e) => {
    if (!mainNav.classList.contains('open')) return;
    const t = e.target;
    if (t === toggler || toggler.contains(t)) return;
    if (mainNav.contains(t)) return;
    close();
  });

  // close nav on large breakpoints
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) close();
  });

  // close nav when clicking a link (nice UX for single page)
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    if (mainNav.classList.contains('open')) close();
  }));
}
