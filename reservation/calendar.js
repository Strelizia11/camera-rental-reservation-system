const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CAMERA_ICON = "../shared/images/camera-icon.png";

// Builds "YYYY-MM-DD" by hand (toISOString shifts the day in UTC+8)
function toDateKey(year, month, day) {
  return year + "-" + String(month + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
}

function isReserved(reservations, dateKey) {
  return reservations.some(function (r) {
    return r.start <= dateKey && dateKey <= r.end;
  });
}

function renderCalendar(reservations, year, month) {
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

    let classes = "calendar-day";
    if (key === todayKey) classes += " today";
    if (key < todayKey) classes += " past";
    if (reserved) classes += " reserved";

    html += `
      <div class="${classes}">
        <span class="day-number">${day}</span>
        ${reserved ? `<img class="reserved-icon" src="${CAMERA_ICON}" alt="Reserved">` : ""}
      </div>`;
  }

  for (let i = firstWeekday + daysInMonth; i < 42; i++) {
    html += `<div class="calendar-day empty"></div>`;
  }

  calendar.innerHTML = html;
}