//  Update Footer Date Automatically
document.querySelector(".modification").textContent = document.lastModified;

//  Responsive Menu Toggle
const menuButton = document.querySelector("#menu");
const navList = document.querySelector(".list");

menuButton.addEventListener("click", () => {
  navList.classList.toggle("open");
  menuButton.textContent = navList.classList.contains("open") ? "✖" : "☰";
});

// Fetch and Display Members from JSON
async function loadMembers() {
  try {
    const response = await fetch("data/members.json");
    const data = await response.json();
    displayMembers(data.members);
  } catch (error) {
    console.error("Error loading members:", error);
  }
}

function displayMembers(members) {
  const cardsContainer = document.getElementById("cards");
  cardsContainer.innerHTML = "";

  members.forEach(member => {
    const section = document.createElement("section");
    section.innerHTML = `
      <img src="${member.image}" alt="${member.name}" loading="lazy" width="200" height="200">
      <h2>${member.name}</h2>
      <p><strong>Address:</strong> ${member.address}</p>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <p><a href="${member.website}" target="_blank">${member.website}</a></p>
      <p><strong>Membership:</strong> ${member.membership}</p>
    `;
    cardsContainer.appendChild(section);
  });

  // Animate cards when they appear
  const cards = document.querySelectorAll("#cards section");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  cards.forEach(card => observer.observe(card));
}

//Grid/List View Toggle
const gridButton = document.getElementById("grid-toggle");
const listButton = document.getElementById("list-toggle");
const cardsContainer = document.getElementById("cards");

gridButton.addEventListener("click", () => {
  cardsContainer.classList.add("grid-view");
  cardsContainer.classList.remove("list-view");
  gridButton.classList.add("active-view");
  listButton.classList.remove("active-view");
});

listButton.addEventListener("click", () => {
  cardsContainer.classList.add("list-view");
  cardsContainer.classList.remove("grid-view");
  listButton.classList.add("active-view");
  gridButton.classList.remove("active-view");
});

// Load Members When Page is Ready
document.addEventListener("DOMContentLoaded", loadMembers);
