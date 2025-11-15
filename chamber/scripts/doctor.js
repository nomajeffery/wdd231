// Responsive menu
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.querySelector('.nav-links');
menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// WEATHER SECTION (OpenWeather API)
const apiKey = ""; 
const city = "edo";
const weatherContainer = document.getElementById("weather-data");

async function getWeather() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
    const res = await fetch(url);
    const data = await res.json();

    const current = data.list[0];
    const currentTemp = Math.round(current.main.temp);
    const description = current.weather[0].description;

    const forecast = data.list.filter((_, i) => i % 8 === 0).slice(1, 4);

    weatherContainer.innerHTML = `
      <p><strong>Current:</strong> ${currentTemp}°F, ${description}</p>
      <h3>3-Day Forecast</h3>
      <ul>
        ${forecast
          .map(
            (day) => `
          <li>${new Date(day.dt_txt).toLocaleDateString([], { weekday: "short" })}: ${Math.round(day.main.temp)}°F</li>
        `
          )
          .join("")}
      </ul>
    `;
  } catch (error) {
    weatherContainer.innerHTML = `<p>Weather data unavailable.</p>`;
  }
}
getWeather();

// COMPANY SPOTLIGHT
async function loadSpotlights() {
  const res = await fetch("data/menber.json");
  const data = await res.json();

  const goldSilver = data.members.filter(
    (m) => m.membership === "Gold" || m.membership === "Silver"
  );
  const selected = goldSilver.sort(() => 0.5 - Math.random()).slice(0, 3);

  const container = document.getElementById("spotlight-container");
  container.innerHTML = selected
    .map(
      (m) => `
    <div class="spotlight">
      <img src="${m.logo}" alt="${m.name} logo" />
      <h3>${m.name}</h3>
      <p>${m.membership} Member</p>
      <p>📞 ${m.phone}</p>
      <p>📍 ${m.address}</p>
      <a href="${m.website}" target="_blank" class="cta-btn">Visit Website</a>
    </div>`
    )
    .join("");
}
loadSpotlights();


let heroIndex = 0;
autoHeroSlides();

function autoHeroSlides() {
  const slides = document.querySelectorAll(".hero-slide");
  slides.forEach(slide => {
    slide.style.display = "none";
  });

  heroIndex++;
  if (heroIndex > slides.length) heroIndex = 1;

  const currentSlide = slides[heroIndex - 1];
  currentSlide.style.display = "block";

  setTimeout(autoHeroSlides, 5000); // Change every 5 seconds
}
