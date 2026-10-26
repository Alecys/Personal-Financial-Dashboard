// ========================================
// HEADER ACTIONS
// ========================================

// ========================================
// MODULE
// ========================================

const { navigateToMonth } = await import(
  globalThis.path.financialControl.controller.period.js
);

// ========================================
// NAVIGATION
// ========================================

export async function navigateHeader(targetMonth) {
  const result = await navigateToMonth(targetMonth);

  if (result.status === "unavailable") {
    return;
  }
}
