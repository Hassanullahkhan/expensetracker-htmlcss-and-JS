const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");
const incomeSelectBtn = document.getElementById("income-btn");
const expenseSelectBtn = document.getElementById("expense-btn");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let transactionType = "income";

// button functionality

incomeSelectBtn.addEventListener("click", () => {
  transactionType = "income";
  incomeSelectBtn.classList.add("active");
  expenseSelectBtn.classList.remove("active");
});

expenseSelectBtn.addEventListener("click", () => {
  transactionType = "expense";
  expenseSelectBtn.classList.add("active");
  incomeSelectBtn.classList.remove("active");
});

transactionFormEl.addEventListener("submit", addTransaction);

function addTransaction(event) {
  event.preventDefault();

  // get the form values

  const description = descriptionEl.value.trim();
  let amount = parseFloat(amountEl.value); // will change into number

  // validate that amount is positive
  if (!description || !amount || amount <= 0) {
    return;
  }

  // make amount negative for expenses

  if (transactionType === "expense") {
    amount = -Math.abs(amount);
  } else {
    amount = Math.abs(amount);
  }

  transactions.push({
    id: Date.now(),
    description,
    amount,
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionsList();
  updateSummary();

  transactionFormEl.reset();

  // Reset to income by default
  transactionType = "income";
  incomeSelectBtn.classList.add("active");
  expenseSelectBtn.classList.remove("active");
}

function updateTransactionsList() {
  transactionListEl.innerHTML = "";

  const sortedTransactions = [...transactions].reverse();
  sortedTransactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction);
    transactionListEl.appendChild(transactionEl);
  });
}

function createTransactionElement(transaction) {
  const li = document.createElement("li");
  li.classList.add("transaction");
  li.classList.add(transaction.amount > 0 ? "#059669" : "#dc2626");

  // todo: update the amount formatting
  li.innerHTML = `
 <span>${transaction.description}</span>
 <span>${formatCurrency(transaction.amount)}
 <button class="delete-btn" onclick="removeTransaction(${
   transaction.id
 })">X</button>
 </span>
 `;

  return li;
}

function updateSummary() {
  const balance = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  //update ui =>todo: fix the formatting

  balanceEl.textContent = formatCurrency(balance);
  incomeAmountEl.textContent = formatCurrency(income);
  expenseAmountEl.textContent = formatCurrency(expenses);
}

function formatCurrency(number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
  }).format(number);
}

function removeTransaction(id) {
  //filter the one we want to delete

  transactions = transactions.filter((transaction) => transaction.id !== id);

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionsList();
  updateSummary();
}

// initial render

updateTransactionsList();
updateSummary();
