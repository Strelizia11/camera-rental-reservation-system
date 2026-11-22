renderSidebar("revenue");

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/* ---------- group the numbers (one pass over every reservation line) ---------- */
const byYear = {};   // { 2026: { total, count, months:[12], category:{}, device:{} } }
function yearBucket(y) {
  if (!byYear[y]) byYear[y] = { total: 0, count: 0, months: new Array(12).fill(0), category: {}, device: {} };
  return byYear[y];
}

const allCategory = {}, allDevice = {};
CATEGORIES.forEach(c => allCategory[c] = 0);
devices.forEach(d => allDevice[d.id] = 0);

reservations.forEach(r => {
  const date = new Date(r.start);                 // revenue counts in the month/year the rental STARTS
  const b = yearBucket(date.getUTCFullYear());
  const month = date.getUTCMonth();
  b.count++;

  reservationLines(r).forEach(line => {
    b.total += line.amount;
    b.months[month] += line.amount;
    if (line.device) {
      const d = line.device;
      b.category[d.category] = (b.category[d.category] || 0) + line.amount;
      b.device[d.id] = (b.device[d.id] || 0) + line.amount;
      allCategory[d.category] += line.amount;
      allDevice[d.id] += line.amount;
    }
  });
});

const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);   // newest first

/* ---------- small builders ---------- */
function bars(rows) {
  const max = Math.max(...rows.map(r => r.value), 1);   // avoid dividing by 0
  if (rows.length === 0) return `<p class="empty">No data.</p>`;
  return rows.map(r => `
    <div class="bar-row">
      <div class="bar-label">${esc(r.label)}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(r.value / max) * 100}%"></div></div>
      <div class="bar-value">${peso(r.value)}</div>
    </div>`).join("");
}
const panel = (title, rows) => `<div class="panel"><h3>${esc(title)}</h3>${bars(rows)}</div>`;
const card = (label, value) => `<div class="card"><div class="label">${esc(label)}</div><div class="value">${value}</div></div>`;
const byValue = (a, b) => b.value - a.value;

/* ---------- panel contents ---------- */
function allYearsPanel() {
  const total = totalRevenue();
  return `<div class="cards">${card("Total Revenue (all years)", peso(total))}${card("Total Reservations", reservations.length)}</div>`
    + panel("Revenue per Year", [...years].reverse().map(y => ({ label: String(y), value: byYear[y].total })))
    + panel("Revenue per Category (all years)",
        Object.entries(allCategory).map(([label, value]) => ({ label, value })).sort(byValue))
    + panel("Revenue per Device (all years)",
        devices.map(d => ({ label: deviceName(d), value: allDevice[d.id] })).sort(byValue));
}

function yearPanel(y) {
  const b = byYear[y];
  return `<div class="cards">${card("Revenue for " + y, peso(b.total))}${card("Reservations in " + y, b.count)}</div>`
    + panel("Revenue by Month", b.months.map((v, i) => ({ label: MONTHS[i], value: v })))
    + panel("Revenue per Category",
        Object.entries(b.category).map(([label, value]) => ({ label, value })).sort(byValue))
    + panel("Revenue per Device",
        Object.entries(b.device)
          .map(([id, value]) => ({ label: deviceName(getDevice(Number(id))), value }))
          .sort(byValue));
}

/* ---------- tabs ---------- */
const tabs = [{ key: "all", label: "All Years", html: allYearsPanel() }]
  .concat(years.map(y => ({ key: String(y), label: String(y), html: yearPanel(y) })));

const tabBar = document.getElementById("tabs");
const panels = document.getElementById("tabPanels");

tabBar.innerHTML = tabs.map(t =>
  `<button type="button" class="tab" role="tab" id="tab-${t.key}" aria-controls="panel-${t.key}" data-key="${t.key}">${esc(t.label)}</button>`
).join("");
panels.innerHTML = tabs.map(t =>
  `<section class="tab-panel" role="tabpanel" id="panel-${t.key}" aria-labelledby="tab-${t.key}" hidden>${t.html}</section>`
).join("");

function showTab(key, focus) {
  if (!tabs.some(t => t.key === key)) key = "all";
  tabs.forEach(t => {
    const selected = t.key === key;
    const btn = document.getElementById("tab-" + t.key);
    btn.setAttribute("aria-selected", String(selected));
    btn.tabIndex = selected ? 0 : -1;
    document.getElementById("panel-" + t.key).hidden = !selected;
    if (selected) {
      btn.scrollIntoView({ block: "nearest", inline: "nearest" });
      if (focus) btn.focus();
    }
  });
  history.replaceState(null, "", key === "all" ? location.pathname : "#" + key);   // a refresh keeps the tab
}

tabBar.addEventListener("click", e => {
  const btn = e.target.closest("button[data-key]");
  if (btn) showTab(btn.dataset.key);
});

// arrow keys / Home / End move between tabs
tabBar.addEventListener("keydown", e => {
  const i = tabs.findIndex(t => document.getElementById("tab-" + t.key) === document.activeElement);
  if (i === -1) return;
  let next = null;
  if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
  if (e.key === "ArrowLeft")  next = (i - 1 + tabs.length) % tabs.length;
  if (e.key === "Home") next = 0;
  if (e.key === "End")  next = tabs.length - 1;
  if (next !== null) { e.preventDefault(); showTab(tabs[next].key, true); }
});

showTab(location.hash.slice(1));