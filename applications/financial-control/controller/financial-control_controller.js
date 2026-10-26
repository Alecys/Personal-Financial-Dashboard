// ========================================
// IMPORTS
// ========================================

// ========================================
// MAIN
// ========================================

export async function initializeFinancialControlController() {
  // ========================================
  // BASE
  // ========================================

  const { initializeFinancialControlBase } = await import(
    globalThis.path.financialControl.base.js
  );

  await initializeFinancialControlBase();

  // ========================================
  // COMPONENTS
  // ========================================

  // ========================================
  // HEADER
  // ========================================

  const { initializeHeader } = await import(
    globalThis.path.financialControl.components.header.js
  );

  await initializeHeader();

  // ========================================
  // BALANCE
  // ========================================

  const { initializeBalance } = await import(
    globalThis.path.financialControl.components.balance.js
  );

  await initializeBalance();

  // ========================================
  // ACCOUNT
  // ========================================

  const { initializeAccount } = await import(
    globalThis.path.financialControl.components.account.js
  );

  await initializeAccount();

  // ========================================
  // CREDIT
  // ========================================

  const { initializeCredit } = await import(
    globalThis.path.financialControl.components.credit.js
  );

  await initializeCredit();

  // ========================================
  // TRANSACTIONS
  // ========================================

  const { initializeTransactions } = await import(
    globalThis.path.financialControl.components.transactions.js
  );

  await initializeTransactions();

  // Components will be mounted into
  // their Financial Control slots here.
}
