// ========================================
// ACCOUNT CONTROL
// ========================================

// ========================================
// MODULE
// ========================================

const { getFinancialControlData } = await import(
  globalThis.path.financialControl.data.js
);

const { initializeAccountView } = await import(
  globalThis.path.financialControl.components.account.view
);

const { updateAccountBalances } = await import(
  globalThis.path.financialControl.components.account.logic
);

const { renderAccount } = await import(
  globalThis.path.financialControl.components.account.render
);

const { registerFinancialControlLogic } = await import(
  globalThis.path.financialControl.notify.logic
);

const { registerFinancialControlView } = await import(
  globalThis.path.financialControl.notify.view
);

const { initializeAccountEvents } = await import(
  globalThis.path.financialControl.components.account.events
);

// ========================================
// INITIALIZE
// ========================================

export async function initializeAccountControl() {
  // ========================================
  // REGISTER LOGIC
  // ========================================

  registerFinancialControlLogic(updateAccountBalances, 10);

  // ========================================
  // REGISTER VIEW
  // ========================================

  registerFinancialControlView(updateAccountView);

  // ========================================
  // INITIAL DATA
  // ========================================

  const data = getFinancialControlData();

  // ========================================
  // INITIAL LOGIC
  // ========================================

  updateAccountBalances(data);

  // ========================================
  // INITIAL VIEW
  // ========================================

  initializeAccountView(data, renderAccount);

  // ========================================
  // EVENTS
  // ========================================

  initializeAccountEvents();
}

// ========================================
// UPDATE VIEW
// ========================================

async function updateAccountView(data) {
  // ========================================
  // VIEW
  // ========================================

  renderAccount(data, null, "normal");
}
