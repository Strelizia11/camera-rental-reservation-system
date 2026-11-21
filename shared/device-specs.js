/* device-specs.js - spec sheet for the devices that ship with the catalog.
   Keys are the full device name (brand + model). The field names match specs.js.
   The Edit pop-up uses these values to pre-fill the form until the admin saves their own. */

const DEVICE_SPECS = {
  /* ---------- cameras ---------- */
  "Sony A7 IV": { sensor: "Full Frame", megapixels: 33, type: "Mirrorless", stabilization: "IBIS", iso_min: 100, iso_max: 51200, shutter_fast: 8000, shutter_slow: 30, af_type: "Hybrid", af_points: 759, video_res: "4K", video_fps: 120 },
  "Sony A6400": { sensor: "APS-C", megapixels: 24.2, type: "Mirrorless", stabilization: "IOS", iso_min: 100, iso_max: 32000, shutter_fast: 4000, shutter_slow: 30, af_type: "Hybrid", af_points: 425, video_res: "4K", video_fps: 120 },
  "Sony ZV-E10": { sensor: "APS-C", megapixels: 24.2, type: "Mirrorless", stabilization: "IOS", iso_min: 100, iso_max: 32000, shutter_fast: 4000, shutter_slow: 30, af_type: "Hybrid", af_points: 425, video_res: "4K", video_fps: 120 },
  "Canon EOS R6 Mark II": { sensor: "Full Frame", megapixels: 24.2, type: "Mirrorless", stabilization: "IBIS", iso_min: 100, iso_max: 102400, shutter_fast: 8000, shutter_slow: 30, af_type: "Hybrid", af_points: 1053, video_res: "4K", video_fps: 180 },
  "Canon EOS 90D": { sensor: "APS-C", megapixels: 32.5, type: "DSLR", stabilization: "IOS", iso_min: 100, iso_max: 25600, shutter_fast: 8000, shutter_slow: 30, af_type: "Hybrid", af_points: 45, video_res: "4K", video_fps: 120 },
  "Canon PowerShot G7 X Mark III": { sensor: "1-inch", megapixels: 20.1, type: "Point and Shot", stabilization: "OIS", iso_min: 125, iso_max: 12800, aperture_wide: 1.8, aperture_narrow: 11, focal_min: 24, focal_max: 100, shutter_fast: 2000, shutter_slow: 30, af_type: "Contrast Detection", video_res: "4K", video_fps: 120 },
  "Nikon Z6 II": { sensor: "Full Frame", megapixels: 24.5, type: "Mirrorless", stabilization: "IBIS", iso_min: 100, iso_max: 51200, shutter_fast: 8000, shutter_slow: 30, af_type: "Hybrid", af_points: 273, video_res: "4K", video_fps: 120 },
  "Nikon D7500": { sensor: "APS-C", megapixels: 20.9, type: "DSLR", stabilization: "IOS", iso_min: 100, iso_max: 51200, shutter_fast: 8000, shutter_slow: 30, af_type: "Phase Detection", af_points: 51, video_res: "4K", video_fps: 60 },
  "Fujifilm X-T30 II": { sensor: "APS-C", megapixels: 26.1, type: "Mirrorless", stabilization: "IOS", iso_min: 160, iso_max: 12800, shutter_fast: 4000, shutter_slow: 30, af_type: "Hybrid", af_points: 425, video_res: "4K", video_fps: 240 },
  "Panasonic Lumix S5": { sensor: "Full Frame", megapixels: 24.2, type: "Mirrorless", stabilization: "IBIS", iso_min: 100, iso_max: 51200, shutter_fast: 8000, shutter_slow: 60, af_type: "Contrast Detection", af_points: 225, video_res: "4K", video_fps: 180 },

  /* ---------- lenses ---------- */
  "Sony FE 24-70mm f/2.8 GM": { focal_min: 24, focal_max: 70, max_aperture: 2.8, mount: "Sony E", sensor_format: "Full Frame" },
  "Sony FE 50mm f/1.8": { focal_min: 50, focal_max: 50, max_aperture: 1.8, mount: "Sony E", sensor_format: "Full Frame" },
  "Canon RF 50mm f/1.8": { focal_min: 50, focal_max: 50, max_aperture: 1.8, mount: "Canon RF", sensor_format: "Full Frame" },
  "Canon RF 24-105mm f/4L": { focal_min: 24, focal_max: 105, max_aperture: 4, mount: "Canon RF", sensor_format: "Full Frame" },
  "Nikon Nikkor Z 24-70mm f/4 S": { focal_min: 24, focal_max: 70, max_aperture: 4, mount: "Nikon Z", sensor_format: "Full Frame" },
  "Nikon Nikkor Z 50mm f/1.8 S": { focal_min: 50, focal_max: 50, max_aperture: 1.8, mount: "Nikon Z", sensor_format: "Full Frame" },
  "Sigma 35mm f/1.4 DG HSM Art": { focal_min: 35, focal_max: 35, max_aperture: 1.4, mount: "Canon EF", sensor_format: "Full Frame", additional: "Also made for other mounts. Change the mount to match your copy." },
  "Tamron 70-180mm f/2.8 Di III VXD": { focal_min: 70, focal_max: 180, max_aperture: 2.8, mount: "Sony E", sensor_format: "Full Frame" },
  "Fujifilm XF 35mm f/1.4 R": { focal_min: 35, focal_max: 35, max_aperture: 1.4, mount: "Fujifilm X", sensor_format: "APS-C" },
  "Sigma 16mm f/1.4 DC DN": { focal_min: 16, focal_max: 16, max_aperture: 1.4, mount: "Sony E", sensor_format: "APS-C", additional: "Also made for other mounts. Change the mount to match your copy." },

  /* ---------- light equipment ---------- */
  "Godox SL60W LED": { wattage: 60, lux: 4700, lumens: 5000, power: "AC Mains", cooling: "Active (fan)", mount: "Bowens mount", controls: "On-device Dials, Wireless Remote" },
  "Aputure Amaran 100d": { wattage: 100, lux: 8500, lumens: 8600, power: "AC Mains", cooling: "Active (fan)", mount: "Bowens mount", controls: "On-device Dials, Bluetooth" },
  "Godox AD200 Pro Flash": { wattage: 200, lumens: 1000, power: "Battery", cooling: "Passive (fanless)", mount: "Standalone (stand or handheld)", controls: "On-device Dials, Wireless Remote", additional: "200 Ws pocket flash. Lumens is for the built-in LED modeling lamp; flash output is not rated in lux." },
  "Neewer 660 RGB LED Panel": { wattage: 40, lux: 1500, lumens: 3200, power: "AC Mains and Battery", cooling: "Passive (fanless)", mount: "Standalone (stand or handheld)", controls: "On-device Dials, Bluetooth" },
  "Godox ML60 LED": { wattage: 60, lux: 5000, lumens: 4200, power: "AC Mains and Battery", cooling: "Passive (fanless)", mount: "Standalone (stand or handheld)", controls: "On-device Dials, Wireless Remote" },
  "Aputure MC Pro RGBWW": { wattage: 20, lux: 300, lumens: 1200, power: "Battery", cooling: "Passive (fanless)", mount: "Standalone (stand or handheld)", controls: "On-device Dials, Bluetooth" },

  /* ---------- storage ---------- */
  "SanDisk Extreme Pro 128GB SD": { size: 128, card_type: "SDXC", max_transfer: 200, write_speed: "V60" },
  "SanDisk Extreme Pro 256GB SD": { size: 256, card_type: "SDXC", max_transfer: 200, write_speed: "V30" },
  "Lexar CFexpress Type B 256GB": { size: 256, card_type: "Other", max_transfer: 1750, additional: "CFexpress Type B card, not SD." },
  "Sony Tough SF-G 128GB SD": { size: 128, card_type: "SDXC", max_transfer: 300, write_speed: "V90" },
  "Samsung PRO Plus 128GB microSD": { size: 128, card_type: "SDXC", max_transfer: 160, write_speed: "V3", additional: "microSD card." },
  "Lexar 1066x 64GB SD": { size: 64, card_type: "SDXC", max_transfer: 160, write_speed: "A2" },
  "ProGrade CFexpress 512GB": { size: 512, card_type: "Other", max_transfer: 1700, additional: "CFexpress Type B card, not SD." },
  "SanDisk Extreme Portable SSD 1TB": { size: 1000, card_type: "Other", max_transfer: 1050, additional: "Portable SSD (USB), not an SD card." },
  "Samsung T7 Shield SSD 1TB": { size: 1000, card_type: "Other", max_transfer: 1050, additional: "Portable SSD (USB), not an SD card." },
  "Kingston Canvas React Plus 128GB SD": { size: 128, card_type: "SDXC", max_transfer: 280, write_speed: "V60" },

  /* ---------- tripods ---------- */
  "Manfrotto Compact Tripod": { max_load: 1.5, max_height: 130, folded_length: 41, weight: 1.1, material: "Aluminum", thread: "1/4\"-20" },
  "Benro Mach3 Carbon Tripod": { max_load: 18, max_height: 155, folded_length: 62, weight: 1.7, material: "Carbon Fiber", thread: "1/4\" and 3/8\" (reversible)", quick_release: "Arca-Swiss" },
  "Joby GorillaPod 5K": { max_load: 5, max_height: 34, folded_length: 33, weight: 0.5, material: "Other", thread: "1/4\"-20", quick_release: "Arca-Swiss" },

  /* ---------- gimbals ---------- */
  "DJI RS 3": { axes: "3-axis", payload: 3, torque: 1.8, responsiveness: "Fast", weight: 0.95, battery: 12, grip: "Single-hand grip", camera_control: "Bluetooth and USB-C cable", modes: "Pan Follow, Pan & Tilt Follow, Lock, FPV, Sport, Portrait", additional: "Carbon fiber arms, 1.8-inch OLED touchscreen, automated axis locks, Ronin app support." },
  "DJI RS 3 Mini": { axes: "3-axis", payload: 2, torque: 1.2, responsiveness: "Fast", weight: 0.85, battery: 10, grip: "Single-hand grip", camera_control: "Bluetooth and USB-C cable", modes: "Pan Follow, Pan & Tilt Follow, Lock, FPV, Sport, Portrait", additional: "Compact build, native vertical (portrait) shooting without an extra bracket, 1.4-inch OLED touchscreen." },
  "Zhiyun Crane 2S": { axes: "3-axis", payload: 4.5, torque: 3.2, responsiveness: "Standard", weight: 1.2, battery: 12, grip: "Dual-hand grip", camera_control: "Bluetooth and USB-C cable", modes: "Pan Follow, Pan & Tilt Follow, Lock, FPV, Sport, Portrait", additional: "Supports a handle or dual-grip setup, built-in focus and zoom control, ZY Cami app support." },
  "Zhiyun Weebill 3": { axes: "3-axis", payload: 3, torque: 1.5, responsiveness: "Fast", weight: 0.99, battery: 14, grip: "Single-hand grip + tripod mount", camera_control: "Bluetooth and USB-C cable", modes: "Pan Follow, Pan & Tilt Follow, Lock, FPV, Sport, Portrait", additional: "Built-in LED fill light, tripod mount, OLED touchscreen, ZY Cami app support." }
};

/* The specs to show for a device:
   1) the specs the admin saved on the device itself (once they have pressed Save Changes), otherwise
   2) the built-in spec sheet above, otherwise
   3) an empty form. */
function getSpecs(device) {
  if (device.specs && Object.keys(device.specs).length > 0) return device.specs;
  return DEVICE_SPECS[deviceName(device)] || {};
}