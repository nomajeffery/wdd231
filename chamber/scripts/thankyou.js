document.addEventListener('DOMContentLoaded', () => {
  // Update year if missing (join.js will also handle it on other pages)
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Parse query string and populate the fields on the thank-you page
  const params = new URLSearchParams(window.location.search);

  const membershipMap = {
    np: 'NP Membership (No Fee)',
    bronze: 'Bronze Membership',
    silver: 'Silver Membership',
    gold: 'Gold Membership'
  };

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value || '—';
  };

  setText('firstName', params.get('firstName'));
  setText('lastName', params.get('lastName'));
  setText('email', params.get('email'));
  setText('phone', params.get('phone'));
  setText('businessName', params.get('businessName'));
  setText('title', params.get('title'));

  const level = params.get('membershipLevel');
  setText('membershipLevel', level ? (membershipMap[level] || level) : '—');

  const ts = params.get('timestamp');
  if (ts) {
    const tsEl = document.getElementById('timestamp');
    if (tsEl) {
      try {
        const d = new Date(ts);
        tsEl.textContent = isNaN(d) ? ts : d.toLocaleString();
      } catch (e) {
        tsEl.textContent = ts;
      }
    }
  }
});
