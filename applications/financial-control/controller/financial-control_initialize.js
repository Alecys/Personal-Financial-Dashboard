// ========================================

// IMPORTS

// ========================================

// ========================================

// MAIN

// ========================================

export async function initializeFinancialControl() {
  // ========================================
  // PATHS
  // ========================================

  const { paths } = await import("../path/financial-control_path.js");

  globalThis.path.financialControl = paths;

  // ========================================
  // DATA
  // ========================================

  const { initializeFinancialControlData } = await import(
    globalThis.path.financialControl.data.js
  );

  await initializeFinancialControlData();

  // ========================================
  // NOTIFY LOGIC
  // ========================================

  await import(globalThis.path.financialControl.notify.logic);

  // ========================================
  // NOTIFY VIEW
  // ========================================

  await import(globalThis.path.financialControl.notify.view);

  // ========================================
  // CONTROLLER
  // ========================================

  const { initializeFinancialControlController } = await import(
    globalThis.path.financialControl.controller.js
  );

  await initializeFinancialControlController();
}
