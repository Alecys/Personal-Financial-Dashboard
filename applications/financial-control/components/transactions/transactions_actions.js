// ========================================
// TRANSACTIONS ACTIONS
// ========================================

// ========================================
// MODULE
// ========================================

const { getFinancialControlData } = await import(
  globalThis.path.financialControl.data.js
);

const { openTransactionFormView } = await import(
  globalThis.path.financialControl.components.transactions.view
);

const {
  addTransaction: addTransactionLogic,
  updateTransaction,
  deleteTransaction: deleteTransactionLogic,
  sortTransactions: sortTransactionsLogic,
} = await import(
  globalThis.path.financialControl.components.transactions.logic
);

const { saveFinancialControlData } = await import(
  globalThis.path.financialControl.data.save
);

const { notifyFinancialControlLogic } = await import(
  globalThis.path.financialControl.notify.logic
);

const { notifyFinancialControlView } = await import(
  globalThis.path.financialControl.notify.view
);

// ========================================
// STATE
// ========================================

let transactionsSortAscending = true;

// ========================================
// DATE PICKER
// ========================================

export function openDatePicker(dateInput) {
  if (typeof dateInput.showPicker === "function") {
    dateInput.showPicker();
  }
}

// ========================================
// ADD TRANSACTION
// ========================================

export function addTransaction() {
  const list = document.querySelector("[data-transactions-list]");

  if (!list) {
    return;
  }

  const currentForm = list.querySelector("[data-transaction-form]");

  if (currentForm) {
    closeTransaction(currentForm);
  }

  const data = getFinancialControlData();

  openTransactionFormView(data);
}

// ========================================
// EDIT TRANSACTION
// ========================================

export function editTransaction(button) {
  const transaction = button.closest("[data-transaction-id]");

  if (!transaction) {
    return;
  }

  const list = document.querySelector("[data-transactions-list]");

  if (!list) {
    return;
  }

  const currentForm = list.querySelector("[data-transaction-form]");

  if (currentForm) {
    closeTransaction(currentForm);
  }

  clearTransactionEditState();

  transaction.classList.add("transaction-item-in-edit");

  const transactionId = transaction.dataset.transactionId;

  const data = getFinancialControlData();

  openTransactionFormView(data, transactionId);
}

// ========================================
// SAVE TRANSACTION
// ========================================

export async function saveTransaction(button) {
  const form = button.closest("[data-transaction-form]");

  if (!form) {
    return;
  }

  // ========================================
  // FORM DATA
  // ========================================

  const accountField = form.querySelector('[data-transaction-field="account"]');

  const selectedAccount = accountField.selectedOptions[0];

  const transactionData = {
    date: form.querySelector('[data-transaction-field="date"]').value,

    description: form.querySelector('[data-transaction-field="description"]')
      .value,

    group: form.querySelector('[data-transaction-field="group"]').value,

    account: selectedAccount?.dataset.accountId || "",

    type: selectedAccount?.dataset.transactionType || "",

    amount: Number(
      form.querySelector('[data-transaction-field="amount"]').value,
    ),

    recurrence: form.querySelector('[data-transaction-field="recurrence"]')
      .value,

    installments:
      Number(
        form.querySelector('[data-transaction-field="installments"]').value,
      ) || 0,
  };

  // ========================================
  // DATA
  // ========================================

  const data = getFinancialControlData();

  const transactionId = form.dataset.transactionId;

  // ========================================
  // LOGIC
  // ========================================

  if (transactionId) {
    updateTransaction(data, transactionId, transactionData);
  } else {
    addTransactionLogic(data, transactionData);
  }

  // ========================================
  // UPDATE
  // ========================================

  await notifyFinancialControlLogic(data);

  await notifyFinancialControlView(data);

  await saveFinancialControlData(data);
}

// ========================================
// DELETE TRANSACTION
// ========================================

export async function deleteTransaction(button) {
  const form = button.closest("[data-transaction-form]");

  if (!form) {
    return;
  }

  const transactionId = form.dataset.transactionId;

  if (!transactionId) {
    return;
  }

  const data = getFinancialControlData();

  deleteTransactionLogic(data, transactionId);

  await notifyFinancialControlLogic(data);

  await notifyFinancialControlView(data);

  await saveFinancialControlData(data);
}

// ========================================
// SORT TRANSACTIONS
// ========================================

export async function sortTransactions() {
  const data = getFinancialControlData();

  transactionsSortAscending = !transactionsSortAscending;

  sortTransactionsLogic(data, transactionsSortAscending);

  await notifyFinancialControlView(data);

  await saveFinancialControlData(data);
}

// ========================================
// CLOSE TRANSACTION
// ========================================

export function closeTransaction(form) {
  form.remove();

  clearTransactionEditState();
}

// ========================================
// CLEAR EDIT STATE
// ========================================

function clearTransactionEditState() {
  document.querySelectorAll(".transaction-item-in-edit").forEach((item) => {
    item.classList.remove("transaction-item-in-edit");
  });
}
