// FOOTER YEAR
document.getElementById("year").textContent = new Date().getFullYear();

// MOBILE MENU
const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("main-nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", nav.classList.contains("open"));
});


// WEATHER API
const API_KEY = "b99acdcc84243d2d976b8e99b99aacfb";
const CITY = "benin";
const weatherBox = document.getElementById("weather-data");

async function loadWeather() {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();

    // ---- CURRENT WEATHER (closest time block) ----
    const now = new Date();
    let current = data.list.reduce((closest, item) => {
      return Math.abs(new Date(item.dt_txt) - now) <
        Math.abs(new Date(closest.dt_txt) - now)
        ? item
        : closest;
    });

    const temp = Math.round(current.main.temp);
    const desc = current.weather[0].description;

    // ---- 3-DAY FORECAST (group by day) ----
    const days = {};

    data.list.forEach((entry) => {
      const date = new Date(entry.dt_txt);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });

      if (!days[day]) days[day] = [];
      days[day].push(entry);
    });

    const today = new Date().toLocaleDateString("en-US", { weekday: "short" });

    const forecastHTML = Object.entries(days)
      .filter(([day]) => day !== today) // ignore today
      .slice(0, 3)                       // next 3 days
      .map(([day, entries]) => {
        const avgTemp =
          entries.reduce((sum, e) => sum + e.main.temp, 0) / entries.length;

        return `<li>${day}: ${Math.round(avgTemp)}°C</li>`;
      })
      .join("");

    // ---- OUTPUT ----
    weatherBox.innerHTML = `
      <p><strong>Current:</strong> ${temp}°C – ${desc}</p>
      <h3>3-Day Forecast</h3>
      <ul>${forecastHTML}</ul>
    `;

  } catch (err) {
    weatherBox.innerHTML = "<p>Weather unavailable.</p>";
  }
}

loadWeather();


// SPOTLIGHT SECTION
async function loadSpotlights() {
  try {
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
        <article class="spotlight-card">
          <img src="${m.image}" alt="${m.name}" width="160" height="160">
          <h3>${m.name}</h3>
          <p><strong>${m.membership.toUpperCase()}</strong></p>
          <p>Specialty: ${m.specialty}</p>
          <p> ${m.address}</p>
          <p> ${m.phone}</p>
          <a href="${m.website}" target="_blank" class="cta-btn">Visit Website</a>
        </article>`;
    });
  } catch (error) {
    console.error("Spotlight Error:", error);
  }
}

loadSpotlights();
