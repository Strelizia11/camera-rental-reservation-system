const resBody = document.getElementById("resBody");
const statusFilter = document.getElementById("statusFilter");
let page = 1;

// "14:30" -> "2:30 PM". Anything else (or nothing) is shown as it is, or "" when empty.
function fmtTime(t) {
  if (!t) return "";
  const m = String(t).match(/^(\d{1,2}):(\d{2})/);
  if (!m) return String(t);
  const h = Number(m[1]);
  return (h % 12 || 12) + ":" + m[2] + " " + (h >= 12 ? "PM" : "AM");
}
// time first, then the date, e.g. "2:00 AM, Dec 13, 2026" (just the date when no time was saved)
function dateTime(date, time) {
  const t = fmtTime(time);
  return (t ? t + ", " : "") + fmtDate(date);
}

function renderReservations() {
  // newest first, then filter by status
  let list = [...reservations].sort((a, b) => b.start.localeCompare(a.start));
  if (statusFilter.value !== "all") list = list.filter(r => reservationStatus(r) === statusFilter.value);

  page = clampPage(page, list.length);

  if (list.length === 0) {
    resBody.innerHTML = `<tr><td colspan="8" class="empty">No reservations found.</td></tr>`;
    renderPager("pager", 0, 1, () => {});
    return;
  }

  resBody.innerHTML = pageSlice(list, page).map(r => {
    const user = getUser(r.userId);
    const status = reservationStatus(r);
    const names = r.deviceIds.map(id => esc(deviceName(getDevice(id)))).join("<br>");

    // upcoming: Cancel | ongoing: Done + Cancel | pending (overdue): Done only | done: nothing
    let action = "";
    if (status === "ongoing" || status === "pending") {
      action += `<button class="btn-small btn-primary" data-action="done" data-id="${r.id}">Done</button>`;
    }
    if (status === "upcoming" || status === "ongoing") {
      action += `<button class="btn-small btn-danger" data-action="cancel" data-id="${r.id}">Cancel</button>`;
    }

    return `<tr>
      <td class="cell-title" data-label="Renter">${user ? esc(user.name) : "(deleted user)"}</td>
      <td data-label="ID Type">${r.idType ? esc(r.idType) : "-"}</td>
      <td class="cell-list" data-label="Devices">${names}</td>
      <td data-label="Pick-up">${dateTime(r.start, r.pickupTime)}</td>
      <td data-label="Drop-off">${dateTime(r.end, r.dropoffTime)}</td>
      <td class="cell-aside" data-label="Status"><span class="status ${status}">${status[0].toUpperCase() + status.slice(1)}</span></td>
      <td class="cell-strong" data-label="Total">${peso(reservationTotal(r))}</td>
      <td class="cell-actions ${action ? "" : "is-empty"}" data-label="Action">${action ? `<div class="action-group">${action}</div>` : "-"}</td>
    </tr>`;
  }).join("");

  renderPager("pager", list.length, page, p => { page = p; renderReservations(); });
}

async function cancelReservation(id) {
  const r = reservations.find(x => x.id === id);
  const user = getUser(r.userId);
  const who = user ? user.name : "this renter";
  const ok = await confirmDialog(
    `Cancel the reservation of ${who} (${fmtDate(r.start)} - ${fmtDate(r.end)}, ${peso(reservationTotal(r))})? It will be removed from the list and from revenue.`,
    "Cancel Reservation", "Keep");
  if (!ok) return;
  reservations.splice(reservations.indexOf(r), 1);
  save();
  renderReservations();
}

async function markReturned(id) {
  const r = reservations.find(x => x.id === id);
  const user = getUser(r.userId);
  const who = user ? user.name : "the renter";
  const ok = await confirmDialog(
    `Was the equipment already returned by ${who}? This marks the reservation (${fmtDate(r.start)} - ${fmtDate(r.end)}) as Done.`,
    "Yes, it was returned", "Not yet", false);
  if (!ok) return;
  r.status = "done";            // this is what changes the status
  r.returnedOn = todayStr();
  save();
  renderReservations();
}

resBody.addEventListener("click", e => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.dataset.action === "done") markReturned(id);
  if (btn.dataset.action === "cancel") cancelReservation(id);
});
statusFilter.addEventListener("input", () => { page = 1; renderReservations(); });

  function initReservations() {
    renderSidebar("reservations");
    renderReservations();
  }
  window.addEventListener("DOMContentLoaded", initReservations);