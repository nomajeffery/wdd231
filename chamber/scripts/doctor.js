// FOOTER YEAR
document.getElementById("year").textContent = new Date().getFullYear();

// MOBILE MENU
const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("main-nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", nav.classList.contains("open"));
});

const API_KEY = "YOUR_API_KEY_HERE";  
const CITY = "Benin City";
const weatherBox = document.getElementById("weather-data");

async function loadWeather() {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();

    const current = data.list[0];
    const temp = Math.round(current.main.temp);
    const desc = current.weather[0].description;

    const forecast = data.list.filter((_, i) => i % 8 === 0).slice(1, 4);

    weatherBox.innerHTML = `
      <p><strong>Current:</strong> ${temp}°C – ${desc}</p>
      <h3>3-Day Forecast</h3>
      <ul>
        ${forecast
          .map(
            (day) =>
              `<li>${new Date(day.dt_txt).toLocaleDateString("en-US", {
                weekday: "short",
              })}: ${Math.round(day.main.temp)}°C</li>`
          )
          .join("")}
      </ul>`;
  } catch (err) {
    weatherBox.innerHTML = "<p>Weather unavailable.</p>";
  }
}

loadWeather();

async function loadSpotlights() {
  const res = await fetch("data/members.json");
  const data = await res.json();

  const goldSilver = data.members.filter(
    (m) => m.membership === "gold" || m.membership === "silver"
  );

  const selected = goldSilver.sort(() => Math.random() - 0.5).slice(0, 3);

  const container = document.getElementById("spotlight-container");
  container.innerHTML = "";

  selected.forEach((m) => {
    container.innerHTML += `
      <article>
        <img src="${m.image}" alt="${m.name}" width="160" height="160">
        <h3>${m.name}</h3>
        <p><strong>${m.membership.toUpperCase()}</strong></p>
        <p>Specialty: ${m.specialty}</p>
        <p>📍 ${m.address}</p>
        <p>📞 ${m.phone}</p>
        <a href="${m.website}" target="_blank" class="cta-btn">Visit Website</a>
      </article>`;
  });
}

loadSpotlights();
