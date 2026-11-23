const form = document.getElementById("deviceForm");
const categorySelect = document.getElementById("category");
const specsSection = document.getElementById("specsSection");
const specsBox = document.getElementById("specsBox");
const message = document.getElementById("message");

//builds the specs 
function showSpecs() {
  const category = categorySelect.value;
  const hasSpecs = !!SPEC_FIELDS[category];
  specsSection.classList.toggle("hidden", !hasSpecs);
  if (hasSpecs) {
    document.getElementById("specsTitle").textContent = specTitle(category);
    renderSpecFields(specsBox, category, {}, true);   // true = required fields must be filled
  } else {
    specsBox.innerHTML = "";
  }
}
categorySelect.addEventListener("change", showSpecs);

// ----- image preview -----
document.getElementById("images").addEventListener("change", async e => {
  const urls = await readFiles(e.target.files);
  document.getElementById("imagesPreview").innerHTML = urls.map(u => `<img src="${u}" alt="preview">`).join("");
});

// ----- submit -----
form.addEventListener("submit", async e => {
  e.preventDefault();   // the browser already checked every "required" field

  const data = new FormData(form);
  const device = {
    id: Math.max(0, ...devices.map(d => d.id)) + 1,
    brand: data.get("brand").trim(),
    model: data.get("model").trim(),
    category: data.get("category"),
    pricePerDay: Number(data.get("price")),
    images: await readFiles(document.getElementById("images").files),
    specs: readSpecs(specsBox)
  };

  devices.push(device);
  save();

  form.reset();
  showSpecs();
  document.getElementById("imagesPreview").innerHTML = "";
  message.textContent = `${deviceName(device)} was added to the catalog.`;
  message.style.display = "block";
  window.scrollTo(0, 0);
});

function initAddDevice() {
  renderSidebar("add-device");
  categorySelect.innerHTML = `<option value="">Select category</option>` +
    CATEGORIES.map(c => `<option>${c}</option>`).join("");
}
window.addEventListener("DOMContentLoaded", initAddDevice);