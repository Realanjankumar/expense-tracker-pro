const form = document.getElementById("expense-form");
const list = document.getElementById("expense-list");
const totalEl = document.getElementById("total");
const monthlyEl = document.getElementById("monthlyTotal");
const filter = document.getElementById("filter");
const themeBtn = document.getElementById("themeToggle");
const ctx = document.getElementById("chart").getContext("2d");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let dark = false;

updateUI();

form.addEventListener("submit", e => {
  e.preventDefault();

  expenses.push({
    id: Date.now(),
    title: title.value,
    amount: +amount.value,
    category: category.value,
    date: date.value
  });

  localStorage.setItem("expenses", JSON.stringify(expenses));
  form.reset();
  updateUI();
});

filter.addEventListener("change", updateUI);

themeBtn.onclick = () => {
  dark = !dark;
  document.body.classList.toggle("dark");
};

function updateUI() {
  list.innerHTML = "";
  let total = 0;
  let monthly = 0;
  let chartData = {};

  expenses
    .filter(e => filter.value === "All" || e.category === filter.value)
    .forEach(e => {
      total += e.amount;

      if (e.date.startsWith(new Date().toISOString().slice(0,7))) {
        monthly += e.amount;
      }

      chartData[e.category] = (chartData[e.category] || 0) + e.amount;

      list.innerHTML += `
        <tr>
          <td>${e.title}</td>
          <td>₹${e.amount}</td>
          <td>${e.category}</td>
          <td>${e.date}</td>
          <td><button onclick="del(${e.id})">X</button></td>
        </tr>`;
    });

  totalEl.textContent = total;
  monthlyEl.textContent = monthly;
  drawChart(chartData);
}

function del(id) {
  expenses = expenses.filter(e => e.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  updateUI();
}

function drawChart(data) {
  ctx.clearRect(0, 0, 600, 250);
  let x = 50;

  Object.keys(data).forEach(cat => {
    let h = data[cat] / 5;
    ctx.fillStyle = "#4f46e5";
    ctx.fillRect(x, 230 - h, 50, h);
    ctx.fillText(cat, x, 245);
    x += 80;
  });
}




