// ========================================
// BALANCE
// ========================================

const { initializeBalanceControl } = await import(
  globalThis.path.financialControl.components.balance.control
);

// ========================================
// INITIALIZE
// ========================================

export async function initializeBalance() {
  // ========================================
  // STYLES
  // ========================================

  const stylesheetBalance = document.createElement("link");

  stylesheetBalance.rel = "stylesheet";

  stylesheetBalance.href =
    globalThis.path.financialControl.components.balance.css;

  document.head.appendChild(stylesheetBalance);

  // ========================================
  // CONTROL
  // ========================================

  await initializeBalanceControl();
}
