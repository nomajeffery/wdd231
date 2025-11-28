// search.js - handles the search button and emits an event to be handled by app.js
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('search-btn');
  const input = document.getElementById('search');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    // let app.js handle the actual filtering, dispatch a lightweight event
    document.dispatchEvent(new CustomEvent('app.search', { detail: { query: input?.value || '' } }));
  });
});
