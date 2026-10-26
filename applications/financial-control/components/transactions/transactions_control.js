// ========================================
// TRANSACTIONS CONTROL
// ========================================

// ========================================
// MODULE
// ========================================

const { getFinancialControlData } = await import(
  globalThis.path.financialControl.data.js
);

const { updateTransactionsView } = await import(
  globalThis.path.financialControl.components.transactions.view
);

const { registerFinancialControlView } = await import(
  globalThis.path.financialControl.notify.view
);

const { initializeTransactionsEvents } = await import(
  globalThis.path.financialControl.components.transactions.events
);

// ========================================
// INITIALIZE
// ========================================

export async function initializeTransactionsControl() {
  // ========================================
  // REGISTER VIEW
  // ========================================

  registerFinancialControlView(updateTransactionsView);

  // ========================================
  // INITIAL DATA
  // ========================================

  const data = getFinancialControlData();

  // ========================================
  // INITIAL VIEW
  // ========================================

  await updateTransactionsView(data);

  // ========================================
  // EVENTS
  // ========================================

  initializeTransactionsEvents();
}
