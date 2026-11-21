/* specs.js - which spec inputs each device category has.
   Used by BOTH the Add Device form and the Edit Device pop-up, so you define them once.

   Field types:
     number   -> <input type="number"> with the unit shown beside it
     select   -> dropdown for predefined choices
     checks   -> checkboxes (pick several)
     textarea -> free text (used for "Additional")
     pair     -> two number inputs for a range (e.g. ISO 100 to 51200)
   Add  optional: true  to a field when it may be left empty.                      */

const SENSORS = ["Full Frame", "APS-C", "Micro Four Thirds", "1-inch", "Medium Format"];

const SPEC_FIELDS = {
  "Camera": [
    { type: "select", name: "sensor", label: "Sensor Size", options: SENSORS },
    { type: "number", name: "megapixels", label: "Megapixels", unit: "MP", step: 0.1 },
    { type: "select", name: "type", label: "Type", options: ["Mirrorless", "Point and Shot", "DSLR"] },
    { type: "select", name: "stabilization", label: "Image Stabilization", options: ["IBIS", "OIS", "None"] },
    { type: "pair", label: "ISO", hint: "Lowest to highest",
      a: { name: "iso_min", ph: "100" }, b: { name: "iso_max", ph: "51200" } },
    { type: "pair", label: "Aperture", hint: "Widest to narrowest",
      a: { name: "aperture_wide", prefix: "f/", ph: "1.8", step: 0.1 }, b: { name: "aperture_narrow", prefix: "f/", ph: "22", step: 0.1 } },
    { type: "pair", label: "Focal Length", hint: "For a fixed lens, enter the same value twice",
      a: { name: "focal_min", unit: "mm", ph: "24" }, b: { name: "focal_max", unit: "mm", ph: "70" } },
    { type: "pair", label: "Shutter Speed", hint: "Fastest to slowest",
      a: { name: "shutter_fast", prefix: "1/", unit: "s", ph: "8000" }, b: { name: "shutter_slow", unit: "s", ph: "30" } },
    { type: "select", name: "af_type", label: "Auto Focus System", options: ["Phase Detection", "Contrast Detection", "Hybrid"] },
    { type: "number", name: "af_points", label: "Auto Focus Points", unit: "points", optional: true },
    { type: "select", name: "video_res", label: "Max Video Resolution", options: ["8K", "6K", "4K", "Full HD (1080p)", "HD (720p)"] },
    { type: "number", name: "video_fps", label: "Max Frame Rate", unit: "fps" }
  ],

  "Lens": [
    { type: "pair", label: "Focal Length", hint: "For a prime lens, enter the same value twice",
      a: { name: "focal_min", unit: "mm", ph: "24" }, b: { name: "focal_max", unit: "mm", ph: "70" } },
    { type: "number", name: "max_aperture", label: "Maximum Aperture", prefix: "f/", step: 0.1 },
    { type: "select", name: "mount", label: "Lens Mount",
      options: ["Sony E", "Canon RF", "Canon EF", "Nikon Z", "Nikon F", "Fujifilm X", "Micro Four Thirds", "Leica L", "Other"] },
    { type: "select", name: "sensor_format", label: "Supported Sensor Format", options: ["Full Frame", "APS-C", "Micro Four Thirds", "Medium Format"] },
    { type: "textarea", name: "additional", label: "Additional", optional: true }
  ],

  // the "Storage" category uses the SD card specs
  "Storage": [
    { type: "number", name: "size", label: "Size", unit: "GB" },
    { type: "select", name: "card_type", label: "Type", options: ["SDHC", "SDXC", "SDUC", "Other"] },
    { type: "number", name: "max_transfer", label: "Max Transfer Speed", unit: "MB/s" },
    { type: "select", name: "write_speed", label: "Write Speed", options: ["Class 10", "U1", "V10", "U3", "V30", "V60", "V90"] },
    { type: "textarea", name: "additional", label: "Additional", optional: true }
  ],

  "Tripod": [
    { type: "number", name: "max_load", label: "Maximum Load Capacity", unit: "kg", step: 0.1 },
    { type: "number", name: "max_height", label: "Maximum Height", unit: "cm" },
    { type: "number", name: "folded_length", label: "Folded (Collapsed) Length", unit: "cm" },
    { type: "number", name: "weight", label: "Tripod Weight", unit: "kg", step: 0.01 },
    { type: "select", name: "material", label: "Material", options: ["Aluminum", "Carbon Fiber", "Basalt", "Magnesium", "Plastic", "Other"] },
    { type: "select", name: "thread", label: "Mount Thread", options: ["1/4\"-20", "3/8\"-16", "1/4\" and 3/8\" (reversible)"] },
    { type: "select", name: "quick_release", label: "Quick Release", options: ["Arca-Swiss", "Manfrotto RC2", "Proprietary", "None"] }
  ],

  "Gimbal": [
    { type: "select", name: "axes", label: "Stabilization Axes", options: ["2-axis", "3-axis"] },
    { type: "number", name: "payload", label: "Payload Capacity", unit: "kg", step: 0.1 },
    { type: "number", name: "torque", label: "Motor Torque", unit: "N·m", step: 0.1 },
    { type: "select", name: "responsiveness", label: "Responsiveness", options: ["Standard", "Fast", "Very Fast"] },
    { type: "number", name: "weight", label: "Gimbal Body Weight", unit: "kg", step: 0.01 },
    { type: "number", name: "battery", label: "Battery Runtime", unit: "hours", step: 0.1 },
    { type: "select", name: "grip", label: "Grip & Mounting", options: ["Single-hand grip", "Dual-hand grip", "Single-hand grip + tripod mount", "Other"] },
    { type: "select", name: "camera_control", label: "Camera Control", options: ["Bluetooth", "USB-C cable", "Bluetooth and USB-C cable", "None"] },
    { type: "checks", name: "modes", label: "Operating Modes", options: ["Pan Follow", "Pan & Tilt Follow", "Lock", "FPV", "Sport", "Portrait"] },
    { type: "textarea", name: "additional", label: "Additional", optional: true }
  ],

  "Light Equipment": [
    { type: "number", name: "wattage", label: "Wattage", unit: "W" },
    { type: "number", name: "lux", label: "Lux (at 1 m)", unit: "lx", optional: true },
    { type: "number", name: "lumens", label: "Lumens", unit: "lm", optional: true },
    { type: "select", name: "power", label: "Power Source", options: ["AC Mains", "Battery", "AC Mains and Battery", "USB-C PD"] },
    { type: "select", name: "cooling", label: "Cooling", options: ["Passive (fanless)", "Active (fan)"] },
    { type: "select", name: "mount", label: "Mount Type", options: ["Camera hot shoe (on-camera flash)", "Bowens mount", "Standalone (stand or handheld)", "Other"] },
    { type: "checks", name: "controls", label: "Controls", options: ["On-device Dials", "Bluetooth", "Wireless Remote", "DMX"] },
    { type: "textarea", name: "additional", label: "Additional", optional: true }
  ]
};

function specTitle(category) {
  return (category === "Storage" ? "Storage (SD Card)" : category) + " Specs";
}

/* ---------- building the inputs ---------- */
function numberInput(p, value, required) {
  return `<div class="input-unit">
    ${p.prefix ? `<span class="pre">${esc(p.prefix)}</span>` : ""}
    <input type="number" name="${p.name}" min="0" step="${p.step || 1}" placeholder="${p.ph || ""}" value="${esc(value)}" ${required ? "required" : ""}>
    ${p.unit ? `<span class="unit">${esc(p.unit)}</span>` : ""}
  </div>`;
}

function fieldHTML(f, values, requireAll) {
  const need = requireAll && !f.optional;
  const val = name => (values[name] === undefined ? "" : values[name]);
  let control = "";
  let wide = "";

  if (f.type === "number") {
    control = numberInput({ ...f }, val(f.name), need);
  } else if (f.type === "pair") {
    wide = " span2";
    control = `<div class="pair-row">${numberInput(f.a, val(f.a.name), need)}<span class="to">to</span>${numberInput(f.b, val(f.b.name), need)}</div>`;
  } else if (f.type === "select") {
    control = `<select name="${f.name}" ${need ? "required" : ""}><option value="">Select</option>` +
      f.options.map(o => `<option ${val(f.name) === o ? "selected" : ""}>${esc(o)}</option>`).join("") + `</select>`;
  } else if (f.type === "checks") {
    wide = " span2";
    const chosen = String(val(f.name)).split(", ");
    control = `<div class="checks">` + f.options.map(o =>
      `<label class="check"><input type="checkbox" name="${f.name}" value="${esc(o)}" ${chosen.includes(o) ? "checked" : ""}> ${esc(o)}</label>`
    ).join("") + `</div>`;
  } else if (f.type === "textarea") {
    control = `<textarea name="${f.name}" rows="2">${esc(val(f.name))}</textarea>`;
    wide = " wide";
  }
  return `<div class="field${wide}"><label>${esc(f.label)}</label>${control}${f.hint ? `<small>${esc(f.hint)}</small>` : ""}</div>`;
}

// Fills `container` with the inputs for `category`.
//  values      = existing specs (when editing)
//  requireAll  = true for Add Device, false for Edit (older devices may have no specs yet)
function renderSpecFields(container, category, values = {}, requireAll = true) {
  const fields = SPEC_FIELDS[category] || [];
  container.innerHTML = fields.map(f => fieldHTML(f, values, requireAll)).join("");
}

// Reads every filled-in input inside `container` into a flat object { name: value }
function readSpecs(container) {
  const out = {};
  container.querySelectorAll("[name]").forEach(el => {
    if (el.type === "checkbox") {
      if (el.checked) out[el.name] = out[el.name] ? out[el.name] + ", " + el.value : el.value;
      return;
    }
    const v = el.value.trim();
    if (v !== "") out[el.name] = v;
  });
  return out;
}