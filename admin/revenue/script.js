renderSidebar("revenue");

document.getElementById("totalRevenue").textContent = peso(totalRevenue());

// draws one horizontal bar per row: rows = [{ label, value }]
function renderBars(containerId, rows) {
  const max = Math.max(...rows.map(r => r.value), 1);   // avoid dividing by 0
  document.getElementById(containerId).innerHTML = rows.map(r => `
    <div class="bar-row">
      <div class="bar-label">${esc(r.label)}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(r.value / max) * 100}%"></div></div>
      <div class="bar-value">${peso(r.value)}</div>
    </div>`).join("");
}

// ----- one pass over every reservation line builds all the groupings -----
const perYear = {};                 // { 2026: 123000, 2025: ... }
const perYearMonth = {};            // { 2026: [jan, feb, ... dec], ... }
const perDevice = {};               // deviceId -> amount
const perCategory = {};             // category -> amount
CATEGORIES.forEach(c => perCategory[c] = 0);
devices.forEach(d => perDevice[d.id] = 0);

reservations.forEach(r => {
  const date = new Date(r.start);                  // revenue counts in the month/year the rental STARTS
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();                // 0 = January
  if (!perYearMonth[year]) { perYearMonth[year] = new Array(12).fill(0); perYear[year] = 0; }

  reservationLines(r).forEach(line => {
    perYear[year] += line.amount;
    perYearMonth[year][month] += line.amount;
    if (line.device) {
      perDevice[line.device.id] += line.amount;
      perCategory[line.device.category] += line.amount;
    }
  });
});

const years = Object.keys(perYear).map(Number).sort((a, b) => a - b);   // oldest -> newest
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Yearly Revenue
renderBars("yearly", years.map(y => ({ label: String(y), value: perYear[y] })));

// "Revenue for [Year]" - one panel per year, newest year first
document.getElementById("yearPanels").innerHTML = [...years].reverse().map(y => `
  <div class="panel"><h3>Revenue for ${y}</h3><div id="month-${y}"></div></div>`).join("");
years.forEach(y => renderBars("month-" + y, perYearMonth[y].map((v, i) => ({ label: MONTHS[i], value: v }))));

renderBars("perCategory", Object.entries(perCategory)
  .map(([label, value]) => ({ label, value }))
  .sort((a, b) => b.value - a.value));

renderBars("perDevice", devices
  .map(d => ({ label: deviceName(d), value: perDevice[d.id] }))
  .sort((a, b) => b.value - a.value));