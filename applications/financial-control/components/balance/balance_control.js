// ========================================
// BALANCE CONTROL
// ========================================

// ========================================
// MODULE
// ========================================

const { getFinancialControlData } = await import(
  globalThis.path.financialControl.data.js
);

const { getBalanceData } = await import(
  globalThis.path.financialControl.components.balance.logic
);

const { initializeBalanceView, updateBalanceView } = await import(
  globalThis.path.financialControl.components.balance.view
);

const { registerFinancialControlView } = await import(
  globalThis.path.financialControl.notify.view
);

// ========================================
// INITIALIZE
// ========================================

export async function initializeBalanceControl() {
  // ========================================
  // REGISTER VIEW
  // ========================================

  registerFinancialControlView(updateBalance);

  // ========================================
  // INITIAL DATA
  // ========================================

  const data = getFinancialControlData();

  // ========================================
  // INITIAL VIEW
  // ========================================

  initializeBalanceView(data, getBalanceData, updateBalanceView);
}

// ========================================
// UPDATE
// ========================================

async function updateBalance(data) {
  await updateBalanceView(data, getBalanceData);
}
