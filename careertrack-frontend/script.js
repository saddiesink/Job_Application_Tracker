const API_URL = "http://localhost:5000";

// Load applications (only if table exists)
async function loadApplications() {
  const table = document.querySelector("#applicationsTable");
  if (!table) return;

  const response = await fetch(`${API_URL}/applications`);
  const data = await response.json();

  const tableBody = table.querySelector("tbody");
  tableBody.innerHTML = "";

  data.forEach(app => {
    const row = `
      <tr>
        <td>${app.company_name}</td>
        <td>${app.role}</td>
        <td>
          <span class="status ${app.status.toLowerCase()}">
            ${app.status}
          </span>
        </td>
        <td>${app.applied_date}</td>
       <td>
  <button onclick="deleteApplication(${app.id})" class="delete-btn">
    <i class="fa-solid fa-trash"></i>
  </button>
</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}
// Load total stats (only if element exists)
async function loadStats() {
  const totalElement = document.getElementById("totalCount");
  if (!totalElement) return;

  const response = await fetch(`${API_URL}/stats/total`);
  const data = await response.json();

  totalElement.innerText = data.total;
}

// Handle form submit (only if form exists)
const form = document.getElementById("jobForm");
if (form) {
  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    await fetch(`${API_URL}/addApplication`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const status = data.status;
const company = data.company_name;

// let message = "";

// if (status === "Applied") {
//   message = `🎉 Glad you applied to ${company}! Keep going 🚀`;
// }
// else if (status === "Interview") {
//   message = `🔥 Awesome! Ace your interview at ${company} 💪`;
// }
// else if (status === "Offer") {
//   message = `🎊 Congrats! You got an offer from ${company}!`;
// }
// else if (status === "Rejected") {
//   message = `💛 Don’t worry. Better opportunities are coming!`;
// }

// alert(message);
this.reset();

    document.getElementById("companyInput").focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
async function loadTodayStats() {
  const todayElement = document.getElementById("todayCount");
  if (!todayElement) return;

  const response = await fetch(`${API_URL}/stats/today`);
  const data = await response.json();

  todayElement.innerText = data.today;

  const banner = document.getElementById("reminderBanner");

  if (data.today === 0) {
    banner.classList.remove("hidden");
  } else {
    banner.classList.add("hidden");
  }
}
async function deleteApplication(id) {
  if (!confirm("Are you sure you want to delete this application?")) return;

  await fetch(`${API_URL}/applications/${id}`, {
    method: "DELETE"
  });

  loadApplications();
  loadStats();
  loadTodayStats();
}
async function loadStatusChart() {

  const canvas = document.getElementById("statusChart");
  if (!canvas) return;

  const response = await fetch("http://localhost:5000/stats/status");
  const data = await response.json();

  const labels = data.map(item => item.status);
  const counts = data.map(item => item.count);

//   new Chart(canvas, {
//     type: "pie",
//     data: {
//       labels: labels,
//       datasets: [{
//         data: counts,
//         backgroundColor: [
//           "#22c55e",
//           "#3b82f6",
//           "#f59e0b",
//           "#ef4444"
//         ]
//       }]
//     }
//   });

 }
function generateActivity() {

  const grid = document.getElementById("activityGrid");
  if (!grid) return;

  for (let i = 0; i < 35; i++) {

    const cell = document.createElement("div");

    const level = Math.floor(Math.random() * 4);

    if (level === 1) cell.classList.add("activity-low");
    if (level === 2) cell.classList.add("activity-medium");
    if (level === 3) cell.classList.add("activity-high");

    grid.appendChild(cell);

  }

}

generateActivity();

loadApplications();
loadStats();
loadTodayStats();
// loadStatusChart();