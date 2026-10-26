// ========================================
// IMPORTS
// ========================================

// ========================================
// MAIN
// ========================================

export async function financialControl_Root() {
  // ========================================
  // CONTROLLER
  // ========================================

  const { initializeFinancialControl } =
    await import("./controller/financial-control_initialize.js");

  // ========================================
  // INITIALIZE
  // ========================================

  await initializeFinancialControl();
}
