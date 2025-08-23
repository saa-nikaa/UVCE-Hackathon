// public/assets/js/prices.js
const API = "http://localhost:5000/api/prices";

const cropSel = document.getElementById("cropSel");
const rangeSel = document.getElementById("rangeSel");
const refreshBtn = document.getElementById("refreshBtn");
const nationalAvgEl = document.getElementById("nationalAvg");
const unitEl = document.getElementById("unit");
const marketTableBody = document.querySelector("#marketTable tbody");
const stateAvgWrap = document.getElementById("stateAvgWrap");
const lastUpdated = document.getElementById("lastUpdated");

let chart;

async function fetchJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

async function loadCrops() {
  const { crops } = await fetchJSON(`${API}/crops`);
  cropSel.innerHTML = crops.map(c => `<option value="${c}">${c}</option>`).join("");
  if (!crops.length) {
    cropSel.innerHTML = `<option value="">No data</option>`;
  }
}

function renderTable(markets) {
  marketTableBody.innerHTML = markets.map(m => `
    <tr>
      <td>${m.state}</td>
      <td>${m.market}</td>
      <td>₹${m.modal}</td>
      <td>₹${m.min}</td>
      <td>₹${m.max}</td>
    </tr>
  `).join("");
}

function renderStateAverages(list) {
  stateAvgWrap.innerHTML = list
    .map(s => `<span class="chip">${s.state}: ₹${s.avgModal}</span>`)
    .join(" ");
}

function renderChart(labels, data, unit) {
  const ctx = document.getElementById("priceChart");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: `Average modal price (${unit})`,
        data,
        fill: false,
        tension: 0.25
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: { mode: "index" }
      },
      scales: {
        x: { ticks: { maxTicksLimit: 8 } },
        y: { beginAtZero: false }
      }
    }
  });
}

async function loadAll() {
  const crop = cropSel.value;
  if (!crop) return;

  const days = rangeSel.value;
  const [current, history] = await Promise.all([
    fetchJSON(`${API}/current?crop=${encodeURIComponent(crop)}`),
    fetchJSON(`${API}/history?crop=${encodeURIComponent(crop)}&days=${days}`)
  ]);

  // header chips
  nationalAvgEl.textContent = `National Avg: ₹${current.nationalAvg ?? "—"}`;
  unitEl.textContent = `Unit: ${current.unit || "₹/quintal"}`;

  // markets table + state chips
  renderTable(current.markets || []);
  renderStateAverages(current.stateAverages || []);

  // chart
  const labels = (history.series || []).map(p => p.date);
  const data = (history.series || []).map(p => p.avgModal);
  renderChart(labels, data, history.unit || "₹/quintal");

  // last updated (from most recent market)
  const latest = (current.markets || [])[0];
  lastUpdated.textContent = latest?.observedAt
    ? `Last update: ${new Date(latest.observedAt).toLocaleString()}`
    : "Last update: —";
}

refreshBtn.addEventListener("click", loadAll);
cropSel.addEventListener("change", loadAll);
rangeSel.addEventListener("change", loadAll);

(async function init() {
  try {
    await loadCrops();
    await loadAll();
  } catch (e) {
    console.error(e);
    alert("Failed to load price data.");
  }
})();
