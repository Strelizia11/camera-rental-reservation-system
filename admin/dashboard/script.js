renderSidebar("dashboard");

document.getElementById("totalUsers").textContent = users.length;
document.getElementById("totalDevices").textContent = devices.length;
document.getElementById("totalReservations").textContent = reservations.length;
document.getElementById("totalRevenue").textContent = peso(totalRevenue());

// newest 5 reservations (sort a COPY so the original order is untouched)
const latest = [...reservations].sort((a, b) => b.start.localeCompare(a.start)).slice(0, 5);

document.getElementById("recentBody").innerHTML = latest.map(r => {
  const user = getUser(r.userId);
  const names = r.deviceIds.map(id => deviceName(getDevice(id))).join(", ");
  return `<tr>
    <td class="cell-title" data-label="Renter">${user ? esc(user.name) : "(deleted user)"}</td>
    <td data-label="Devices">${esc(names)}</td>
    <td data-label="Dates">${fmtDate(r.start)} - ${fmtDate(r.end)}</td>
    <td class="cell-aside" data-label="Total">${peso(reservationTotal(r))}</td>
  </tr>`;
}).join("");