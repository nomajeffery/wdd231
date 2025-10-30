document.addEventListener("DOMContentLoaded", () => {
  // ===== Year & Last Modified =====
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("lastModified").textContent = document.lastModified;

  // ===== Hamburger Menu =====
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  hamburger.addEventListener("click", () => {
    menu.classList.toggle("show");
    hamburger.classList.toggle("active");
  });

  // ===== Courses Data =====
  const courses = [
    { code: "WDD231", name: "Frontend Web Development", credits: 3, type: "WDD" },
    { code: "CSE121", name: "Programming with Classes", credits: 4, type: "CSE" },
    { code: "WDD330", name: "Dynamic Web Applications", credits: 3, type: "WDD" },
    { code: "CSE210", name: "Data Structures", credits: 4, type: "CSE" }
  ];

  const courseList = document.getElementById("course-list");
  const totalCreditsDisplay = document.getElementById("total-credits");

  function renderCourses(filter = "all") {
    courseList.innerHTML = "";
    const filtered = filter === "all" ? courses : courses.filter(c => c.type === filter);
    let totalCredits = 0;

    filtered.forEach(course => {
      const div = document.createElement("div");
      div.classList.add("course-item");
      div.innerHTML = `
        <h3>${course.code}</h3>
        <p>${course.name}</p>
        <span>${course.credits} credits</span>
      `;
      courseList.appendChild(div);
      totalCredits += course.credits;
    });

    totalCreditsDisplay.textContent = `Total Credits: ${totalCredits}`;
  }

  renderCourses();

  // ===== Filter Buttons =====
  document.getElementById("all-btn").addEventListener("click", () => renderCourses("all"));
  document.getElementById("wdd-btn").addEventListener("click", () => renderCourses("WDD"));
  document.getElementById("cse-btn").addEventListener("click", () => renderCourses("CSE"));
});
