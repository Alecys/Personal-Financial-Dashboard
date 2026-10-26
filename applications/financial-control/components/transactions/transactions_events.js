// ========================================
// TRANSACTIONS EVENTS
// ========================================

// ========================================
// MODULE
// ========================================

const {
  addTransaction,
  editTransaction,
  saveTransaction,
  deleteTransaction,
  sortTransactions,
  openDatePicker,
  closeTransaction,
} = await import(
  globalThis.path.financialControl.components.transactions.actions
);

// ========================================
// INITIALIZE
// ========================================

export function initializeTransactionsEvents() {
  document.addEventListener("pointerdown", handleClick);
}

// ========================================
// CLICK
// ========================================

function handleClick(event) {
  // ========================================
  // DATE
  // ========================================

  const dateInput = event.target.closest('[data-transaction-field="date"]');

  if (dateInput) {
    openDatePicker(dateInput);

    return;
  }

  // ========================================
  // ACTION
  // ========================================

  const button = event.target.closest("[data-transaction-action]");

  if (button) {
    const action = button.dataset.transactionAction;

    // ========================================
    // ADD
    // ========================================

    if (action === "add") {
      addTransaction();

      return;
    }

    // ========================================
    // EDIT
    // ========================================

    if (action === "edit") {
      editTransaction(button);

      return;
    }

    // ========================================
    // SAVE
    // ========================================

    if (action === "save") {
      saveTransaction(button);

      return;
    }

    // ========================================
    // DELETE
    // ========================================

    if (action === "delete") {
      deleteTransaction(button);

      return;
    }

    // ========================================
    // SORT
    // ========================================

    if (action === "short") {
      sortTransactions();

      return;
    }
  }

  // ========================================
  // OUTSIDE
  // ========================================

  const form = document.querySelector("[data-transaction-form]");

  if (!form) {
    return;
  }

  if (form.contains(event.target)) {
    return;
  }

  closeTransaction(form);
}
