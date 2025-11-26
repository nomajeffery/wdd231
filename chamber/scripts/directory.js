// === Update Footer Date Automatically ===
const modSpan = document.querySelector(".modification");
if (modSpan) {
  modSpan.textContent = new Date(document.lastModified).toLocaleString("en-NG", {
    dateStyle: "long",
    timeStyle: "short"
  });
}

// === Responsive Menu Toggle ===
const menuButton = document.querySelector("#menu");
const navList = document.querySelector(".list");

if (menuButton && navList) {
  menuButton.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.textContent = isOpen ? "✖" : "☰";
  });
}

// === Fetch and Display Members from JSON ===
async function loadMembers() {
  try {
    const response = await fetch("data/members.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    displayMembers(data.members);
  } catch (error) {
    console.error("Error loading members:", error);
    const cardsContainer = document.getElementById("cards");
    if (cardsContainer) {
      cardsContainer.innerHTML = `<p role="alert" class="alert-error">Failed to load member directory. Please try again later.</p>`;
    }
  }
}

function displayMembers(members) {
  const cardsContainer = document.getElementById("cards");
  if (!cardsContainer) return;

  cardsContainer.innerHTML = "";
  cardsContainer.setAttribute("aria-live", "polite"); 

  members.forEach(member => {
    const section = document.createElement("section");
    section.tabIndex = 0;
    section.innerHTML = `
      <img 
        src="${member.image}" 
        alt="${member.name} logo" 
        loading="lazy" 
        width="200" 
        height="200">
      <h2>${member.name}</h2>
      <p><strong>Address:</strong> ${member.address}</p>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <p><a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website}</a></p>
      <p><strong>Membership:</strong> ${member.membership}</p>
    `;
    cardsContainer.appendChild(section);
  });

  // === Animate cards when they appear ===
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

// === Grid/List View Toggle ===
const gridButton = document.getElementById("grid-toggle");
const listButton = document.getElementById("list-toggle");
const cardsContainer = document.getElementById("cards");

if (gridButton && listButton && cardsContainer) {
  function setViewMode(mode) {
    const isGrid = mode === "grid";
    cardsContainer.classList.toggle("grid-view", isGrid);
    cardsContainer.classList.toggle("list-view", !isGrid);

    gridButton.classList.toggle("active-view", isGrid);
    listButton.classList.toggle("active-view", !isGrid);

    gridButton.setAttribute("aria-pressed", isGrid);
    listButton.setAttribute("aria-pressed", !isGrid);
  }

  gridButton.addEventListener("click", () => setViewMode("grid"));
  listButton.addEventListener("click", () => setViewMode("list"));
}

// === Load Members When Page is Ready ===
document.addEventListener("DOMContentLoaded", loadMembers);
