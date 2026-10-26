// ========================================
// TRANSACTIONS
// ========================================

const { initializeTransactionsControl } = await import(
  globalThis.path.financialControl.components.transactions.control
);

// ========================================
// INITIALIZE
// ========================================

export async function initializeTransactions() {
  const stylesheetTransactions = document.createElement("link");

  stylesheetTransactions.rel = "stylesheet";

  stylesheetTransactions.href =
    globalThis.path.financialControl.components.transactions.css;

  document.head.appendChild(stylesheetTransactions);

  await initializeTransactionsControl();
}
