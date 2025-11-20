// =========================
// FOOTER YEAR
// =========================
document.getElementById("year").textContent = new Date().getFullYear();


// =========================
// MOBILE MENU
// =========================
const menuBtn = document.getElementById("menu-btn");
const mainNav = document.getElementById("main-nav");
const links = document.querySelectorAll(".nav-links a");

// Toggle menu
menuBtn.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", isOpen);
});

// Close menu on link click
links.forEach(link => {
    link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
    });
});


// =========================
// WEATHER API
// =========================
const API_KEY = "b99acdcc84243d2d976b8e99b99aacfb";
const CITY = "benin";
const weatherBox = document.getElementById("weather-data");

async function loadWeather() {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=metric`
        );

        if (!res.ok) throw new Error("Weather fetch failed");

        const data = await res.json();

        // Current weather
        const now = new Date();
        const current = data.list.reduce((a, b) =>
            Math.abs(new Date(a.dt_txt) - now) <
            Math.abs(new Date(b.dt_txt) - now) ? a : b
        );

        const temp = Math.round(current.main.temp);
        const desc = current.weather[0].description;

        // 3-Day Forecast
        const days = {};
        data.list.forEach(e => {
            const day = new Date(e.dt_txt).toLocaleDateString("en-US", { weekday: "short" });
            if (!days[day]) days[day] = [];
            days[day].push(e);
        });

        const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
        const forecast = Object.entries(days)
            .filter(([day]) => day !== today)
            .slice(0, 3)
            .map(([day, items]) => {
                const avg = items.reduce((t, e) => t + e.main.temp, 0) / items.length;
                return `<li>${day}: ${Math.round(avg)}°C</li>`;
            }).join("");

        weatherBox.innerHTML = `
            <p><strong>Current:</strong> ${temp}°C – ${desc}</p>
            <h3>3-Day Forecast</h3>
            <ul>${forecast}</ul>
        `;
    } catch {
        weatherBox.innerHTML = "<p>Weather unavailable.</p>";
    }
}

loadWeather();


// =========================
// SPOTLIGHT SECTION
// =========================
async function loadSpotlights() {
    try {
        const res = await fetch("data/members.json");
        const data = await res.json();
        const container = document.getElementById("spotlight-container");

        const picks = data.members
            .filter(m => ["gold", "silver"].includes(m.membership))
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        container.innerHTML = picks.map(m => `
            <article class="spotlight-card">
                <img src="${m.image}" alt="${m.name}" width="160" height="160">
                <h3>${m.name}</h3>
                <p><strong>${m.membership.toUpperCase()}</strong></p>
                <p>Specialty: ${m.specialty}</p>
                <p>${m.address}</p>
                <p>${m.phone}</p>
                <a href="${m.website}" target="_blank" class="cta-btn">Visit Website</a>
            </article>
        `).join("");
    } catch (err) {
        console.error("Spotlight error:", err);
    }
}

loadSpotlights();
