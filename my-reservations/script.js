const HOME_URL = "../index.html";
const ADMIN_URL = "../admin/dashboard/dashboard.html";

const listEl = document.getElementById("reservation-list");
const statusFilter = document.getElementById("status-filter");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const emptyText = document.getElementById("empty-text");
const messageEl = document.getElementById("message");
const cancelSummary = document.getElementById("cancelSummary");

let currentUser = null;      // the signed-in account (from the session)
let pendingCancelId = null;  // reservation waiting for the "Yes, cancel" confirmation
let lastFocus = null;

/* ---------- helpers ---------- */
function todayKey() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

// same rules the admin side uses, so both sides always show the same status
function statusOf(r) {
    if (r.status === "done") return "done";
    const today = todayKey();
    if (r.end < today) return "pending";
    if (r.start > today) return "upcoming";
    return "ongoing";
}

const STATUS_LABEL = { upcoming: "Upcoming", ongoing: "Ongoing", pending: "Pending return", done: "Done" };

function fmtTime(t) {
    const m = String(t || "").match(/^(\d{1,2}):(\d{2})/);
    if (!m) return "";
    const h = Number(m[1]);
    return (h % 12 || 12) + ":" + m[2] + " " + (h >= 12 ? "PM" : "AM");
}

function dateTime(date, time) {
    const t = fmtTime(time);
    return (t ? t + ", " : "") + fmtDate(date);
}

// the "users" record that belongs to the signed-in account (matched by email)
function findMe() {
    const email = String(currentUser.email).trim().toLowerCase();
    return users.find(u => u.email.toLowerCase() === email) || null;
}

function myReservations() {
    const me = findMe();
    if (!me) return [];
    return reservations.filter(r => r.userId === me.id);
}

/* ---------- render ---------- */
function createCard(r) {
    const status = statusOf(r);
    const days = daysBetween(r.start, r.end);
    const canCancel = status === "upcoming" || status === "ongoing";

    const lines = reservationLines(r).map(line => `
        <li>
            <span class="line-name">${esc(deviceName(line.device))}</span>
            <span class="line-price">${peso(line.amount)}</span>
        </li>`).join("");

    return `
    <li class="reservation-card">
        <article>
            <div class="card-top">
                <span class="status ${status}">${STATUS_LABEL[status]}</span>
                <span class="res-id">Reservation #${r.id}</span>
            </div>

            <ul class="device-lines" aria-label="Devices">${lines}</ul>

            <dl class="dates">
                <div><dt>Pick-up</dt><dd>${dateTime(r.start, r.pickupTime)}</dd></div>
                <div><dt>Return</dt><dd>${dateTime(r.end, r.dropoffTime)}</dd></div>
                <div><dt>Duration</dt><dd>${days} ${days === 1 ? "day" : "days"}</dd></div>
                ${r.idType ? `<div><dt>ID</dt><dd>${esc(r.idType)}</dd></div>` : ""}
            </dl>

            <div class="card-bottom">
                <div class="total"><span>Total</span><strong>${peso(reservationTotal(r))}</strong></div>
                ${canCancel
                    ? `<button type="button" class="btn-danger cancel-btn" data-id="${r.id}">Cancel reservation</button>`
                    : ""}
            </div>
        </article>
    </li>`;
}

function render() {
    let list = myReservations().sort((a, b) => b.start.localeCompare(a.start));
    const total = list.length;
    if (statusFilter.value !== "all") list = list.filter(r => statusOf(r) === statusFilter.value);

    listEl.innerHTML = list.map(createCard).join("");
    resultCount.textContent = list.length + (list.length === 1 ? " reservation" : " reservations");

    if (list.length === 0) {
        emptyText.textContent = total === 0
            ? "You have no reservations yet."
            : "No reservations match this filter.";
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
    }
}

function showMessage(text) {
    messageEl.textContent = text;
    messageEl.classList.remove("hidden");
}

/* ---------- cancel (with confirmation modal) ---------- */
function fillSummary(rows) {
    cancelSummary.innerHTML = "";
    rows.forEach(([label, value]) => {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = label;
        const span = document.createElement("span");
        span.textContent = value;
        p.append(strong, span);
        cancelSummary.appendChild(p);
    });
}

function askCancel(id, trigger) {
    const r = reservations.find(x => x.id === id);
    if (!r) return;
    pendingCancelId = id;
    lastFocus = trigger;

    fillSummary([
        ["Device(s)", r.deviceIds.map(d => deviceName(getDevice(d))).join(", ")],
        ["Pick-up", dateTime(r.start, r.pickupTime)],
        ["Return", dateTime(r.end, r.dropoffTime)],
        ["Total", peso(reservationTotal(r))],
        ["Reservation", "#" + r.id],
    ]);
    openModal("cancelModal");
    document.getElementById("cancelNoBtn").focus();   // safest default
}

function closeCancel() {
    closeModal("cancelModal");
    pendingCancelId = null;
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
}

function confirmCancel() {
    if (pendingCancelId === null) return;
    const r = reservations.find(x => x.id === pendingCancelId);
    const names = r ? r.deviceIds.map(d => deviceName(getDevice(d))).join(", ") : "";
    deleteReservation(pendingCancelId);      // removes it for good, so the admin side updates too
    pendingCancelId = null;
    closeModal("cancelModal");
    render();
    showMessage("Reservation cancelled" + (names ? ": " + names : "") + ".");
}

/* ---------- events ---------- */
listEl.addEventListener("click", e => {
    const btn = e.target.closest(".cancel-btn");
    if (btn) askCancel(Number(btn.dataset.id), btn);
});

document.getElementById("cancelYesBtn").addEventListener("click", confirmCancel);
document.getElementById("cancelNoBtn").addEventListener("click", closeCancel);
document.getElementById("cancelModal").addEventListener("click", e => {
    if (e.target.id === "cancelModal") closeCancel();          // clicked the blurred background
});
document.addEventListener("keydown", e => {
    const open = !document.getElementById("cancelModal").classList.contains("hidden");
    if (open && e.key === "Escape") closeCancel();
});

statusFilter.addEventListener("change", () => { messageEl.classList.add("hidden"); render(); });

document.getElementById("logout-btn").addEventListener("click", () => {
    logoutUser();
    window.location.href = HOME_URL;
});

document.addEventListener("DOMContentLoaded", () => {
    currentUser = getCurrentUser();
    if (!currentUser) { window.location.href = HOME_URL; return; }
    if (currentUser.role === "admin") { window.location.href = ADMIN_URL; return; }
    render();
});