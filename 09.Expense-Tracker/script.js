const dom = (function () {
  const balance = document.getElementById('balance');
  const money_plus = document.getElementById('money-plus');
  const money_minus = document.getElementById('money-minus');
  const list = document.getElementById('list');
  const form = document.getElementById('form');
  const text = document.getElementById('text');
  const amount = document.getElementById('amount');

  return {
    balance,
    money_plus,
    money_minus,
    list,
    form,
    text,
    amount,
  };
})();

const examples = [
  { id: 1, text: 'flowers', amount: '-50' },
  { id: 2, text: 'salary', amount: '300' },
  { id: 3, text: 'book', amount: '-50' },
  { id: 4, text: 'camera', amount: '-50' },
];

let transactions = examples;

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  const { amount, text } = transaction;
  // Get sign
  const sign = amount < 0 ? '-' : '+';

  const item = document.createElement('li');
  item.classList.add(sign === '+' ? 'plus' : 'minus');
  item.innerHTML = `
    ${text} <span>${sign}${Math.abs(amount)}</span>
    <button class="delete-btn">x</button>
  `;

  dom.list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map((e) => parseFloat(e.amount));
  const balance = amounts.reduce((total, cur) => (total += cur), 0);
  const totalIncome = amounts
    .filter((num) => num > 0)
    .reduce((total, cur) => (total += cur), 0);
  const totalExpense = amounts
    .filter((num) => num < 0)
    .reduce((total, cur) => (total += cur), 0);

  dom.balance.innerText = '$' + formatMoney(balance);
  dom.money_plus.innerText = '+$' + formatMoney(totalIncome);
  dom.money_minus.innerText = '-$' + formatMoney(Math.abs(totalExpense));
}

// Format number as money
function formatMoney(money) {
  return money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); // 12,345.67
}

// Init app
(function Init() {
  dom.list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
})();
