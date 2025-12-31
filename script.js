let products = [];

function login() {
    localStorage.setItem("loggedIn", "true");
    showDashboard();
}

function logout() {
    localStorage.removeItem("loggedIn");
    location.reload();
}

window.onload = () => {
    if (localStorage.getItem("loggedIn") === "true") {
        showDashboard();
    }
};

function showDashboard() {
    document.getElementById("auth").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    loadProducts();
}

function loadProducts() {
    const container = document.getElementById("products");
    container.innerHTML = "";
    products = [];

    for (let i = 1; i <= 20; i++) {
        products.push({ cent: i, count: 0, weight: 0, value: 0 });

        container.innerHTML += `
        <div class="row">
            <span>${i} Cent</span>
            <input type="number" min="0" oninput="update(${i}, this.value, 'count')">
            <input type="number" min="0" oninput="update(${i}, this.value, 'weight')">
            <span id="value-${i}">₹ 0</span>
        </div>`;
    }
}

function update(cent, value, type) {
    let product = products.find(p => p.cent === cent);
    product[type] = Number(value) || 0;
    calculateTotals();
}

function calculateTotals() {
    let rate = Number(document.getElementById("goldRate").value) || 0;
    let totalP = 0, totalW = 0, totalV = 0;

    products.forEach(p => {
        p.value = p.weight * rate;
        document.getElementById(`value-${p.cent}`).innerText =
            "₹ " + p.value.toLocaleString();

        totalP += p.count;
        totalW += p.weight;
        totalV += p.value;
    });

    document.getElementById("totalProducts").innerText = totalP;
    document.getElementById("totalWeight").innerText = totalW;
    document.getElementById("totalValue").innerText =
        "₹ " + totalV.toLocaleString();
}
