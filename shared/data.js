
const USE_STORAGE = true;
const STORAGE_KEY = "crs_admin_data";

const CATEGORIES = ["Camera", "Lens", "Storage", "Tripod", "Light Equipment", "Gimbal"];

let devices = [
  { id: 1,  brand: "Sony",      model: "A7 IV",             category: "Camera",          pricePerDay: 1800, images: [], samples: [] },
  { id: 2,  brand: "Canon",     model: "EOS 90D",           category: "Camera",          pricePerDay: 1200, images: [], samples: [] },
  { id: 3,  brand: "Fujifilm",  model: "X-T30 II",          category: "Camera",          pricePerDay: 1000, images: [], samples: [] },
  { id: 4,  brand: "Sony",      model: "FE 24-70mm f/2.8",  category: "Lens",            pricePerDay: 900,  images: [], samples: [] },
  { id: 5,  brand: "Canon",     model: "RF 50mm f/1.8",     category: "Lens",            pricePerDay: 400,  images: [], samples: [] },
  { id: 6,  brand: "SanDisk",   model: "Extreme Pro 128GB", category: "Storage",         pricePerDay: 150,  images: [], samples: [] },
  { id: 7,  brand: "Lexar",     model: "CFexpress 256GB",   category: "Storage",         pricePerDay: 300,  images: [], samples: [] },
  { id: 8,  brand: "Manfrotto", model: "Compact Tripod",    category: "Tripod",          pricePerDay: 250,  images: [], samples: [] },
  { id: 9,  brand: "Godox",     model: "SL60W LED",         category: "Light Equipment", pricePerDay: 500,  images: [], samples: [] },
  { id: 10, brand: "Aputure",   model: "Amaran 100d",       category: "Light Equipment", pricePerDay: 650,  images: [], samples: [] },
  { id: 11, brand: "DJI",       model: "RS 3",              category: "Gimbal",          pricePerDay: 850,  images: [], samples: [] },
  { id: 12, brand: "Zhiyun",    model: "Crane 2S",          category: "Gimbal",          pricePerDay: 700,  images: [], samples: [] }
];

let users = [
  { id: 1, name: "Maria Santos",     contact: "0917 123 4567", email: "maria.santos@email.com" },
  { id: 2, name: "Juan Dela Cruz",   contact: "0918 234 5678", email: "juan.delacruz@email.com" },
  { id: 3, name: "Angela Reyes",     contact: "0927 345 6789", email: "angela.reyes@email.com" },
  { id: 4, name: "Carlo Mendoza",    contact: "0905 456 7890", email: "carlo.mendoza@email.com" },
  { id: 5, name: "Patricia Lim",     contact: "0936 567 8901", email: "patricia.lim@email.com" },
  { id: 6, name: "Miguel Villanueva",contact: "0945 678 9012", email: "miguel.v@email.com" }
];


let reservations = [
  { id: 1,  userId: 1, deviceIds: [1, 4],     start: "2026-01-10", end: "2026-01-12" },
  { id: 2,  userId: 2, deviceIds: [2],        start: "2026-02-03", end: "2026-02-05" },
  { id: 3,  userId: 3, deviceIds: [3, 5, 6],  start: "2026-02-20", end: "2026-02-22" },
  { id: 4,  userId: 1, deviceIds: [11],       start: "2026-03-14", end: "2026-03-15" },
  { id: 5,  userId: 4, deviceIds: [1, 7, 8],  start: "2026-04-02", end: "2026-04-05" },
  { id: 6,  userId: 5, deviceIds: [9, 10],     start: "2026-05-08", end: "2026-05-09" },
  { id: 7,  userId: 6, deviceIds: [2, 5],     start: "2026-06-18", end: "2026-06-21" },
  { id: 8,  userId: 2, deviceIds: [12],       start: "2026-07-04", end: "2026-07-06" },
  { id: 9,  userId: 3, deviceIds: [1],        start: "2026-08-15", end: "2026-08-17" },
  { id: 10, userId: 4, deviceIds: [3, 4],     start: "2026-09-09", end: "2026-09-11" },
  { id: 11, userId: 5, deviceIds: [11, 6],    start: "2026-10-12", end: "2026-10-14" },
  { id: 12, userId: 1, deviceIds: [2, 8, 9],  start: "2026-11-05", end: "2026-11-08" },
  { id: 13, userId: 6, deviceIds: [10],       start: "2026-11-18", end: "2026-11-20" }
];


function save() {
  if (!USE_STORAGE) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ devices, users, reservations }));
}
(function load() {
  if (!USE_STORAGE) return;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const saved = JSON.parse(raw);
  devices = saved.devices; users = saved.users; reservations = saved.reservations;
})();


function getDevice(id) { return devices.find(d => d.id === id); }
function getUser(id)   { return users.find(u => u.id === id); }

function daysBetween(start, end) {
  return Math.round((new Date(end) - new Date(start)) / 86400000) + 1;
}

function reservationLines(r) {
  const days = daysBetween(r.start, r.end);
  return r.deviceIds.map(id => {
    const device = getDevice(id);
    return { device, amount: device ? device.pricePerDay * days : 0 };
  });
}
function reservationTotal(r) {
  return reservationLines(r).reduce((sum, line) => sum + line.amount, 0);
}
function totalRevenue() {
  return reservations.reduce((sum, r) => sum + reservationTotal(r), 0);
}

function peso(n) { return "₱" + n.toLocaleString("en-PH"); }
function fmtDate(s) {
  return new Date(s).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}
function deviceName(d) { return d ? d.brand + " " + d.model : "(removed device)"; }

function esc(str) {
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}