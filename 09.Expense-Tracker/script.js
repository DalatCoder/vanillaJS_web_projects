const dom = (function () {
  const balance = document.getElementById('balance');
  const money_plus = document.getElementById('money-plus');
  const money_minus = document.getElementById('money-minus');
  const list = document.getElementById('list');
  const form = document.getElementById('form');
  const text = document.getElementById('text');
  const amount = document.getElementById('amount');
  const error_text = document.getElementById('error-text');
  const error_amount = document.getElementById('error-amount');

  return {
    balance,
    money_plus,
    money_minus,
    list,
    form,
    text,
    amount,
    error_text,
    error_amount,
  };
})();

// const examples = [
//   { id: 1, text: 'flowers', amount: '-50' },
//   { id: 2, text: 'salary', amount: '300' },
//   { id: 3, text: 'book', amount: '-50' },
//   { id: 4, text: 'camera', amount: '-50' },
// ];

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions = localStorageTransactions || [];

// Add transaction to collection
function addTransaction(event) {
  event.preventDefault();

  const text = dom.text.value;
  const amount = dom.amount.value;

  if (!text || !amount) {
    alert('Please add a text and amount!');
    return;
  }

  if (parseInt(amount) === 0) {
    alert('Please enter valid amount number!');
    dom.amount.value = '';
    return;
  }

  const transaction = {
    id: generateID(),
    text,
    amount: amount * 1,
  };

  transactions.push(transaction);

  // Clear inputs
  dom.text.value = '';
  dom.amount.value = '';

  // Add to DOM
  addTransactionDOM(transaction);

  // Update
  updateValues();
  updateLocalStorage();
}

// Generate random ID
function generateID() {
  return Date.now();
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  const { amount, text } = transaction;
  // Get sign
  const sign = amount < 0 ? '-' : '+';

  const item = document.createElement('li');
  item.classList.add(sign === '+' ? 'plus' : 'minus');
  item.innerHTML = `
    ${text} <span>${sign}${Math.abs(amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${
      transaction.id
    })">x</button>
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

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((e) => e.id !== id);

  updateLocalStorage();

  Init();
}

// Format number as money
function formatMoney(money) {
  return money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); // 12,345.67
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function Init() {
  dom.list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
}
Init();

// Event listeners
dom.form.addEventListener('submit', addTransaction);

dom.text.addEventListener('input', onTextInput);
dom.amount.addEventListener('change', onAmountChange);

// Handle events
function onTextInput(event) {
  const innerText = event.target.value.trim();
  const { error_text } = dom;

  if (innerText.length === 0) {
    error_text.innerText = 'Please add some description!';
    error_text.classList.add('show');
    return;
  }

  if (innerText.length > 30) {
    error_text.innerText = 'Description is too long!';
    error_text.classList.add('show');
    return;
  }

  if (error_text.classList.contains('show')) {
    error_text.classList.remove('show');
  }
}

function onAmountChange(event) {
  const amount = parseInt(event.target.value);
  const { error_amount } = dom;

  if (amount === 0) {
    error_amount.innerText = 'Invalid amount!';
    error_amount.classList.add('show');
    return;
  }

  if (error_amount.classList.contains('show')) {
    error_amount.classList.remove('show');
  }
}
