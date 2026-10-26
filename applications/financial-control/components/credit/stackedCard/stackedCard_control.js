// ========================================
// STACKED CARD CONTROL
// ========================================

// ========================================
// IMPORTS
// ========================================

const { initializeStackedCardLogic } = await import(
  globalThis.path.financialControl.components.credit.stackedCard.logic
);

const { initializeStackedCardEvents } = await import(
  globalThis.path.financialControl.components.credit.stackedCard.events
);

// ========================================
// INITIALIZE
// ========================================

export async function initializeStackedCardControl() {
  await initializeStackedCardLogic();

  await initializeStackedCardEvents();
}
