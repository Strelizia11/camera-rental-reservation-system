const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Inline camera icon
const CAMERA_ICON_SVG = `
  <svg class="reserved-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Reserved">
    <path d="M4 8h3l1.6-2.2h6.8L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
    <circle cx="12" cy="13.2" r="3.4"/>
  </svg>`;

// Builds "YYYY-MM-DD" by hand (toISOString shifts the day in UTC+8)
function toDateKey(year, month, day) {
  return year + "-" + String(month + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
}

function isReserved(reservations, dateKey) {
  return reservations.some(function (r) {
    return r.start <= dateKey && dateKey <= r.end;
  });
}

// opts (optional):
//   mineIds    - ids of reservations the signed-in user can cancel (shown in sand, clickable)
//   selectedId - id of the reservation currently selected for cancelling
function renderCalendar(reservations, year, month, opts) {
  const mineIds = (opts && opts.mineIds) || [];
  const selectedId = opts && opts.selectedId != null ? opts.selectedId : null;
  const calendar = document.getElementById("calendar");
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const now = new Date();
  const todayKey = toDateKey(now.getFullYear(), now.getMonth(), now.getDate());

  let html = "";

  WEEKDAYS.forEach(function (day) {
    html += `<div class="calendar-weekday">${day}</div>`;
  });

  for (let i = 0; i < firstWeekday; i++) {
    html += `<div class="calendar-day empty"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const key = toDateKey(year, month, day);
    const reserved = isReserved(reservations, key);

    // Which of the user's own reservations (if any) cover this day?
    const mine = reservations.filter(function (r) {
      return mineIds.indexOf(r.id) !== -1 && r.start <= key && key <= r.end;
    });
    const pick = mine.find(function (r) { return r.id === selectedId; }) || mine[0];

    let classes = "calendar-day";
    if (key === todayKey) classes += " today";
    if (key < todayKey) classes += " past";
    if (reserved) classes += " reserved";
    if (pick) classes += " mine";
    if (pick && pick.id === selectedId) classes += " selected";

    const attrs = pick
      ? ` data-rid="${pick.id}" role="button" tabindex="0" aria-pressed="${pick.id === selectedId}" title="Select your reservation"`
      : "";

    html += `
      <div class="${classes}"${attrs}>
        <span class="day-number">${day}</span>
        ${reserved ? CAMERA_ICON_SVG : ""}
      </div>`;
  }

  for (let i = firstWeekday + daysInMonth; i < 42; i++) {
    html += `<div class="calendar-day empty"></div>`;
  }

  calendar.innerHTML = html;
}
