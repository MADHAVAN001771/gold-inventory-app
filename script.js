const rowsDiv = document.getElementById("rows");
const CENTS = Array.from({ length: 20 }, (_, i) => i + 1);
const today = new Date().toISOString().split("T")[0];

// Load stock & sold from localStorage
let stock = JSON.parse(localStorage.getItem("stock")) || {};
let soldHistory = JSON.parse(localStorage.getItem("sold-history")) || {};
soldHistory[today] ??= {};

// Totals elements
const totalOpenNoEl = document.getElementById("total-open-no");
const totalOpenWtEl = document.getElementById("total-open-wt");
const totalSoldNoEl = document.getElementById("total-sold-no");
const totalSoldWtEl = document.getElementById("total-sold-wt");
const totalRemainNoEl = document.getElementById("total-remain-no");
const totalRemainWtEl = document.getElementById("total-remain-wt");

// Create table rows for 20 cents
CENTS.forEach(cent => {
  stock[cent] ??= { products: 0, weight: 0 };
  
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
    <div>${cent} Cent</div>
    <div class="small-box">
      <input type="number" id="open-no-${cent}" value="${stock[cent].products}">
      <input type="number" id="open-wt-${cent}" value="${stock[cent].weight}">
    </div>
    <div class="small-box">
      <input type="number" id="sold-no-${cent}" value="${soldHistory[today][cent]?.products || 0}">
      <input type="number" id="sold-wt-${cent}" value="${soldHistory[today][cent]?.weight || 0}">
    </div>
    <div class="small-box">
      <input type="number" id="remain-no-${cent}" readonly>
      <input type="number" id="remain-wt-${cent}" readonly>
    </div>
  `;
  rowsDiv.appendChild(row);

  const openNo = document.getElementById(`open-no-${cent}`);
  const openWt = document.getElementById(`open-wt-${cent}`);
  const soldNo = document.getElementById(`sold-no-${cent}`);
  const soldWt = document.getElementById(`sold-wt-${cent}`);

  // Add auto-number and reactive update for each input
  [openNo, openWt].forEach(el => el.addEventListener("input", () => validateAndSave(cent, el, "open")));
  [soldNo, soldWt].forEach(el => el.addEventListener("input", () => validateAndSave(cent, el, "sold")));

  updateRemaining(cent);
});

// Validate input, auto set 0 if empty or invalid
function validateAndSave(cent, el, type) {
  let val = Number(el.value);
  if (isNaN(val) || val < 0) val = 0;
  el.value = val;

  if (type === "open") saveOpening(cent);
  else updateSold(cent);
}

function saveOpening(cent) {
  stock[cent] = {
    products: Number(document.getElementById(`open-no-${cent}`).value),
    weight: Number(document.getElementById(`open-wt-${cent}`).value)
  };
  localStorage.setItem("stock", JSON.stringify(stock));
  updateRemaining(cent);
}

function updateSold(cent) {
  soldHistory[today][cent] = {
    products: Number(document.getElementById(`sold-no-${cent}`).value),
    weight: Number(document.getElementById(`sold-wt-${cent}`).value)
  };
  localStorage.setItem("sold-history", JSON.stringify(soldHistory));
  updateRemaining(cent);
}

function updateRemaining(cent) {
  const opening = stock[cent];
  const sold = soldHistory[today][cent] || { products: 0, weight: 0 };
  const remainNo = Math.max(opening.products - sold.products, 0);
  const remainWt = Math.max(opening.weight - sold.weight, 0);

  document.getElementById(`remain-no-${cent}`).value = remainNo;
  document.getElementById(`remain-wt-${cent}`).value = remainWt;

  updateTotals();
}

function updateTotals() {
  let totalOpenNo=0, totalOpenWt=0, totalSoldNo=0, totalSoldWt=0, totalRemainNo=0, totalRemainWt=0;
  CENTS.forEach(cent=>{
    const opening = stock[cent];
    const sold = soldHistory[today][cent] || { products:0, weight:0 };
    const remainNo = Math.max(opening.products - sold.products,0);
    const remainWt = Math.max(opening.weight - sold.weight,0);

    totalOpenNo += opening.products; totalOpenWt += opening.weight;
    totalSoldNo += sold.products; totalSoldWt += sold.weight;
    totalRemainNo += remainNo; totalRemainWt += remainWt;
  });

  totalOpenNoEl.textContent = totalOpenNo;
  totalOpenWtEl.textContent = totalOpenWt;
  totalSoldNoEl.textContent = totalSoldNo;
  totalSoldWtEl.textContent = totalSoldWt;
  totalRemainNoEl.textContent = totalRemainNo;
  totalRemainWtEl.textContent = totalRemainWt;
}

// Initialize totals on page load
updateTotals();
