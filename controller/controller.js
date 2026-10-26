// ========================================
// IMPORTS
// ========================================

// ========================================
// MAIN
// ========================================

export async function initializeController() {
  // ========================================
  // IMPORTS
  // ========================================

  const { initializeBase } = await import(globalThis.path.base.js);

  const { financialControl_Root } = await import(
    globalThis.path.applications.financialControl.js
  );

  // ========================================
  // INITIALIZE
  // ========================================

  await initializeBase();

  await financialControl_Root();
}
