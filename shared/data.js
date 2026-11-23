const USE_STORAGE = true;
const STORAGE_KEY = "crs_admin_data_v4";   // bumped because the reservation data changed

const CATEGORIES = ["Camera", "Lens", "Storage", "Tripod", "Light Equipment", "Gimbal"];

let devices = [
  //camera
  { id: 1, brand: "Sony", model: "A7 IV", category: "Camera", pricePerDay: 1800, images: ["../../shared/images/camera/sonya7IV.jpg"] },
  { id: 2, brand: "Sony", model: "A6400", category: "Camera", pricePerDay: 1100, images: ["../../shared/images/camera/a6400.jpg"] },
  { id: 3, brand: "Sony", model: "ZV-E10", category: "Camera", pricePerDay: 900, images: ["../../shared/images/camera/ZV-E10.jpg"] },
  { id: 4, brand: "Canon", model: "EOS R6 Mark II", category: "Camera", pricePerDay: 2000, images: ["../../shared/images/camera/EOS R6 Mark II.jpg"] },
  { id: 5, brand: "Canon", model: "EOS 90D", category: "Camera", pricePerDay: 1200, images: ["../../shared/images/camera/EOS 90D.jpg"] },
  { id: 6, brand: "Canon", model: "PowerShot G7 X Mark III", category: "Camera", pricePerDay: 700, images: ["../../shared/images/camera/PowerShot G7 X Mark III.jpg"] },
  { id: 7, brand: "Nikon", model: "Z6 II", category: "Camera", pricePerDay: 1700, images: ["../../shared/images/camera/Z6 II.jpg"] },
  { id: 8, brand: "Nikon", model: "D7500", category: "Camera", pricePerDay: 1000, images: ["../../shared/images/camera/D7500.jpg"] },
  { id: 9, brand: "Fujifilm", model: "X-T30 II", category: "Camera", pricePerDay: 1000, images: ["../../shared/images/camera/X-T30 II.jpg"] },
  { id: 10, brand: "Panasonic", model: "Lumix S5", category: "Camera", pricePerDay: 1500, images: ["../../shared/images/camera/Lumix S5.jpg"] },
  //lens
  { id: 11, brand: "Sony", model: "FE 24-70mm f/2.8 GM", category: "Lens", pricePerDay: 900, images: ["../../shared/images/lens/FE.jpg"] },
  { id: 12, brand: "Sony", model: "FE 50mm f/1.8", category: "Lens", pricePerDay: 350, images: ["../../shared/images/lens/FE2.jpg"] },
  { id: 13, brand: "Canon", model: "RF 50mm f/1.8", category: "Lens", pricePerDay: 400, images: ["../../shared/images/lens/RF.jpg"] },
  { id: 14, brand: "Canon", model: "RF 24-105mm f/4L", category: "Lens", pricePerDay: 800, images: ["../../shared/images/lens/RF2.jpg"] },
  { id: 15, brand: "Nikon", model: "Nikkor Z 24-70mm f/4 S", category: "Lens", pricePerDay: 700, images: ["../../shared/images/lens/NZ.jpg"] },
  { id: 16, brand: "Nikon", model: "Nikkor Z 50mm f/1.8 S", category: "Lens", pricePerDay: 450, images: ["../../shared/images/lens/NZ2.jpg"] },
  { id: 17, brand: "Sigma", model: "35mm f/1.4 DG HSM Art", category: "Lens", pricePerDay: 500, images: ["../../shared/images/lens/S.jpg"] },
  { id: 18, brand: "Tamron", model: "70-180mm f/2.8 Di III VXD", category: "Lens", pricePerDay: 750, images: ["../../shared/images/lens/T.jpg"] },
  { id: 19, brand: "Fujifilm", model: "XF 35mm f/1.4 R", category: "Lens", pricePerDay: 450, images: ["../../shared/images/lens/FJ.jpg"] },
  { id: 20, brand: "Sigma", model: "16mm f/1.4 DC DN", category: "Lens", pricePerDay: 400, images: ["../../shared/images/lens/SI.jpg"] },
  // light
  { id: 21, brand: "Godox", model: "SL60W LED", category: "Light Equipment", pricePerDay: 500, images: ["../../shared/images/light/G60.jpg"] },
  { id: 22, brand: "Aputure", model: "Amaran 100d", category: "Light Equipment", pricePerDay: 650, images: ["../../shared/images/light/A.jpg"] },
  { id: 23, brand: "Godox", model: "AD200 Pro Flash", category: "Light Equipment", pricePerDay: 800, images: ["../../shared/images/light/AD.jpg"] },
  { id: 24, brand: "Neewer", model: "660 RGB LED Panel", category: "Light Equipment", pricePerDay: 400, images: ["../../shared/images/light/RGB.jpg"] },
  { id: 25, brand: "Godox", model: "ML60 LED", category: "Light Equipment", pricePerDay: 550, images: ["../../shared/images/light/ML.jpg"] },
  { id: 26, brand: "Aputure", model: "MC Pro RGBWW", category: "Light Equipment", pricePerDay: 300, images: ["../../shared/images/light/MC.jpg"] },
  //storage
  { id: 27, brand: "SanDisk", model: "Extreme Pro 128GB SD", category: "Storage", pricePerDay: 150, images: ["../../shared/images/storage/S128.jpg"] },
  { id: 28, brand: "SanDisk", model: "Extreme Pro 256GB SD", category: "Storage", pricePerDay: 200, images: ["../../shared/images/storage/S256.jpg"] },
  { id: 29, brand: "Lexar", model: "CFexpress Type B 256GB", category: "Storage", pricePerDay: 300, images: ["../../shared/images/storage/L256.jpg"] },
  { id: 30, brand: "Sony", model: "Tough SF-G 128GB SD", category: "Storage", pricePerDay: 200, images: ["../../shared/images/storage/Sy128.jpg"] },
  { id: 31, brand: "Samsung", model: "PRO Plus 128GB microSD", category: "Storage", pricePerDay: 100, images: ["../../shared/images/storage/SS128.jpg"] },
  { id: 32, brand: "Lexar", model: "1066x 64GB SD", category: "Storage", pricePerDay: 100, images: ["../../shared/images/storage/L64.jpg"] },
  { id: 33, brand: "ProGrade", model: "CFexpress 512GB", category: "Storage", pricePerDay: 400, images: ["../../shared/images/storage/PG.jpg"] },
  { id: 34, brand: "SanDisk", model: "Extreme Portable SSD 1TB", category: "Storage", pricePerDay: 350, images: ["../../shared/images/storage/SD1.jpg"] },
  { id: 35, brand: "Samsung", model: "T7 Shield SSD 1TB", category: "Storage", pricePerDay: 350, images: ["../../shared/images/storage/SS1.jpg"] },
  { id: 36, brand: "Kingston", model: "Canvas React Plus 128GB SD", category: "Storage", pricePerDay: 150, images: ["../../shared/images/storage/K128.jpg"] },
  //tripod
  { id: 37, brand: "Manfrotto", model: "Compact Tripod", category: "Tripod", pricePerDay: 250, images: ["../../shared/images/tripod/M.jpg"] },
  { id: 38, brand: "Benro", model: "Mach3 Carbon Tripod", category: "Tripod", pricePerDay: 450, images: ["../../shared/images/tripod/BM.jpg"] },
  { id: 39, brand: "Joby", model: "GorillaPod 5K", category: "Tripod", pricePerDay: 200, images: ["../../shared/images/tripod/JG.jpg"] },
  //gimbal
  { id: 40, brand: "DJI", model: "RS 3", category: "Gimbal", pricePerDay: 850, images: ["../../shared/images/gimbal/RS3.jpg"] },
  { id: 41, brand: "DJI", model: "RS 3 Mini", category: "Gimbal", pricePerDay: 700, images: ["../../shared/images/gimbal/RS3m.jpg"] },
  { id: 42, brand: "Zhiyun", model: "Crane 2S", category: "Gimbal", pricePerDay: 700, images: ["../../shared/images/gimbal/ZC.jpg"] },
  { id: 43, brand: "Zhiyun", model: "Weebill 3", category: "Gimbal", pricePerDay: 750, images: ["../../shared/images/gimbal/ZW.jpg"] }
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

/* Each reservation has:
   start / end       the rental dates
   pickupTime        time of pick-up on the start date (24h "HH:MM")
   dropoffTime       time of drop-off (return) on the end date (24h "HH:MM")
   status            "booked" = return not confirmed yet (shown as Upcoming / Ongoing / Pending by the dates)
                     "done"   = the admin confirmed the equipment was returned                         */
let reservations = [
  { id: 1, userId: 3, deviceIds: [1, 17, 36], start: "2025-03-03", end: "2025-03-04", pickupTime: "09:00", dropoffTime: "17:00", status: "done" },
  { id: 2, userId: 7, deviceIds: [27, 42], start: "2025-03-03", end: "2025-03-05", pickupTime: "10:00", dropoffTime: "18:00", status: "done" },
  { id: 3, userId: 3, deviceIds: [28, 43], start: "2025-03-07", end: "2025-03-09", pickupTime: "08:30", dropoffTime: "16:30", status: "done" },
  { id: 4, userId: 11, deviceIds: [2, 15, 28, 39, 41], start: "2025-03-20", end: "2025-03-20", pickupTime: "13:00", dropoffTime: "19:00", status: "done" },
  { id: 5, userId: 17, deviceIds: [9, 13, 29], start: "2025-03-26", end: "2025-03-27", pickupTime: "11:00", dropoffTime: "17:30", status: "done" },
  { id: 6, userId: 3, deviceIds: [2, 15, 33, 39], start: "2025-04-12", end: "2025-04-15", pickupTime: "14:00", dropoffTime: "18:30", status: "done" },
  { id: 7, userId: 13, deviceIds: [4, 16, 34, 39], start: "2025-04-18", end: "2025-04-19", pickupTime: "09:30", dropoffTime: "20:00", status: "done" },
  { id: 8, userId: 9, deviceIds: [22, 24], start: "2025-04-23", end: "2025-04-23", pickupTime: "15:00", dropoffTime: "16:00", status: "done" },
  { id: 9, userId: 20, deviceIds: [4, 35], start: "2025-04-29", end: "2025-05-03", pickupTime: "09:00", dropoffTime: "17:00", status: "done" },
  { id: 10, userId: 2, deviceIds: [10, 15, 24, 30], start: "2025-05-06", end: "2025-05-07", pickupTime: "10:00", dropoffTime: "18:00", status: "done" },
  { id: 11, userId: 18, deviceIds: [1, 29, 40], start: "2025-05-11", end: "2025-05-14", pickupTime: "08:30", dropoffTime: "16:30", status: "done" },
  { id: 12, userId: 10, deviceIds: [23, 24], start: "2025-05-13", end: "2025-05-13", pickupTime: "13:00", dropoffTime: "19:00", status: "done" },
  { id: 13, userId: 3, deviceIds: [9, 34], start: "2025-05-13", end: "2025-05-17", pickupTime: "11:00", dropoffTime: "17:30", status: "done" },
  { id: 14, userId: 16, deviceIds: [4, 30, 39, 43], start: "2025-06-04", end: "2025-06-05", pickupTime: "14:00", dropoffTime: "18:30", status: "done" },
  { id: 15, userId: 19, deviceIds: [25, 26], start: "2025-06-06", end: "2025-06-09", pickupTime: "09:30", dropoffTime: "20:00", status: "done" },
  { id: 16, userId: 6, deviceIds: [6], start: "2025-06-18", end: "2025-06-19", pickupTime: "15:00", dropoffTime: "16:00", status: "done" },
  { id: 17, userId: 1, deviceIds: [9, 12, 28], start: "2025-07-11", end: "2025-07-13", pickupTime: "09:00", dropoffTime: "17:00", status: "done" },
  { id: 18, userId: 11, deviceIds: [3, 14, 32], start: "2025-07-11", end: "2025-07-11", pickupTime: "10:00", dropoffTime: "18:00", status: "done" },
  { id: 19, userId: 6, deviceIds: [7, 24, 30], start: "2025-08-09", end: "2025-08-11", pickupTime: "08:30", dropoffTime: "16:30", status: "done" },
  { id: 20, userId: 17, deviceIds: [21, 23], start: "2025-08-14", end: "2025-08-16", pickupTime: "13:00", dropoffTime: "19:00", status: "done" },
  { id: 21, userId: 3, deviceIds: [4, 15, 25, 28], start: "2025-08-17", end: "2025-08-21", pickupTime: "11:00", dropoffTime: "17:30", status: "done" },
  { id: 22, userId: 17, deviceIds: [4, 17, 34, 37], start: "2025-08-27", end: "2025-08-28", pickupTime: "14:00", dropoffTime: "18:30", status: "done" },
  { id: 23, userId: 13, deviceIds: [2, 27], start: "2025-08-30", end: "2025-08-30", pickupTime: "09:30", dropoffTime: "20:00", status: "done" },
  { id: 24, userId: 9, deviceIds: [4, 27, 41], start: "2025-09-07", end: "2025-09-07", pickupTime: "15:00", dropoffTime: "16:00", status: "done" },
  { id: 25, userId: 19, deviceIds: [2, 12], start: "2025-09-13", end: "2025-09-13", pickupTime: "09:00", dropoffTime: "17:00", status: "done" },
  { id: 26, userId: 15, deviceIds: [10, 20, 22, 35, 37], start: "2025-09-21", end: "2025-09-25", pickupTime: "10:00", dropoffTime: "18:00", status: "done" },
  { id: 27, userId: 11, deviceIds: [7, 37], start: "2025-09-26", end: "2025-09-28", pickupTime: "08:30", dropoffTime: "16:30", status: "done" },
  { id: 28, userId: 20, deviceIds: [10, 19, 23, 36, 40], start: "2025-10-20", end: "2025-10-24", pickupTime: "13:00", dropoffTime: "19:00", status: "done" },
  { id: 29, userId: 1, deviceIds: [1, 20, 31], start: "2025-10-20", end: "2025-10-22", pickupTime: "11:00", dropoffTime: "17:30", status: "done" },
  { id: 30, userId: 7, deviceIds: [4], start: "2025-12-14", end: "2025-12-15", pickupTime: "14:00", dropoffTime: "18:30", status: "done" },
  { id: 31, userId: 20, deviceIds: [6, 12, 23], start: "2026-01-05", end: "2026-01-06", pickupTime: "09:30", dropoffTime: "20:00", status: "done" },
  { id: 32, userId: 4, deviceIds: [8, 12, 32], start: "2026-01-07", end: "2026-01-08", pickupTime: "15:00", dropoffTime: "16:00", status: "done" },
  { id: 33, userId: 1, deviceIds: [2, 18, 27], start: "2026-01-26", end: "2026-01-27", pickupTime: "09:00", dropoffTime: "17:00", status: "done" },
  { id: 34, userId: 20, deviceIds: [8, 17], start: "2026-02-05", end: "2026-02-07", pickupTime: "10:00", dropoffTime: "18:00", status: "done" },
  { id: 35, userId: 3, deviceIds: [24, 26], start: "2026-02-09", end: "2026-02-09", pickupTime: "08:30", dropoffTime: "16:30", status: "done" },
  { id: 36, userId: 20, deviceIds: [4, 12, 32], start: "2026-02-19", end: "2026-02-21", pickupTime: "13:00", dropoffTime: "19:00", status: "done" },
  { id: 37, userId: 13, deviceIds: [3, 14, 22, 35], start: "2026-02-20", end: "2026-02-22", pickupTime: "11:00", dropoffTime: "17:30", status: "done" },
  { id: 38, userId: 8, deviceIds: [10, 19, 32], start: "2026-02-23", end: "2026-02-23", pickupTime: "14:00", dropoffTime: "18:30", status: "done" },
  { id: 39, userId: 9, deviceIds: [1, 29], start: "2026-02-27", end: "2026-02-27", pickupTime: "09:30", dropoffTime: "20:00", status: "done" },
  { id: 40, userId: 5, deviceIds: [5, 14, 34, 38], start: "2026-03-05", end: "2026-03-09", pickupTime: "15:00", dropoffTime: "16:00", status: "done" },
  { id: 41, userId: 17, deviceIds: [4, 23, 37], start: "2026-03-12", end: "2026-03-12", pickupTime: "09:00", dropoffTime: "17:00", status: "done" },
  { id: 42, userId: 1, deviceIds: [28, 41], start: "2026-03-17", end: "2026-03-17", pickupTime: "10:00", dropoffTime: "18:00", status: "done" },
  { id: 43, userId: 4, deviceIds: [30, 43], start: "2026-03-19", end: "2026-03-21", pickupTime: "08:30", dropoffTime: "16:30", status: "done" },
  { id: 44, userId: 5, deviceIds: [5, 16, 24, 37, 42], start: "2026-04-07", end: "2026-04-08", pickupTime: "13:00", dropoffTime: "19:00", status: "done" },
  { id: 45, userId: 2, deviceIds: [4, 14], start: "2026-04-14", end: "2026-04-15", pickupTime: "11:00", dropoffTime: "17:30", status: "done" },
  { id: 46, userId: 7, deviceIds: [3, 11, 37], start: "2026-04-20", end: "2026-04-22", pickupTime: "14:00", dropoffTime: "18:30", status: "done" },
  { id: 47, userId: 12, deviceIds: [3, 13, 36, 41], start: "2026-04-28", end: "2026-04-28", pickupTime: "09:30", dropoffTime: "20:00", status: "done" },
  { id: 48, userId: 15, deviceIds: [6, 42], start: "2026-05-01", end: "2026-05-02", pickupTime: "15:00", dropoffTime: "16:00", status: "done" },
  { id: 49, userId: 9, deviceIds: [3, 16, 26], start: "2026-05-02", end: "2026-05-04", pickupTime: "09:00", dropoffTime: "17:00", status: "done" },
  { id: 50, userId: 2, deviceIds: [1, 30, 43], start: "2026-05-08", end: "2026-05-08", pickupTime: "10:00", dropoffTime: "18:00", status: "done" },
  { id: 51, userId: 6, deviceIds: [6, 23], start: "2026-05-22", end: "2026-05-26", pickupTime: "08:30", dropoffTime: "16:30", status: "done" },
  { id: 52, userId: 11, deviceIds: [2, 19, 39], start: "2026-06-07", end: "2026-06-09", pickupTime: "13:00", dropoffTime: "19:00", status: "done" },
  { id: 53, userId: 3, deviceIds: [1, 19, 21, 36, 39], start: "2026-06-19", end: "2026-06-20", pickupTime: "11:00", dropoffTime: "17:30", status: "done" },
  { id: 54, userId: 7, deviceIds: [33, 40], start: "2026-06-30", end: "2026-06-30", pickupTime: "14:00", dropoffTime: "18:30", status: "done" },
  { id: 55, userId: 16, deviceIds: [2, 14, 34], start: "2026-07-02", end: "2026-07-04", pickupTime: "09:30", dropoffTime: "20:00", status: "done" },
  { id: 56, userId: 20, deviceIds: [9, 19, 24, 29], start: "2026-07-05", end: "2026-07-09", pickupTime: "15:00", dropoffTime: "16:00", status: "done" },
  { id: 57, userId: 9, deviceIds: [8, 26, 34], start: "2026-07-10", end: "2026-07-14", pickupTime: "09:00", dropoffTime: "17:00", status: "done" },
  { id: 58, userId: 12, deviceIds: [4, 14, 26, 28], start: "2026-07-24", end: "2026-07-28", pickupTime: "10:00", dropoffTime: "18:00", status: "done" },
  { id: 59, userId: 1, deviceIds: [9, 16, 21, 27], start: "2026-07-31", end: "2026-08-01", pickupTime: "08:30", dropoffTime: "16:30", status: "done" },
  { id: 60, userId: 16, deviceIds: [6, 17, 26, 37], start: "2026-08-13", end: "2026-08-15", pickupTime: "13:00", dropoffTime: "19:00", status: "done" },
  { id: 61, userId: 6, deviceIds: [7, 31, 41], start: "2026-08-13", end: "2026-08-14", pickupTime: "11:00", dropoffTime: "17:30", status: "done" },
  { id: 62, userId: 4, deviceIds: [7, 17, 28, 40], start: "2026-08-26", end: "2026-08-29", pickupTime: "14:00", dropoffTime: "18:30", status: "done" },
  { id: 63, userId: 5, deviceIds: [6, 17, 22, 28, 43], start: "2026-09-06", end: "2026-09-07", pickupTime: "09:30", dropoffTime: "20:00", status: "done" },
  { id: 64, userId: 10, deviceIds: [4, 29], start: "2026-09-07", end: "2026-09-08", pickupTime: "15:00", dropoffTime: "16:00", status: "done" },
  { id: 65, userId: 15, deviceIds: [2, 32], start: "2026-09-12", end: "2026-09-15", pickupTime: "09:00", dropoffTime: "17:00", status: "done" },
  { id: 66, userId: 17, deviceIds: [10, 11], start: "2026-09-15", end: "2026-09-16", pickupTime: "10:00", dropoffTime: "18:00", status: "done" },
  { id: 67, userId: 7, deviceIds: [8, 17, 35], start: "2026-09-25", end: "2026-09-29", pickupTime: "08:30", dropoffTime: "16:30", status: "done" },
  { id: 68, userId: 17, deviceIds: [5, 12, 35, 37], start: "2026-10-18", end: "2026-10-18", pickupTime: "13:00", dropoffTime: "19:00", status: "done" },
  { id: 69, userId: 4, deviceIds: [33, 41], start: "2026-10-18", end: "2026-10-19", pickupTime: "11:00", dropoffTime: "17:30", status: "done" },
  { id: 70, userId: 2, deviceIds: [1, 19, 25, 36], start: "2026-11-02", end: "2026-11-03", pickupTime: "14:00", dropoffTime: "18:30", status: "done" },
  { id: 71, userId: 9, deviceIds: [8, 18, 30], start: "2026-11-11", end: "2026-11-12", pickupTime: "09:30", dropoffTime: "20:00", status: "done" },
  // test case: ended Nov 18 and the return was not confirmed yet -> shows as Pending
  { id: 72, userId: 14, deviceIds: [6, 19, 27, 41], start: "2026-11-14", end: "2026-11-18", pickupTime: "09:00", dropoffTime: "17:00", status: "booked" },
  { id: 73, userId: 3, deviceIds: [8, 17, 31], start: "2026-12-01", end: "2026-12-02", pickupTime: "10:00", dropoffTime: "18:00", status: "booked" },
  { id: 74, userId: 1, deviceIds: [8, 43], start: "2026-12-03", end: "2026-12-05", pickupTime: "08:30", dropoffTime: "16:30", status: "booked" },
  { id: 75, userId: 9, deviceIds: [9, 35, 39], start: "2026-12-08", end: "2026-12-08", pickupTime: "13:00", dropoffTime: "19:00", status: "booked" },
  { id: 76, userId: 16, deviceIds: [5, 13, 27, 41], start: "2026-12-13", end: "2026-12-14", pickupTime: "11:00", dropoffTime: "17:30", status: "booked" }
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

// safety net for older saved data: turn the old "returned" flag into the new "status" field
reservations.forEach(r => {
  if (r.status === undefined) r.status = r.returned ? "done" : "booked";
  delete r.returned;
});

// Same renter + same dates + same pick-up/drop-off times (and not finished yet) = ONE reservation with many devices.
function sameBooking(a, b) {
  return a.userId === b.userId && a.start === b.start && a.end === b.end &&
         (a.pickupTime || "") === (b.pickupTime || "") && (a.dropoffTime || "") === (b.dropoffTime || "") &&
         a.status === "booked" && b.status === "booked";
}

// Cleans up data saved before this rule existed: split rows of the same booking are joined into one.
(function mergeSplitReservations() {
  let changed = false;
  const kept = [];
  reservations.forEach(r => {
    const first = kept.find(k => sameBooking(k, r));
    if (first) {
      r.deviceIds.forEach(id => { if (!first.deviceIds.includes(id)) first.deviceIds.push(id); });
      if (!first.idType && r.idType) first.idType = r.idType;
      changed = true;
    } else {
      kept.push(r);
    }
  });
  if (changed) { reservations = kept; save(); }
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

const ACCOUNTS_KEY = "arkilente_accounts";
const SESSION_KEY = "arkilente_currentUser";
const SELECTED_DEVICE_KEY = "arkilente_selectedDeviceId"


/*----------ADMIN ACCOUNT----------*/
const ADMIN_ACCOUNT = {
  email: "admin@arkilente.com",
  password: "Admin@123",
  role: "admin"
};

// STORAGE HELPERS
function readData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}


//ACCOUNTS
function getAccounts() {
  return readData(ACCOUNTS_KEY, []);
}

function findAccountByEmail(email) {
  const clean = String(email).trim().toLowerCase();
  if (clean === ADMIN_ACCOUNT.email.toLowerCase()) return ADMIN_ACCOUNT;
  return getAccounts().find((a)=> a.email === clean) || null;
}

function saveAccount(email, password, fullName, contact) {
  const accounts = getAccounts();
  const account = { email: String(email).trim().toLowerCase(), password, fullName, contact, role: "customer"};
  accounts.push(account);
  writeData(ACCOUNTS_KEY, accounts);
  return account;
}


//SESSION FOR EACH ACCOUNTS
function setCurrentUser(account) {
  writeData(SESSION_KEY, {email: account.email, role: account.role, fullName: account.fullName, contact: account.contact});
}

function getCurrentUser() {
  return readData(SESSION_KEY, null);
}

function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}


//CALL SELECTED DEVICES FROM CATALOG
function setSelectedDeviceId(id) {
  localStorage.setItem(SELECTED_DEVICE_KEY, String(id));
}

function getSelectedDeviceId() {
  return sessionStorage.getItem("selectedDeviceId") || localStorage.getItem(SELECTED_DEVICE_KEY);
}

function getSelectedDeviceIds() {
  try {
    const many = JSON.parse(sessionStorage.getItem("selectedDeviceIds"));
    if (Array.isArray(many) && many.length) return many.map(Number);
  } catch (e) {}
  const one = getSelectedDeviceId();
  return one ? [Number(one)] : [];
}

function nextId(list) {
  return list.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

function getReservationsByDevice(deviceId) {
  return reservations.filter((r)=> r.deviceIds.includes(Number(deviceId)));
}

function getReservationsByDevices(deviceIds) {
  return reservations.filter((r) => r.deviceIds.some((id) => deviceIds.includes(id)));
}

function addReservation(deviceId, startDate, endDate, name, contact, email, idType, pickupTime, dropoffTime) {
  const cleanEmail = String(email).trim().toLowerCase();
  let user = users.find((u)=> u.email.toLowerCase() === cleanEmail);
  if(!user) {
    user = {
      id: nextId(users),
      name,
      contact,
      email: cleanEmail
    };
    users.push(user);
  }

  const newIds = [].concat(deviceId).map(Number);

  // Same renter, same dates and times as an existing booking -> add the device(s) to that booking
  const existing = reservations.find((r) => sameBooking(r, {
    userId: user.id, start: startDate, end: endDate, pickupTime, dropoffTime, status: "booked"
  }));
  if (existing) {
    newIds.forEach((id) => { if (!existing.deviceIds.includes(id)) existing.deviceIds.push(id); });
    save();
    return existing;
  }

  const reservation = {
    id: nextId(reservations),
    userId: user.id,
    deviceIds: [].concat(deviceId).map(Number),
    start: startDate,
    end: endDate,
    pickupTime,
    dropoffTime,
    idType,
    status: "booked"
  };
  reservations.push(reservation);
  save();
  return reservation;
}

function deleteReservation(id) {
  const index = reservations.findIndex((r)=> r.id === id);
  if (index !== -1) reservations.splice(index, 1);
  save();
}