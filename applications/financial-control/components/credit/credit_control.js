// ========================================
// CREDIT CONTROL
// ========================================

// ========================================
// IMPORTS
// ========================================

const { getFinancialControlData } = await import(
  globalThis.path.financialControl.data.js
);

const { initializeCreditActions } = await import(
  globalThis.path.financialControl.components.credit.actions
);

const { initializeCreditLogic, updateCreditLogic } = await import(
  globalThis.path.financialControl.components.credit.logic
);

const { initializeCreditView } = await import(
  globalThis.path.financialControl.components.credit.view
);

const { initializeFlip } = await import(
  globalThis.path.financialControl.components.credit.flip.js
);

const { initializeStackedCard } = await import(
  globalThis.path.financialControl.components.credit.stackedCard.js
);

const { initializeCreditEvents } = await import(
  globalThis.path.financialControl.components.credit.events
);

const { registerFinancialControlLogic } = await import(
  globalThis.path.financialControl.notify.logic
);

const { registerFinancialControlView } = await import(
  globalThis.path.financialControl.notify.view
);

// ========================================
// INITIALIZE
// ========================================

export async function initializeCreditControl() {
  // ========================================
  // REGISTER LOGIC
  // ========================================

  registerFinancialControlLogic(updateCreditLogic, 20);

  // ========================================
  // REGISTER VIEW
  // ========================================

  registerFinancialControlView(updateCreditView);

  // ========================================
  // ACTIONS
  // ========================================

  await initializeCreditActions();

  // ========================================
  // LOGIC
  // ========================================

  await initializeCreditLogic();

  // ========================================
  // FLIP
  // ========================================

  await initializeFlip();

  // ========================================
  // INITIAL DATA
  // ========================================

  const data = getFinancialControlData();

  // ========================================
  // INITIAL LOGIC
  // ========================================

  updateCreditLogic(data);

  // ========================================
  // INITIAL VIEW
  // ========================================

  await initializeCreditView(data);

  // ========================================
  // STACKED CARD
  // ========================================

  await initializeStackedCard();

  // ========================================
  // EVENTS
  // ========================================

  await initializeCreditEvents();
}

// ========================================
// UPDATE VIEW
// ========================================

async function updateCreditView(data) {
  await initializeCreditView(data);

  await initializeStackedCard();
}
