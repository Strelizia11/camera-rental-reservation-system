
const USE_STORAGE = false;
const STORAGE_KEY = "crs_admin_data";

const CATEGORIES = ["Camera", "Lens", "Storage", "Tripod", "Light Equipment", "Gimbal"];

let devices = [
  //camera
  { id: 1, brand: "Sony", model: "A7 IV", category: "Camera", pricePerDay: 1800, images: [], samples: [] },
  { id: 2, brand: "Sony", model: "A6400", category: "Camera", pricePerDay: 1100, images: [], samples: [] },
  { id: 3, brand: "Sony", model: "ZV-E10", category: "Camera", pricePerDay: 900, images: [], samples: [] },
  { id: 4, brand: "Canon", model: "EOS R6 Mark II", category: "Camera", pricePerDay: 2000, images: [], samples: [] },
  { id: 5, brand: "Canon", model: "EOS 90D", category: "Camera", pricePerDay: 1200, images: [], samples: [] },
  { id: 6, brand: "Canon", model: "PowerShot G7 X Mark III", category: "Camera", pricePerDay: 700, images: [], samples: [] },
  { id: 7, brand: "Nikon", model: "Z6 II", category: "Camera", pricePerDay: 1700, images: [], samples: [] },
  { id: 8, brand: "Nikon", model: "D7500", category: "Camera", pricePerDay: 1000, images: [], samples: [] },
  { id: 9, brand: "Fujifilm", model: "X-T30 II", category: "Camera", pricePerDay: 1000, images: [], samples: [] },
  { id: 10, brand: "Panasonic", model: "Lumix S5", category: "Camera", pricePerDay: 1500, images: [], samples: [] },
  //lens
  { id: 11, brand: "Sony", model: "FE 24-70mm f/2.8 GM", category: "Lens", pricePerDay: 900, images: [], samples: [] },
  { id: 12, brand: "Sony", model: "FE 50mm f/1.8", category: "Lens", pricePerDay: 350, images: [], samples: [] },
  { id: 13, brand: "Canon", model: "RF 50mm f/1.8", category: "Lens", pricePerDay: 400, images: [], samples: [] },
  { id: 14, brand: "Canon", model: "RF 24-105mm f/4L", category: "Lens", pricePerDay: 800, images: [], samples: [] },
  { id: 15, brand: "Nikon", model: "Nikkor Z 24-70mm f/4 S", category: "Lens", pricePerDay: 700, images: [], samples: [] },
  { id: 16, brand: "Nikon", model: "Nikkor Z 50mm f/1.8 S", category: "Lens", pricePerDay: 450, images: [], samples: [] },
  { id: 17, brand: "Sigma", model: "35mm f/1.4 DG HSM Art", category: "Lens", pricePerDay: 500, images: [], samples: [] },
  { id: 18, brand: "Tamron", model: "70-180mm f/2.8 Di III VXD", category: "Lens", pricePerDay: 750, images: [], samples: [] },
  { id: 19, brand: "Fujifilm", model: "XF 35mm f/1.4 R", category: "Lens", pricePerDay: 450, images: [], samples: [] },
  { id: 20, brand: "Sigma", model: "16mm f/1.4 DC DN", category: "Lens", pricePerDay: 400, images: [], samples: [] },
  //light
  { id: 21, brand: "Godox", model: "SL60W LED", category: "Light Equipment", pricePerDay: 500, images: [], samples: [] },
  { id: 22, brand: "Aputure", model: "Amaran 100d", category: "Light Equipment", pricePerDay: 650, images: [], samples: [] },
  { id: 23, brand: "Godox", model: "AD200 Pro Flash", category: "Light Equipment", pricePerDay: 800, images: [], samples: [] },
  { id: 24, brand: "Neewer", model: "660 RGB LED Panel", category: "Light Equipment", pricePerDay: 400, images: [], samples: [] },
  { id: 25, brand: "Godox", model: "ML60 LED", category: "Light Equipment", pricePerDay: 550, images: [], samples: [] },
  { id: 26, brand: "Aputure", model: "MC Pro RGBWW", category: "Light Equipment", pricePerDay: 300, images: [], samples: [] },
  //storage
  { id: 27, brand: "SanDisk", model: "Extreme Pro 128GB SD", category: "Storage", pricePerDay: 150, images: [], samples: [] },
  { id: 28, brand: "SanDisk", model: "Extreme Pro 256GB SD", category: "Storage", pricePerDay: 200, images: [], samples: [] },
  { id: 29, brand: "Lexar", model: "CFexpress Type B 256GB", category: "Storage", pricePerDay: 300, images: [], samples: [] },
  { id: 30, brand: "Sony", model: "Tough SF-G 128GB SD", category: "Storage", pricePerDay: 200, images: [], samples: [] },
  { id: 31, brand: "Samsung", model: "PRO Plus 128GB microSD", category: "Storage", pricePerDay: 100, images: [], samples: [] },
  { id: 32, brand: "Lexar", model: "1066x 64GB SD", category: "Storage", pricePerDay: 100, images: [], samples: [] },
  { id: 33, brand: "ProGrade", model: "CFexpress 512GB", category: "Storage", pricePerDay: 400, images: [], samples: [] },
  { id: 34, brand: "SanDisk", model: "Extreme Portable SSD 1TB", category: "Storage", pricePerDay: 350, images: [], samples: [] },
  { id: 35, brand: "Samsung", model: "T7 Shield SSD 1TB", category: "Storage", pricePerDay: 350, images: [], samples: [] },
  { id: 36, brand: "Kingston", model: "Canvas React Plus 128GB SD", category: "Storage", pricePerDay: 150, images: [], samples: [] },
  //tripod
  { id: 37, brand: "Manfrotto", model: "Compact Tripod", category: "Tripod", pricePerDay: 250, images: [], samples: [] },
  { id: 38, brand: "Benro", model: "Mach3 Carbon Tripod", category: "Tripod", pricePerDay: 450, images: [], samples: [] },
  { id: 39, brand: "Joby", model: "GorillaPod 5K", category: "Tripod", pricePerDay: 200, images: [], samples: [] },
  //gimbal
  { id: 40, brand: "DJI", model: "RS 3", category: "Gimbal", pricePerDay: 850, images: [], samples: [] },
  { id: 41, brand: "DJI", model: "RS 3 Mini", category: "Gimbal", pricePerDay: 700, images: [], samples: [] },
  { id: 42, brand: "Zhiyun", model: "Crane 2S", category: "Gimbal", pricePerDay: 700, images: [], samples: [] },
  { id: 43, brand: "Zhiyun", model: "Weebill 3", category: "Gimbal", pricePerDay: 750, images: [], samples: [] }
];

let users = [
  { id: 1, name: "Maria Santos", contact: "0917 123 4567", email: "maria.santos@email.com" },
  { id: 2, name: "Juan Dela Cruz", contact: "0918 234 5678", email: "juan.delacruz@email.com" },
  { id: 3, name: "Angela Reyes", contact: "0927 345 6789", email: "angela.reyes@email.com" },
  { id: 4, name: "Carlo Mendoza", contact: "0905 456 7890", email: "carlo.mendoza@email.com" },
  { id: 5, name: "Patricia Lim", contact: "0936 567 8901", email: "patricia.lim@email.com" },
  { id: 6, name: "Miguel Villanueva", contact: "0945 678 9012", email: "miguel.v@email.com" },
  { id: 7, name: "Sofia Ramirez", contact: "0915 789 0123", email: "sofia.ramirez@email.com" },
  { id: 8, name: "Rafael Aquino", contact: "0956 890 1234", email: "rafael.aquino@email.com" },
  { id: 9, name: "Bianca Navarro", contact: "0966 901 2345", email: "bianca.navarro@email.com" },
  { id: 10, name: "Gabriel Torres", contact: "0977 012 3456", email: "gabriel.torres@email.com" },
  { id: 11, name: "Isabel Fernandez", contact: "0995 123 4568", email: "isabel.fernandez@email.com" },
  { id: 12, name: "Daniel Castillo", contact: "0906 234 5679", email: "daniel.castillo@email.com" },
  { id: 13, name: "Katrina Bautista", contact: "0917 345 6780", email: "katrina.bautista@email.com" },
  { id: 14, name: "Nathan Ocampo", contact: "0928 456 7891", email: "nathan.ocampo@email.com" },
  { id: 15, name: "Louise Garcia", contact: "0919 567 8902", email: "louise.garcia@email.com" },
  { id: 16, name: "Paolo Mercado", contact: "0937 678 9013", email: "paolo.mercado@email.com" },
  { id: 17, name: "Andrea Domingo", contact: "0946 789 0124", email: "andrea.domingo@email.com" },
  { id: 18, name: "Marco Soriano", contact: "0955 890 1235", email: "marco.soriano@email.com" },
  { id: 19, name: "Camille Pascual", contact: "0965 901 2346", email: "camille.pascual@email.com" },
  { id: 20, name: "Elijah Flores", contact: "0976 012 3457", email: "elijah.flores@email.com" }
];

let reservations = [
  { id: 1, userId: 20, deviceIds: [6, 12, 23], start: "2026-01-05", end: "2026-01-06" },
  { id: 2, userId: 4, deviceIds: [8, 12, 32], start: "2026-01-07", end: "2026-01-08" },
  { id: 3, userId: 1, deviceIds: [2, 18, 27], start: "2026-01-26", end: "2026-01-27" },
  { id: 4, userId: 20, deviceIds: [8, 17], start: "2026-02-05", end: "2026-02-07" },
  { id: 5, userId: 3, deviceIds: [24, 26], start: "2026-02-09", end: "2026-02-09" },
  { id: 6, userId: 20, deviceIds: [4, 12, 32], start: "2026-02-19", end: "2026-02-21" },
  { id: 7, userId: 13, deviceIds: [3, 14, 22, 35], start: "2026-02-20", end: "2026-02-22" },
  { id: 8, userId: 8, deviceIds: [10, 19, 32], start: "2026-02-23", end: "2026-02-23" },
  { id: 9, userId: 19, deviceIds: [1, 29], start: "2026-02-27", end: "2026-02-27" },
  { id: 10, userId: 5, deviceIds: [5, 14, 34, 38], start: "2026-03-05", end: "2026-03-09" },
  { id: 11, userId: 17, deviceIds: [4, 23, 37], start: "2026-03-12", end: "2026-03-12" },
  { id: 12, userId: 1, deviceIds: [28, 41], start: "2026-03-17", end: "2026-03-17" },
  { id: 13, userId: 4, deviceIds: [30, 43], start: "2026-03-19", end: "2026-03-21" },
  { id: 14, userId: 5, deviceIds: [5, 16, 24, 37, 42], start: "2026-04-07", end: "2026-04-08" },
  { id: 15, userId: 2, deviceIds: [4, 14], start: "2026-04-14", end: "2026-04-15" },
  { id: 16, userId: 7, deviceIds: [3, 11, 37], start: "2026-04-20", end: "2026-04-22" },
  { id: 17, userId: 12, deviceIds: [3, 13, 36, 41], start: "2026-04-28", end: "2026-04-28" },
  { id: 18, userId: 15, deviceIds: [6, 42], start: "2026-05-01", end: "2026-05-02" },
  { id: 19, userId: 9, deviceIds: [3, 16, 26], start: "2026-05-02", end: "2026-05-04" },
  { id: 20, userId: 2, deviceIds: [1, 30, 43], start: "2026-05-08", end: "2026-05-08" },
  { id: 21, userId: 6, deviceIds: [6, 23], start: "2026-05-22", end: "2026-05-26" },
  { id: 22, userId: 11, deviceIds: [2, 19, 39], start: "2026-06-07", end: "2026-06-09" },
  { id: 23, userId: 3, deviceIds: [1, 19, 21, 36, 39], start: "2026-06-19", end: "2026-06-20" },
  { id: 24, userId: 18, deviceIds: [33, 40], start: "2026-06-30", end: "2026-06-30" },
  { id: 25, userId: 16, deviceIds: [2, 14, 34], start: "2026-07-02", end: "2026-07-04" },
  { id: 26, userId: 20, deviceIds: [9, 19, 24, 29], start: "2026-07-05", end: "2026-07-09" },
  { id: 27, userId: 9, deviceIds: [8, 26, 34], start: "2026-07-10", end: "2026-07-14" },
  { id: 28, userId: 12, deviceIds: [4, 14, 26, 28], start: "2026-07-24", end: "2026-07-28" },
  { id: 29, userId: 1, deviceIds: [9, 16, 21, 27], start: "2026-07-31", end: "2026-08-01" },
  { id: 30, userId: 16, deviceIds: [6, 17, 26, 37], start: "2026-08-13", end: "2026-08-15" },
  { id: 31, userId: 6, deviceIds: [7, 31, 41], start: "2026-08-13", end: "2026-08-14" },
  { id: 32, userId: 4, deviceIds: [7, 17, 28, 40], start: "2026-08-26", end: "2026-08-29" },
  { id: 33, userId: 5, deviceIds: [6, 17, 22, 28, 43], start: "2026-09-06", end: "2026-09-07" },
  { id: 34, userId: 10, deviceIds: [4, 29], start: "2026-09-07", end: "2026-09-08" },
  { id: 35, userId: 15, deviceIds: [2, 32], start: "2026-09-12", end: "2026-09-15" },
  { id: 36, userId: 17, deviceIds: [10, 11], start: "2026-09-15", end: "2026-09-16" },
  { id: 37, userId: 7, deviceIds: [8, 17, 35], start: "2026-09-25", end: "2026-09-29" },
  { id: 38, userId: 17, deviceIds: [5, 12, 35, 37], start: "2026-10-18", end: "2026-10-18" },
  { id: 39, userId: 4, deviceIds: [33, 41], start: "2026-10-18", end: "2026-10-19" },
  { id: 40, userId: 2, deviceIds: [1, 19, 25, 36], start: "2026-11-02", end: "2026-11-03" },
  { id: 41, userId: 9, deviceIds: [8, 18, 30], start: "2026-11-11", end: "2026-11-12" },
  { id: 42, userId: 14, deviceIds: [6, 19, 27, 41], start: "2026-11-14", end: "2026-11-18" },
  { id: 43, userId: 3, deviceIds: [8, 17, 31], start: "2026-12-01", end: "2026-12-02" },
  { id: 44, userId: 1, deviceIds: [8, 43], start: "2026-12-03", end: "2026-12-05" },
  { id: 45, userId: 9, deviceIds: [9, 35, 39], start: "2026-12-08", end: "2026-12-08" },
  { id: 46, userId: 16, deviceIds: [5, 13, 27, 41], start: "2026-12-13", end: "2026-12-14" }
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