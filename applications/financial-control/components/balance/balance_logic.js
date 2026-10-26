// ========================================
// BALANCE LOGIC
// ========================================

export async function getBalanceData(data) {
  const { formatCurrency, formatPercentage } = await import(
    globalThis.path.financialControl.shared.formatters
  );

  // ========================================
  // CURRENT MONTH
  // ========================================

  const currentMonth = data.months[data.currentMonth];

  // ========================================
  // ACCOUNTS
  // ========================================

  const accounts = Object.values(currentMonth.accounts);

  // ========================================
  // INITIAL BALANCE
  // ========================================

  const initialBalance = accounts.reduce(
    (total, account) => total + account.initialBalance,
    0,
  );

  // ========================================
  // ACTUAL BALANCE
  // ========================================

  const actualBalance = accounts.reduce(
    (total, account) => total + account.actualBalance,
    0,
  );

  // ========================================
  // CHANGE
  // ========================================

  let change = null;

  if (initialBalance !== 0) {
    change =
      ((actualBalance - initialBalance) / Math.abs(initialBalance)) * 100;
  }

  // ========================================
  // CHANGE CLASS
  // ========================================

  let changeClass = "";

  if (change >= 0) {
    changeClass = "positive";
  }

  if (change < 0) {
    changeClass = "negative";
  }

  // ========================================
  // RETURN
  // ========================================

  return {
    initialBalance,

    actualBalance,

    change,

    changeClass,

    formattedBalance: formatCurrency(actualBalance),

    formattedChange: formatPercentage(change),
  };
}
