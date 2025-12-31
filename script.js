let products = [];

function login() {
    document.getElementById("auth").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    loadProducts();
}

function loadProducts() {
    const container = document.getElementById("products");
    container.innerHTML = "";
    products = [];

    for (let i = 1; i <= 20; i++) {
        products.push({ cent: i, count: 0, weight: 0 });

        container.innerHTML += `
        <div class="product">
            <strong>${i} Cent</strong>

            <input type="number" min="0"
                id="count-${i}"
                value="0"
                oninput="updateRow(${i})">

            <input type="number" min="0"
                id="weight-${i}"
                value="0"
                oninput="updateRow(${i})">
        </div>`;
    }
}

function updateRow(cent) {
    let count = parseInt(document.getElementById(`count-${cent}`).value) || 0;
    let weight = parseInt(document.getElementById(`weight-${cent}`).value) || 0;

    let product = products.find(p => p.cent === cent);
    product.count = count;
    product.weight = weight;

    if (count === 0 && weight === 0) {
        alert(`Notification: ${cent} cent entry is empty!`);
    }

    updateTotals();
}

function updateTotals() {
    let totalProducts = 0;
    let totalWeight = 0;

    products.forEach(p => {
        totalProducts += p.count;
        totalWeight += p.weight;
    });

    document.getElementById("totalProducts").innerText = totalProducts;
    document.getElementById("totalWeight").innerText = totalWeight;
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
