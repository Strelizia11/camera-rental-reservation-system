const userBody = document.getElementById("userBody");
const search = document.getElementById("search");
const modal = document.getElementById("modal");
let page = 1;

function renderUsers() {
  const q = search.value.trim().toLowerCase();
  const list = users.filter(
    (u) =>
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
  );

  page = clampPage(page, list.length);

  if (list.length === 0) {
    userBody.innerHTML = `<tr><td colspan="4" class="empty">No users found.</td></tr>`;
    renderPager("pager", 0, 1, () => {});
    return;
  }

  userBody.innerHTML = pageSlice(list, page)
    .map(
      (u) => `
      <tr>
        <td class="cell-title" data-label="Name">${esc(u.name)}</td>
        <td data-label="Contact">${esc(u.contact)}</td>
        <td data-label="Email">${esc(u.email)}</td>
        <td class="cell-actions" data-label="Actions">
          <button class="btn-small" data-action="history" data-id="${u.id}">Previous Transactions</button>
          <button class="btn-small btn-danger" data-action="delete" data-id="${u.id}">Delete Account</button>
        </td>
      </tr>`,
    )
    .join("");

  renderPager("pager", list.length, page, (p) => {
    page = p;
    renderUsers();
  });
}

function showTransactions(userId) {
  const user = getUser(userId);
  const mine = reservations.filter((r) => r.userId === userId);
  document.getElementById("modalTitle").textContent =
    user.name + " - Previous Transactions";

  if (mine.length === 0) {
    document.getElementById("modalBody").innerHTML =
      `<p class="empty">No transactions yet.</p>`;
  } else {
    document.getElementById("modalBody").innerHTML = `
        <div class="table-wrap"><table>
          <thead><tr><th>Device(s)</th><th>Start</th><th>End</th><th>Price</th></tr></thead>
          <tbody>${mine
            .map(
              (r) => `
            <tr>
              <td class="cell-title" data-label="Device(s)">${esc(r.deviceIds.map((id) => deviceName(getDevice(id))).join(", "))}</td>
              <td data-label="Start">${fmtDate(r.start)}</td>
              <td data-label="End">${fmtDate(r.end)}</td>
              <td class="cell-aside" data-label="Price">${peso(reservationTotal(r))}</td>
            </tr>`,
            )
            .join("")}
          </tbody>
        </table></div>`;
  }
  modal.classList.add("open");
  document.body.classList.add("modal-open"); // stop the page behind from scrolling
  document.getElementById("modalBody").scrollTop = 0;
  document.getElementById("closeModal").focus({ preventScroll: true });
}

function closeHistory() {
  modal.classList.remove("open");
  document.body.classList.remove("modal-open");
}

async function deleteUser(userId) {
  const user = getUser(userId);
  const ok = await confirmDialog(
    `Delete the account of ${user.name}? This cannot be undone.`,
    "Delete Account",
    "Keep",
  );
  if (!ok) return;
  users.splice(users.indexOf(user), 1);
  save();
  renderUsers();
}

// one click listener for every button in the table (event delegation)
userBody.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.dataset.action === "history") showTransactions(id);
  if (btn.dataset.action === "delete") deleteUser(id);
});

search.addEventListener("input", () => {
  page = 1;
  renderUsers();
}); // new search -> back to page 1
document.getElementById("closeModal").addEventListener("click", closeHistory);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeHistory();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeHistory();
});

function initUsers() {
  renderSidebar("users");
  renderUsers();
}

window.addEventListener("DOMContentLoaded", initUsers);
