const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const resultCount = document.getElementById("result-count");
const equipmentGrid = document.getElementById("equipment-grid");
const emptyState = document.getElementById("empty-state");
const detailsPanel = document.getElementById("details-panel");
const detailsTitle = document.getElementById("details-title");
const detailsContent = document.getElementById("details-content");
const logoutBtn = document.getElementById("logout-btn");

let searchText = "";
let selectedCategory = "All";

// Initial functions

function fillCategories() {
    const list = ["All", ...CATEGORIES];
    list.forEach(function (category) {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function getFilteredDevices() {
    return devices.filter(function (device) {
        const name = deviceName(device).toLowerCase();
        const matchesSearch = name.includes(searchText.toLowerCase().trim());
        const matchesCategory = selectedCategory === "All" || selectedCategory === device.category;
        return matchesSearch && matchesCategory;
    });
}

function createCard(device) {
    const image = device.images[0] ? device.images[0].replace("../../", "../") : "../shared/images/placeholder.png";
    
    return `
        <li class="equipment-card" data-id="${device.id}">
            <article>
                <img class="card-image" src="${image}" alt="${esc(deviceName(device))}">
                <div class="card-body">
                    <p class="card-category">${esc(device.category)}</p>
                    <h2 class="card-title">
                        <span class="card-brand">${esc(device.brand)}</span>
                        <span class="card-model">${esc(device.model)}</span>
                    </h2>
                    <p class="card-price">${peso(device.pricePerDay)} / day </p>
                </div>
                <div class="card-actions">
                    <button type="button" class="btn btn-primary card-reserve-btn">Reserve</button>
                </div>
            </article>
        </li>
    `;
}

function renderCatalog() {
    const list = getFilteredDevices();
    equipmentGrid.innerHTML = "";
    resultCount.textContent = `Showing ${list.length} items`;

    if (list.length === 0) {
        emptyState.textContent = "No equipment found.";
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
    }

    list.forEach(device => {
        equipmentGrid.insertAdjacentHTML("beforeend", createCard(device));
    });
}

// Searching functions
function searchDevice() {
    searchText = searchInput.value;
    renderCatalog();
}

function filterDevice() {
    selectedCategory = categoryFilter.value;
    renderCatalog();
}

// Desktop hovering
let activeCard = null;

function positionDetails() {
    if (!activeCard) return;
    const rect = activeCard.getBoundingClientRect();
    const actions = activeCard.querySelector(".card-actions");
    detailsPanel.style.width = rect.width + "px";
    detailsPanel.style.height = (rect.height - actions.offsetHeight) + "px";
    detailsPanel.style.left = rect.left + "px";
    detailsPanel.style.top = rect.top + "px";
}

const MAX_SPECS = 4;
const SPEC_ROWS = [
    s => s.sensor && ["Sensor", s.sensor],
    s => s.megapixels && ["Resolution", s.megapixels + " MP"],
    s => s.video_res && ["Video", s.video_res + (s.video_fps ? " / " + s.video_fps + " fps" : "")],
    s => s.focal_min && ["Focal length", s.focal_min === s.focal_max ? s.focal_min + " mm" : s.focal_min + "–" + s.focal_max + " mm"],
    s => s.max_aperture && ["Aperture", "f/" + s.max_aperture],
    s => s.wattage && ["Wattage", s.wattage + " W"],
    s => s.lumens && ["Brightness", s.lumens + " lm"],
    s => s.power && ["Power source", s.power],
    s => s.mount && ["Mount", s.mount],
    s => s.size && ["Capacity", s.size >= 1000 ? s.size / 1000 + " TB" : s.size + " GB"],
    s => s.max_transfer && ["Speed", "up to " + s.max_transfer + " MB/s"],
    s => s.card_type && s.card_type !== "Other" && ["Type", s.card_type],
    s => s.write_speed && ["Rating", s.write_speed],
    s => s.max_load && ["Max load", s.max_load + " kg"],
    s => s.max_height && ["Max height", s.max_height + " cm"],
    s => s.payload && ["Payload", s.payload + " kg"],
    s => s.axes && ["Axes", s.axes],
    s => s.battery && ["Battery", s.battery + " hrs"],
    s => s.weight && ["Weight", s.weight + " kg"],
    s => s.material && s.material !== "Other" && ["Material", s.material]
];

function specRows(device) {
    const specs = getSpecs(device);
    return SPEC_ROWS.map(build => build(specs)).filter(Boolean).slice(0, MAX_SPECS);
}

function showDetails(event) {
    const card = event.target.closest(".equipment-card");
    if (!card) return;
    const device = getDevice(Number(card.dataset.id));
    detailsTitle.textContent = deviceName(device);
        const specHtml = specRows(device).map(function (row) {
        return `<p><strong>${row[0]}</strong><span>${esc(String(row[1]))}</span></p>`;
    }).join("");
    detailsContent.innerHTML = `
        <p><strong>Category</strong><span>${esc(device.category)}</span></p>
        <p><strong>Price</strong><span>${peso(device.pricePerDay)} / day</span></p>
        ${specHtml}
    `;
    detailsPanel.show();

    activeCard = card;
    positionDetails();
}

function hideDetails(event) {
    const card = event.target.closest(".equipment-card");
    if (!card) return;
    if (card.contains(event.relatedTarget)) return;
    detailsPanel.close();
    activeCard = null;
}

// Long press for mobile
let pressTimer = null;
let longPressed = false;

function startPress(event) {
    longPressed = false;
    pressTimer = setTimeout(function () {
        longPressed = true;
        showDetails(event);
    }, 500);
}

function cancelPress(event) {
    clearTimeout(pressTimer);
    hideDetails(event);
}

function selectDevice(event) {
    const button = event.target.closest(".card-reserve-btn");
    if (!button) return;
    if (longPressed) return;

    const card = button.closest(".equipment-card");
    const id = Number(card.dataset.id);
    sessionStorage.setItem("selectedDeviceId", id);
    window.location.href = "../reservation/reservation.html";
}

function logout() {
    logoutUser();
    window.location.href = "../index.html";
}

// Listeners
document.addEventListener("DOMContentLoaded", function () {
    if (!getCurrentUser()) {
        window.location.href = "../index.html";
        return;
    }
    fillCategories();
    renderCatalog();
});
searchInput.addEventListener("input", searchDevice);
categoryFilter.addEventListener("change", filterDevice);
if (window.matchMedia("(hover: hover)").matches) {
    equipmentGrid.addEventListener("mouseover", showDetails);
    equipmentGrid.addEventListener("mouseout", hideDetails);
}
window.addEventListener("scroll", positionDetails, { passive: true });
equipmentGrid.addEventListener("touchstart", startPress);
equipmentGrid.addEventListener("touchmove", cancelPress);
equipmentGrid.addEventListener("touchend", cancelPress);
equipmentGrid.addEventListener("touchcancel", cancelPress);
equipmentGrid.addEventListener("contextmenu", function (event) {
    event.preventDefault();
});
equipmentGrid.addEventListener("click", selectDevice);
logoutBtn.addEventListener("click", logout);