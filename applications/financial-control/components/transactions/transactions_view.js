// ========================================
// TRANSACTIONS VIEW
// ========================================

const { renderTransactions, renderTransactionForm } = await import(
  globalThis.path.financialControl.components.transactions.render
);

// ========================================
// UPDATE
// ========================================

export async function updateTransactionsView(data) {
  const container = document.querySelector('[data-slot="transactions"]');

  if (!container) {
    return;
  }

  renderTransactions(container, data);
}

// ========================================
// OPEN TRANSACTION FORM
// ========================================

export function openTransactionFormView(data, transactionId = null) {
  const list = document.querySelector("[data-transactions-list]");

  if (!list) return;

  const formHTML = renderTransactionForm(data, transactionId);

  // ----------------------------------------
  // NEW TRANSACTION
  // ----------------------------------------

  if (!transactionId) {
    list.insertAdjacentHTML("afterbegin", formHTML);

    return;
  }

  // ----------------------------------------
  // EDIT TRANSACTION
  // ----------------------------------------

  const transaction = list.querySelector(
    `[data-transaction-id="${transactionId}"]`,
  );

  if (!transaction) return;

  transaction.insertAdjacentHTML("afterend", formHTML);
}
