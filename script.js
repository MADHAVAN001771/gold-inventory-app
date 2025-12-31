let products = [];

// AUTO LOGIN CHECK
window.onload = () => {
    if (localStorage.getItem("loggedIn") === "true") {
        showDashboard();
    }
};

function login() {
    // (Later replace with real auth)
    localStorage.setItem("loggedIn", "true");
    showDashboard();
}

function showDashboard() {
    document.getElementById("auth").classList.add("hidden");
    document.getElementById("billing").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    loadProducts();
}

function logout() {
    localStorage.removeItem("loggedIn");
    location.reload();
}

function loadProducts() {
    const container = document.getElementById("products");
    container.innerHTML = "";
    products = [];

    for (let i = 1; i <= 20; i++) {
        products.push({ cent: i, count: 0, weight: 0 });

        container.innerHTML += `
        <div class="row">
            <span>${i} Cent</span>
            <input type="number" min="0" oninput="update(${i}, this.value, 'count')">
            <input type="number" min="0" oninput="update(${i}, this.value, 'weight')">
        </div>`;
    }
}

function update(cent, value, type) {
    let product = products.find(p => p.cent === cent);
    product[type] = parseInt(value) || 0;

    if (product.count === 0 && product.weight === 0) {
        alert(`${cent} cent stock is empty`);
    }

    calculateTotals();
}

function calculateTotals() {
    let totalP = 0, totalW = 0;

    products.forEach(p => {
        totalP += p.count;
        totalW += p.weight;
    });

    document.getElementById("totalProducts").innerText = totalP;
    document.getElementById("totalWeight").innerText = totalW;
}

function showBilling() {
    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("billing").classList.remove("hidden");

    document.getElementById("billProducts").innerText =
        document.getElementById("totalProducts").innerText;

    document.getElementById("billWeight").innerText =
        document.getElementById("totalWeight").innerText;
}

function goBack() {
    document.getElementById("billing").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
}
