const CATALOG_URL = "../catalog/catalog.html";
const HOME_URL = "../index.html";

const numberRegex = /^(09\d{9}|\+639\d{9})$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", 
    "August", "September", "October", "November", "December"];

let currentDevices = [];
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let pendingReservation = null;   // filled by showConfirmation(), saved by confirmReservation()
let selectedReservationId = null; // the user's own reservation picked for cancelling

const nameInput = document.getElementById("fullName");
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");
const pickupInput = document.getElementById("pickupTime");
const dropoffInput = document.getElementById("dropoffTime");
const numberInput = document.getElementById("contactNumber");
const emailInput = document.getElementById("contactEmail");
const idTypeInput = document.getElementById("idType");
const ID_TYPES = ["PhilSys ID", "Driver's License", "Voter's ID", "PRC ID", "Senior Citizen ID", "PWD ID", "SSS ID"];

const nameError = document.getElementById("nameError");
const dateError = document.getElementById("dateError");
const pickupError = document.getElementById("pickupError");
const dropoffError = document.getElementById("dropoffError");
const numberError = document.getElementById("numberError");
const emailError = document.getElementById("emailError");
const idError = document.getElementById("idError");

//Date Helpers
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

function addDays(dateString, days) {
  const [y, m, d] = dateString.split("-").map(Number);
  return formatDate(new Date(y, m - 1, d + days));
}

function loadReservationPage() {
  if (!getCurrentUser()) {
    window.location.href = HOME_URL;
    return;
  }

  const idFromUrl = new URLSearchParams(window.location.search).get("id");
  const ids = idFromUrl ? [Number(idFromUrl)] : getSelectedDeviceIds();
  currentDevices = ids.map(getDevice).filter(Boolean);

  if (currentDevices.length === 0) {
    document.getElementById("deviceName").textContent = "(no device selected)";
    document.getElementById("submitBtn").disabled = true;
  } else {
    document.getElementById("deviceName").textContent = currentDevices.map(deviceName).join(", ");
  }

  startInput.min = formatDate(new Date());

  emailInput.value = getCurrentUser().email;
  nameInput.value = getCurrentUser().fullName || "";
  nameInput.readOnly = nameInput.value !== "";

  document.getElementById("prevMonth").addEventListener("click", () => changeMonth(-1));
  document.getElementById("nextMonth").addEventListener("click", () => changeMonth(1));
  startInput.addEventListener("change", setEndDate);
  endInput.addEventListener("change", checkAvailability);
  pickupInput.addEventListener("input", validatePickup);
  dropoffInput.addEventListener("input", validateDropoff);
  numberInput.addEventListener("input", validateNumber);
  emailInput.addEventListener("input", validateEmail);
  idTypeInput.addEventListener("change", validateIdType);
  document.getElementById("submitBtn").addEventListener("click", showConfirmation);
  document.getElementById("backBtn").addEventListener("click", returnToCatalog);
  document.getElementById("closeConfirmBtn").addEventListener("click", removeConfirmation);
  document.getElementById("confirmBtn").addEventListener("click", confirmReservation);
  document.getElementById("cancelReservationBtn").addEventListener("click", showCancelConf);
  document.getElementById("calendar").addEventListener("click", onCalendarPick);
  document.getElementById("calendar").addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") onCalendarPick(e);
  });
  document.getElementById("cancelYesBtn").addEventListener("click", removeReservation);
  document.getElementById("cancelNoBtn").addEventListener("click", removeCancelConf);

  refreshCalendar();
}

function refreshCalendar() {
  document.getElementById("monthLabel").textContent = MONTH_NAMES[currentMonth] + " " + currentYear;
  updateCancelState();
  if (currentDevices.length === 0 || typeof renderCalendar !== "function") return;
  renderCalendar(getReservationsByDevices(currentDevices.map((d) => d.id)), currentYear, currentMonth, {
    mineIds: getMyCancellable().map((r) => r.id),
    selectedId: selectedReservationId,
  });
}

// ---------- Which reservations can this user cancel? ----------
function todayKey() {
  return formatDate(new Date());
}

// Reservations for the device(s) on this page that belong to the signed-in user
// and haven't ended yet (past reservations stay as history).
function getMyCancellable() {
  const current = getCurrentUser();
  if (!current || currentDevices.length === 0) return [];
  const me = users.find((u) => u.email.toLowerCase() === String(current.email).trim().toLowerCase());
  if (!me) return [];
  const today = todayKey();
  return getReservationsByDevices(currentDevices.map((d) => d.id))
    .filter((r) => r.userId === me.id && r.end >= today)
    .sort((a, b) => a.start.localeCompare(b.start));
}

function getSelectedReservation() {
  return getMyCancellable().find((r) => r.id === selectedReservationId) || null;
}

// Shows/hides the Cancel button and keeps the selection valid.
function updateCancelState() {
  const mine = getMyCancellable();
  const area = document.getElementById("cancelArea");
  const btn = document.getElementById("cancelReservationBtn");

  if (!mine.some((r) => r.id === selectedReservationId)) selectedReservationId = null;
  if (selectedReservationId === null && mine.length === 1) selectedReservationId = mine[0].id; // only one: no need to pick

  area.classList.toggle("hidden", mine.length === 0);

  const selected = mine.find((r) => r.id === selectedReservationId);
  btn.disabled = !selected;
  btn.textContent = selected
    ? "Cancel reservation · " + shortDate(selected.start) + " – " + shortDate(selected.end)
    : "Select your reservation to cancel";
}

function onCalendarPick(e) {
  const day = e.target.closest(".calendar-day.mine");
  if (!day) return;
  e.preventDefault();
  selectedReservationId = Number(day.dataset.rid);
  refreshCalendar();
}

function changeMonth(direction) {
  currentMonth += direction;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  refreshCalendar();
}

function hasOverlap(start, end) {
  return getReservationsByDevices(currentDevices.map((d) => d.id)).some(
    (r) => start <= r.end && end >= r.start
  );
}

function setEndDate() {
  dateError.textContent = "";
  const start = startInput.value;

  if (!start) {
    endInput.min = "";
    return;
  }

  const minEnd = addDays(start, 1);
  endInput.min = minEnd;
  if (endInput.value && endInput.value < minEnd) endInput.value = "";

  if (currentDevices.length && hasOverlap(start, start)) {
    startInput.value = "";
    endInput.value = "";
    endInput.min = "";
    dateError.textContent = "That start date is already reserved. Please choose another date.";
    return;
  }

  if (endInput.value) checkAvailability();
}

function checkAvailability() {
  dateError.textContent = "";
  const start = startInput.value;
  const end = endInput.value;
  if (!start || !end || currentDevices.length === 0) return true;

  if (hasOverlap(start, end)) {
    startInput.value = "";
    endInput.value = "";
    endInput.min = "";
    dateError.textContent = "Those dates overlap an existing reservation. Please choose different dates.";
    return false;
  }
  return true;
}

function validateName() {
  if (nameInput.value.trim() === "") {
    nameError.textContent = "Please enter your full name.";
    return false;
  }
  nameError.textContent = "";
  return true;
}

// "2026-11-20" -> "November 20, 2026"
function longDate(key) {
  const [y, m, d] = key.split("-").map(Number);
  return MONTH_NAMES[m - 1] + " " + d + ", " + y;
}

// "2026-11-20" -> "Nov 20"
function shortDate(key) {
  const [, m, d] = key.split("-").map(Number);
  return MONTH_NAMES[m - 1].slice(0, 3) + " " + d;
}

function formatTime(value) {
  const [h, m] = value.split(":").map(Number);
  return (h % 12 || 12) + ":" + String(m).padStart(2, "0") + " " + (h < 12 ? "AM" : "PM");
}

function validatePickup() {
  if (!pickupInput.value) {
    pickupError.textContent = "Please choose a pick-up time.";
    return false;
  }
  pickupError.textContent = "";
  return true;
}

function validateDropoff() {
  if (!dropoffInput.value) {
    dropoffError.textContent = "Please choose a drop-off time.";
    return false;
  }
  dropoffError.textContent = "";
  return true;
}

function validateNumber() {
  if (!numberRegex.test(numberInput.value.trim())) {
    numberError.textContent = "Enter a valid number, e.g. 09123456789 or +639123456789.";
    return false;
  }
  numberError.textContent = "";
  return true;
}

function validateEmail() {
  if (!emailRegex.test(emailInput.value.trim())) {
    emailError.textContent = "Please enter a valid email address.";
    return false;
  }
  emailError.textContent = "";
  return true;
}

function validateIdType() {
  if (!ID_TYPES.includes(idTypeInput.value)) {
    idError.textContent = "Please select a type of ID.";
    return false;
  }
  idError.textContent = "";
  return true;
}

function validateDates() {
  if (!startInput.value || !endInput.value) {
    dateError.textContent = "Please choose a start date and an end date.";
    return false;
  }
  return checkAvailability();
}

// Fills a .summary container with label/value rows
function fillSummary(containerId, rows) {
  const summary = document.getElementById(containerId);
  summary.innerHTML = "";
  rows.forEach(([label, value]) => {
    const p = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = label + ": ";
    p.appendChild(strong);
    p.appendChild(document.createTextNode(value));
    summary.appendChild(p);
  });
}

// Submit button: validate, then ask for confirmation. Nothing is saved yet.
function showConfirmation(e) {
  e.preventDefault();

  const results = [validateName(), validateDates(), validatePickup(), validateDropoff(), validateNumber(), validateEmail(), validateIdType()];
  if (results.includes(false)) return;

  pendingReservation = {
    deviceIds: currentDevices.map((d) => d.id),
    device: currentDevices.map(deviceName).join(", "),
    name: nameInput.value.trim(),
    contact: numberInput.value.trim(),
    email: emailInput.value.trim(),
    idType: idTypeInput.value,
    start: startInput.value,
    end: endInput.value,
    pickupTime: pickupInput.value,
    dropoffTime: dropoffInput.value,
  };
  const p = pendingReservation;

  fillSummary("confirmationSummary", [
    ["Device", p.device],
    ["Name", p.name],
    ["Start date", longDate(p.start)],
    ["Pick-up time", formatTime(p.pickupTime)],
    ["End date", longDate(p.end)],
    ["Drop-off time", formatTime(p.dropoffTime)],
    ["Contact number", p.contact],
    ["Email", p.email],
    ["ID type", p.idType],
    ["Total", peso(reservationTotal({ deviceIds: p.deviceIds, start: p.start, end: p.end }))],
  ]);

  openModal("confirmationModal");
}

function returnToCatalog() {
  window.location.href = CATALOG_URL;
}

// Close button: just closes the modal (the form keeps what was typed)
function removeConfirmation() {
  closeModal("confirmationModal");
}

// Confirm button: this is where the reservation is actually saved
function confirmReservation() {
  if (!pendingReservation) return;
  const p = pendingReservation;

  // Someone may have booked these dates since the form was filled in
  if (hasOverlap(p.start, p.end)) {
    closeModal("confirmationModal");
    checkAvailability();
    return;
  }

  const saved = addReservation(p.deviceIds, p.start, p.end, p.name, p.contact, p.email, p.idType, p.pickupTime, p.dropoffTime);
  pendingReservation = null;
  closeModal("confirmationModal");
  resetForm();

  // Jump to the booked month so the new reservation is visible
  const [y, m] = saved.start.split("-").map(Number);
  currentYear = y;
  currentMonth = m - 1;
  selectedReservationId = saved.id;
  refreshCalendar();
}

function resetForm() {
  document.getElementById("reservationForm").reset();
  endInput.min = "";
  emailInput.value = getCurrentUser().email;
  nameInput.value = getCurrentUser().fullName || "";
}

// "Cancel reservation" button: show the selected reservation and ask to confirm
function showCancelConf() {
  const r = getSelectedReservation();
  if (!r) return;
  const owner = getUser(r.userId) || {};

  fillSummary("cancelSummary", [
    ["Device", r.deviceIds.map((id) => deviceName(getDevice(id))).join(", ")],
    ["Name", owner.name || getCurrentUser().fullName || ""],
    ["Start date", longDate(r.start)],
    ["Pick-up time", r.pickupTime ? formatTime(r.pickupTime) : "-"],
    ["End date", longDate(r.end)],
    ["Drop-off time", r.dropoffTime ? formatTime(r.dropoffTime) : "-"],
    ["Contact number", owner.contact || "-"],
    ["Email", owner.email || getCurrentUser().email],
    ["ID type", r.idType || "-"],
    ["Total", peso(reservationTotal(r))],
    ["Reservation ID", r.id],
  ]);

  openModal("cancelModal");
}

function removeCancelConf() {
  closeModal("cancelModal");
}

// "Yes" in the cancel modal: delete exactly the selected reservation and stay on the page
function removeReservation() {
  if (selectedReservationId !== null) deleteReservation(selectedReservationId);
  selectedReservationId = null;
  closeModal("cancelModal");
  refreshCalendar();
}

document.addEventListener("DOMContentLoaded", loadReservationPage);