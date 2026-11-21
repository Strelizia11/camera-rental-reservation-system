renderSidebar("reservations");

const resBody = document.getElementById("resBody");
const statusFilter = document.getElementById("statusFilter");
let page = 1;

function renderReservations() {
  // newest first, then filter by status
  let list = [...reservations].sort((a, b) => b.start.localeCompare(a.start));
  if (statusFilter.value !== "all") list = list.filter(r => reservationStatus(r) === statusFilter.value);

  page = clampPage(page, list.length);

  if (list.length === 0) {
    resBody.innerHTML = `<tr><td colspan="7" class="empty">No reservations found.</td></tr>`;
    renderPager("pager", 0, 1, () => {});
    return;
  }

  resBody.innerHTML = pageSlice(list, page).map(r => {
    const user = getUser(r.userId);
    const status = reservationStatus(r);
    const names = r.deviceIds.map(id => esc(deviceName(getDevice(id)))).join("<br>");
    // finished rentals can't be cancelled
    const action = status === "done"
      ? `-`
      : `<button class="btn-small btn-danger" data-id="${r.id}">Cancel</button>`;
    return `<tr>
      <td class="cell-title" data-label="Renter">${user ? esc(user.name) : "(deleted user)"}</td>
      <td class="cell-list" data-label="Devices">${names}</td>
      <td data-label="Start">${fmtDate(r.start)}</td>
      <td data-label="End">${fmtDate(r.end)}</td>
      <td class="cell-aside" data-label="Status"><span class="status ${status}">${status[0].toUpperCase() + status.slice(1)}</span></td>
      <td class="cell-strong" data-label="Total">${peso(reservationTotal(r))}</td>
      <td class="cell-actions ${status === "done" ? "is-empty" : ""}" data-label="Action">${action}</td>
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

resBody.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (btn) cancelReservation(Number(btn.dataset.id));
});
statusFilter.addEventListener("input", () => { page = 1; renderReservations(); });

renderReservations();