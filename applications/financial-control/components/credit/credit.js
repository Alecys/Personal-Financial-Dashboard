// ========================================
// CREDIT
// ========================================

const { initializeCreditControl } = await import(
  globalThis.path.financialControl.components.credit.control
);

// ========================================
// INITIALIZE
// ========================================

export async function initializeCredit() {
  const stylesheetCredit = document.createElement("link");

  stylesheetCredit.rel = "stylesheet";

  stylesheetCredit.href =
    globalThis.path.financialControl.components.credit.css;

  document.head.appendChild(stylesheetCredit);

  await initializeCreditControl();
}
