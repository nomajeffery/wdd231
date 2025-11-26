// localStorage message
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

// Load JSON data
fetch('data/members.json')
  .then(res => res.json())
  .then(data => {
    const grid = document.querySelector('.cards-grid');
    grid.innerHTML = '';
    data.forEach(member => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img src="${member.image}" alt="${member.name}" loading="lazy">
        <div class="card-body">
          <h2>${member.name}</h2>
          <p>${member.address}</p>
          <p>${member.description}</p>
          <a href="${member.link}" class="btn">Learn More</a>
        </div>`;
      grid.appendChild(card);
    });
  });
