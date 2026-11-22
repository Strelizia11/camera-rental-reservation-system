const CATALOG_URL = "../catalog/catalog.html";
const HOME_URL = "../index.html";

const numberRegex = /^(09\d{9}|\+639\d{9})$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", 
    "August", "September", "October", "November", "December"];

let currentDevices = [];
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let lastReservationId = null;

const nameInput = document.getElementById("fullName");
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");
const pickupInput = document.getElementById("pickupTime");
const dropoffInput = document.getElementById("dropoffTime");
const numberInput = document.getElementById("contactNumber");
const emailInput = document.getElementById("contactEmail");
const idTypeInput = document.getElementById("idType");
const ID_TYPES = ["PhilSys ID", "Driver's License", "Voter's ID"];

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
  document.getElementById("cancelReservationBtn").addEventListener("click", showCancelConf);
  document.getElementById("cancelYesBtn").addEventListener("click", () => removeReservation());
  document.getElementById("cancelNoBtn").addEventListener("click", removeCancelConf);

  refreshCalendar();
}

function refreshCalendar() {
  document.getElementById("monthLabel").textContent = MONTH_NAMES[currentMonth] + " " + currentYear;
  if (currentDevices.length === 0 || typeof renderCalendar !== "function") return;
  renderCalendar(getReservationsByDevices(currentDevices.map((d) => d.id)), currentYear, currentMonth);
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

function showConfirmation(e) {
  e.preventDefault();

  const results = [validateName(), validateDates(), validatePickup(), validateDropoff(), validateNumber(), validateEmail(), validateIdType()];
  if (results.includes(false)) return;

  const name = nameInput.value.trim();
  const contact = numberInput.value.trim();
  const email = emailInput.value.trim();
  const idType = idTypeInput.value;

  const saved = addReservation(currentDevices.map((d) => d.id), startInput.value, endInput.value, name, contact, email, idType, pickupInput.value, dropoffInput.value);
  lastReservationId = saved.id;

  const reservation = {
    id: saved.id,
    device: currentDevices.map(deviceName).join(", "),
    name: name,
    contact: contact,
    email: email,
    idType: idType,
    startDate: saved.start,
    endDate: saved.end,
    pickupTime: pickupInput.value,
    dropoffTime: dropoffInput.value,
  };

  const summary = document.getElementById("confirmationSummary");
  summary.innerHTML = "";
  [
    ["Device", reservation.device],
    ["Name", reservation.name],
    ["Start date", reservation.startDate],
    ["Pick-up time", formatTime(reservation.pickupTime)],
    ["End date", reservation.endDate],
    ["Drop-off time", formatTime(reservation.dropoffTime)],
    ["Contact number", reservation.contact],
    ["Email", reservation.email],
    ["ID type", reservation.idType],
    ["Total", peso(reservationTotal(saved))],
    ["Reservation ID", reservation.id],
  ].forEach(([label, value]) => {
    const p = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = label + ": ";
    p.appendChild(strong);
    p.appendChild(document.createTextNode(value));
    summary.appendChild(p);
  });

  refreshCalendar(); 
  openModal("confirmationModal");
}

function returnToCatalog() {
  window.location.href = CATALOG_URL;
}

function removeConfirmation() {
  closeModal("confirmationModal");
  document.getElementById("reservationForm").reset();
  endInput.min = "";
  emailInput.value = getCurrentUser().email;
  nameInput.value = getCurrentUser().fullName || "";
}

function showCancelConf() {
  openModal("cancelModal");
}

function removeCancelConf() {
  closeModal("cancelModal");
}

function removeReservation(id) {
  const reservationId = id || lastReservationId;
  if (reservationId) deleteReservation(reservationId);
  refreshCalendar();
  window.location.href = CATALOG_URL;
}

document.addEventListener("DOMContentLoaded", loadReservationPage);