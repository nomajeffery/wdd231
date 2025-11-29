// localStorage visit message
const message = document.getElementById('visit-message');
const lastVisit = localStorage.getItem('lastVisit');
const now = new Date();
if (lastVisit) {
  const days = Math.floor((now - new Date(lastVisit)) / (1000 * 60 * 60 * 24));
  message.textContent = `Welcome back! It’s been ${days} day(s) since your last visit.`;
} else {
  message.textContent = "Welcome to the Discover Page!";
}
localStorage.setItem('lastVisit', now);

// Load JSON data with robust error handling
async function loadMembers() {
  const grid = document.querySelector('.cards-grid');
  if (!grid) return;
  grid.innerHTML = '';
  try {
    // Use a relative path explicitly
    const res = await fetch('./data/members.json');
    if (!res.ok) throw new Error(`Network error: ${res.status}`);
    const json = await res.json();
    const members = Array.isArray(json) ? json : (json.members || []);
    if (!members.length) {
      grid.innerHTML = '<p class="text">No members found.</p>';
      return;
    }

    // Build DOM nodes to avoid inline event attributes and to set image onerror handlers
    members.forEach(member => {
        console.debug('discover.js: loaded', members.length, 'members');
      const card = document.createElement('article');
      card.className = 'card';

      const img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = member.name || 'Member';
      img.src = member.image || 'images/main1.webp';
      // fallback to placeholder on image error
      img.onerror = () => { img.onerror = null; img.src = 'images/main1.webp'; };

      const body = document.createElement('div');
      body.className = 'card-body';
      const h2 = document.createElement('h2');
      h2.textContent = member.name || '—';
      const addr = document.createElement('p');
      addr.textContent = member.address || '';
      const desc = document.createElement('p');
      // JSON doesn't include 'description' field; use available fields such as specialty and phone.
      desc.textContent = member.description || member.specialty || member.phone || '';
      const a = document.createElement('a');
      a.href = member.website || '#';
      a.className = 'btn';
      a.textContent = 'Learn More';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';

      body.appendChild(h2);
      if (addr.textContent) body.appendChild(addr);
      if (desc.textContent) body.appendChild(desc);
      body.appendChild(a);
      card.appendChild(img);
      card.appendChild(body);
      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load members.json', err);
    grid.innerHTML = '<p class="error">Unable to load members. Please try again later or check console for details.</p>';
  }
}

// Kick off JSON load
loadMembers();
