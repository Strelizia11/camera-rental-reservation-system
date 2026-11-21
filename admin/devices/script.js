renderSidebar("devices");

const grid = document.getElementById("deviceGrid");
const search = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");
const sortPrice = document.getElementById("sortPrice");
let page = 1;

const ICONS = { "Camera": "📷", "Lens": "🔭", "Storage": "💾", "Tripod": "📐", "Light Equipment": "💡", "Gimbal": "🎥" };

CATEGORIES.forEach(c => categoryFilter.insertAdjacentHTML("beforeend", `<option value="${c}">${c}</option>`));

function renderDevices() {
  const q = search.value.trim().toLowerCase();

  // 1) search  2) filter  3) sort  4) cut out the current page
  let list = devices.filter(d => (d.brand + " " + d.model).toLowerCase().includes(q));
  if (categoryFilter.value !== "all") list = list.filter(d => d.category === categoryFilter.value);
  if (sortPrice.value === "asc")  list.sort((a, b) => a.pricePerDay - b.pricePerDay);
  if (sortPrice.value === "desc") list.sort((a, b) => b.pricePerDay - a.pricePerDay);

  page = clampPage(page, list.length);

  if (list.length === 0) {
    grid.innerHTML = `<p class="empty">No devices match your search.</p>`;
    renderPager("pager", 0, 1, () => {});
    return;
  }

  grid.innerHTML = pageSlice(list, page).map(d => `
  <div class="device-card">
    <div class="device-img${d.images.length ? "" : " is-empty"}">${d.images.length ? `<img src="${d.images[0]}" alt="${esc(deviceName(d))}" loading="lazy">` : ICONS[d.category] || "📦"}</div>
    <div class="device-info">
      <span class="tag tag-soft">${esc(d.category)}</span>
      <strong class="device-name">${esc(deviceName(d))}</strong>
      <div class="device-price"><span class="price">${peso(d.pricePerDay)}</span> / day</div>
      <div class="card-actions">
        <button class="btn-small" data-action="edit" data-id="${d.id}">Edit</button>
        <button class="btn-small btn-danger" data-action="delete" data-id="${d.id}">Delete</button>
      </div>
    </div>
  </div>`).join("");

  renderPager("pager", list.length, page, p => { page = p; renderDevices(); });
}

/* ---------- delete ---------- */
async function deleteDevice(id) {
  const d = getDevice(id);
  // don't allow deleting gear that is booked right now or in the future
  const busy = reservations.filter(r => r.deviceIds.includes(id) && reservationStatus(r) !== "done");
  if (busy.length > 0) {
    alert(`${deviceName(d)} is part of ${busy.length} ongoing/upcoming reservation(s). Cancel those first.`);
    return;
  }
  const ok = await confirmDialog(`Delete ${deviceName(d)} from the catalog? This cannot be undone.`, "Delete Device", "Keep");
  if (!ok) return;
  devices.splice(devices.indexOf(d), 1);
  save();
  renderDevices();
}

/* ---------- edit pop-up ---------- */
const editModal = document.getElementById("editModal");
const editDialog = editModal.querySelector(".edit-dialog");
const editForm = document.getElementById("editForm");
const editBody = document.getElementById("editBody");
const editSpecs = document.getElementById("editSpecs");
const editPreview = document.getElementById("editPreview");
let editing = null;   // the device object being edited

const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

function thumbs(urls, alt) { return urls.map(u => `<img src="${u}" alt="${alt}">`).join(""); }

function openEdit(id) {
  editing = getDevice(id);
  document.getElementById("editBrand").value = editing.brand;
  document.getElementById("editModel").value = editing.model;
  document.getElementById("editCategory").value = editing.category;
  document.getElementById("editPrice").value = editing.pricePerDay;
  document.getElementById("editImages").value = "";
  editPreview.innerHTML = thumbs(editing.images, "current image");
  document.getElementById("editSubtitle").textContent = deviceName(editing);
  document.getElementById("editSpecTitle").textContent = specTitle(editing.category);
  renderSpecFields(editSpecs, editing.category, getSpecs(editing) || {}, false);

  editModal.classList.add("open");
  document.body.classList.add("modal-open");                       // stop the page behind from scrolling
  editBody.scrollTop = 0;                                          // always start at "Basic Info"
  document.getElementById("editBrand").focus({ preventScroll: true });   // move focus into the dialog
}

// put focus back on the Edit button of the card we came from (if it is still on screen)
function focusEditButton(id) {
  if (id == null) return;
  const btn = grid.querySelector(`button[data-action="edit"][data-id="${id}"]`);
  if (btn) btn.focus();
}

function closeEdit() {
  const id = editing ? editing.id : null;
  editModal.classList.remove("open");
  document.body.classList.remove("modal-open");
  editing = null;
  focusEditButton(id);
}

document.getElementById("editImages").addEventListener("change", async e => {
  const urls = await readFiles(e.target.files);
  if (urls.length) editPreview.innerHTML = thumbs(urls, "new image");
});

editForm.addEventListener("submit", async e => {
  e.preventDefault();
  editing.brand = document.getElementById("editBrand").value.trim();
  editing.model = document.getElementById("editModel").value.trim();
  editing.pricePerDay = Number(document.getElementById("editPrice").value);

  const files = document.getElementById("editImages").files;
  if (files.length) editing.images = await readFiles(files);       // only replace when new files were chosen

  editing.specs = readSpecs(editSpecs);
  save();
  renderDevices();   // redraw first, so the Edit button exists again when closeEdit() returns focus to it
  closeEdit();
});

document.getElementById("closeEdit").addEventListener("click", closeEdit);
document.getElementById("cancelEdit").addEventListener("click", closeEdit);

// clicking the dark overlay closes it - but only if the click STARTED on the overlay
// (so dragging a text selection out of an input doesn't close the dialog by accident)
let pressStartedOnOverlay = false;
editModal.addEventListener("mousedown", e => { pressStartedOnOverlay = (e.target === editModal); });
editModal.addEventListener("click", e => { if (e.target === editModal && pressStartedOnOverlay) closeEdit(); });

// Escape closes; Tab / Shift+Tab stay inside the dialog (focus trap)
document.addEventListener("keydown", e => {
  if (!editModal.classList.contains("open")) return;
  if (e.key === "Escape") { closeEdit(); return; }
  if (e.key !== "Tab") return;

  const items = [...editDialog.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
  if (items.length === 0) return;
  const first = items[0], last = items[items.length - 1];

  if (!editDialog.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
  else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

/* ---------- events ---------- */
grid.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.dataset.action === "edit") openEdit(id);
  if (btn.dataset.action === "delete") deleteDevice(id);
});

// changing search / filter / sort starts again from page 1
[search, categoryFilter, sortPrice].forEach(el => el.addEventListener("input", () => { page = 1; renderDevices(); }));
renderDevices();