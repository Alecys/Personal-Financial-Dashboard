// ========================================
// ACCOUNT
// ========================================

const { initializeAccountControl } = await import(
  globalThis.path.financialControl.components.account.control
);

// ========================================
// INITIALIZE
// ========================================

export async function initializeAccount() {
  const stylesheetAccount = document.createElement("link");

  stylesheetAccount.rel = "stylesheet";
  stylesheetAccount.href =
    globalThis.path.financialControl.components.account.css;

  document.head.appendChild(stylesheetAccount);

  await initializeAccountControl();
}
