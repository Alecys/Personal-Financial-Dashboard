// ========================================
// BALANCE VIEW
// ========================================

// ========================================
// MODULE
// ========================================

let renderBalance;

// ========================================
// INITIALIZE
// ========================================

export async function initializeBalanceView(
  data,
  getBalanceData,
  updateBalanceView,
) {
  ({ renderBalance } = await import(
    globalThis.path.financialControl.components.balance.render
  ));

  await updateBalanceView(data, getBalanceData);
}

// ========================================
// UPDATE
// ========================================

export async function updateBalanceView(data, getBalanceData) {
  const balanceData = await getBalanceData(data);

  renderBalance(balanceData);
}
