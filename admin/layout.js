/* layout.js - helpers shared by every ADMIN page (sidebar, pagination, status, dialogs) */

/* ---------- sidebar ---------- */
function renderSidebar(active) {
  const pages = [
    ["dashboard",    "Dashboard"],
    ["users",        "Users"],
    ["devices",      "Devices"],
    ["reservations", "Reservations"],
    ["revenue",      "Revenue"],
    ["add-device",   "Add Device"]
  ];
  const links = pages.map(([key, label]) =>
    `<a href="../${key}/${key}.html" class="${key === active ? "active" : ""}" ${key === active ? 'aria-current="page"' : ""}>${label}</a>`
  ).join("");
  document.getElementById("sidebar").innerHTML =
    `<div class="brand"><strong>Camera Rental</strong><span>ADMIN</span></div><nav aria-label="Admin menu">${links}</nav><button type="button" class="logout-btn">Log out</button>`;
  document.querySelector("#sidebar .logout-btn").addEventListener("click", adminLogout);
  setupMobileMenu();
}

// Ends the admin session (same as the catalog's Log out) and returns to the landing page
function adminLogout() {
  logoutUser();
  window.location.href = "../../index.html";
}

/* Phones and tablets: a sticky top bar with a hamburger button opens the sidebar as a drawer.
   (On desktop the CSS hides the top bar and shows the sidebar permanently.) */
function setupMobileMenu() {
  if (document.querySelector(".topbar")) return;   // only build it once

  document.body.insertAdjacentHTML("afterbegin", `
    <header class="topbar">
      <span class="brand-name">Camera Rental<small>ADMIN</small></span>
      <button type="button" class="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="sidebar">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <path d="M3 5h14M3 10h14M3 15h14"/>
        </svg>
      </button>
    </header>`);
  document.body.insertAdjacentHTML("beforeend", `<div class="nav-backdrop"></div>`);

  const btn = document.querySelector(".menu-btn");
  const sidebar = document.getElementById("sidebar");

  function setOpen(open) {
    document.body.classList.toggle("nav-open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) sidebar.querySelector("a.active, a").focus();
  }

  btn.addEventListener("click", () => setOpen(!document.body.classList.contains("nav-open")));
  document.querySelector(".nav-backdrop").addEventListener("click", () => setOpen(false));
  sidebar.addEventListener("click", e => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && document.body.classList.contains("nav-open")) { setOpen(false); btn.focus(); }
  });
  // growing the window to desktop width: make sure the drawer state is reset
  window.matchMedia("(min-width: 1024px)").addEventListener("change", e => { if (e.matches) setOpen(false); });
}

/* ---------- pagination ---------- */
const PER_PAGE = 10;

// Which page buttons to show, e.g. 1 2 3 ... 8  or  1 ... 4 5 6 ... 12
// "…" marks a gap of 2 or more pages (a gap of exactly one page just shows that page).
function pageList(current, last) {
  if (last <= 5) return Array.from({ length: last }, (_, i) => i + 1);

  const keep = new Set([1, last, current - 1, current, current + 1]);
  if (current <= 2)        { keep.add(2); keep.add(3); }
  if (current >= last - 1) { keep.add(last - 1); keep.add(last - 2); }

  const nums = [...keep].filter(n => n >= 1 && n <= last).sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => {
    if (i > 0) {
      const gap = n - nums[i - 1];
      if (gap === 2) out.push(n - 1);
      else if (gap > 2) out.push("…");
    }
    out.push(n);
  });
  return out;
}

// Draws  Previous 1 2 3 … 8 Next  (centered) + "Showing 1-10 of 76" into the element with id `containerId`.
// onChange(newPage) is called when the admin clicks a button.
function renderPager(containerId, total, page, onChange) {
  const el = document.getElementById(containerId);
  if (total === 0) { el.innerHTML = ""; return; }

  const pages = Math.ceil(total / PER_PAGE);
  const from = (page - 1) * PER_PAGE + 1;
  const to = Math.min(page * PER_PAGE, total);

  const numbers = pageList(page, pages).map(p => p === "…"
    ? `<span class="pg-gap" aria-hidden="true">…</span>`
    : `<button data-page="${p}" class="pg-num ${p === page ? "current" : ""}" aria-label="Page ${p}" ${p === page ? 'aria-current="page"' : ""}>${p}</button>`
  ).join("");

  // "Previous" / "Next" show as words on wider screens and as arrows on small phones (CSS swaps them)
  el.innerHTML = `
    <div class="pager-buttons">
      <button data-page="${page - 1}" aria-label="Previous page" ${page === 1 ? "disabled" : ""}><span class="pg-text">Previous</span><span class="pg-arrow" aria-hidden="true">&lsaquo;</span></button>
      ${numbers}
      <button data-page="${page + 1}" aria-label="Next page" ${page === pages ? "disabled" : ""}><span class="pg-text">Next</span><span class="pg-arrow" aria-hidden="true">&rsaquo;</span></button>
    </div>
    <span class="pager-info">Showing ${from}-${to} of ${total}</span>`;

  // using onclick (not addEventListener) so we never stack up duplicate listeners
  el.onclick = e => {
    const btn = e.target.closest("button[data-page]");
    if (btn && !btn.disabled) onChange(Number(btn.dataset.page));
  };
}

// keeps `page` valid after filtering/deleting (e.g. you delete the last item on page 3)
function clampPage(page, total) {
  return Math.min(Math.max(1, page), Math.max(1, Math.ceil(total / PER_PAGE)));
}
function pageSlice(list, page) {
  return list.slice((page - 1) * PER_PAGE, page * PER_PAGE);
}

/* ---------- reservation status (based on today's date) ---------- */
function todayStr() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
// YYYY-MM-DD strings compare correctly with < and >, so no Date math is needed
function reservationStatus(r) {
  if (r.status === "done") return "done";     // the admin confirmed the device came back
  const today = todayStr();
  if (r.end < today) return "pending";        // past the end date, return not confirmed yet
  if (r.start > today) return "upcoming";
  return "ongoing";
}

/* ---------- confirmation pop-up ---------- */
// Usage:  if (await confirmDialog("Delete this?", "Delete", "Keep")) { ... }
function confirmDialog(message, okText = "Confirm", cancelText = "Cancel", danger=true) {
  return new Promise(resolve => {
    const previous = document.activeElement;
    const wrap = document.createElement("div");
    wrap.className = "confirm-overlay";
    wrap.innerHTML = `
      <div class="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirmTitle" aria-describedby="confirmMsg">
        <h3 id="confirmTitle">Please confirm</h3>
        <p id="confirmMsg">${esc(message)}</p>
        <div class="confirm-actions">
          <button type="button" data-answer="no">${esc(cancelText)}</button>
          <button type="button" class="${danger ? "btn-danger" : "btn-primary"}" data-answer="yes">${esc(okText)}</button>
          
        </div>
      </div>`;
    document.body.appendChild(wrap);
    document.body.classList.add("modal-open");

    const buttons = [...wrap.querySelectorAll("button")];
    buttons[0].focus();                                   // safest default: the cancel button

    function close(answer) {
      document.removeEventListener("keydown", onKey, true);
      wrap.remove();
      document.body.classList.remove("modal-open");
      if (previous && previous.focus) previous.focus();
      resolve(answer);
    }

    function onKey(e) {
      if (e.key === "Escape") { e.preventDefault(); e.stopImmediatePropagation(); close(false); return; }
      if (e.key !== "Tab") return;
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKey, true);

    wrap.addEventListener("click", e => {
      if (e.target === wrap) return close(false);          // clicked the dark background
      const btn = e.target.closest("button[data-answer]");
      if (btn) close(btn.dataset.answer === "yes");
    });
  });
}

/* ---------- read image files as data URLs ---------- */
function readFiles(fileList) {
  return Promise.all([...fileList].map(file => new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  })));
}