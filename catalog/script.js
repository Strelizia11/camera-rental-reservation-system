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

function showDetails(event) {
    const card = event.target.closest(".equipment-card");
    if (!card) return;
    const device = getDevice(Number(card.dataset.id));
    detailsTitle.textContent = deviceName(device);
    detailsContent.innerHTML = `
        <p>Category: ${esc(device.category)}</p>
        <p>Price: ${peso(device.pricePerDay)} / day</p>
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