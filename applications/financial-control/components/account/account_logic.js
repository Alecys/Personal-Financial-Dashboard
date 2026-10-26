// ========================================
// ACCOUNT LOGIC
// ========================================

const { addMoney, subtractMoney } = await import(
  globalThis.path.financialControl.shared.formatters
);

// ========================================
// UPDATE ACCOUNT BALANCES
// ========================================

export function updateAccountBalances(data) {
  const currentMonth = data.currentMonth;

  const month = data.months[currentMonth];

  if (!month) {
    return;
  }

  const accounts = month.accounts;

  const transactions = month.transactions ?? [];

  const transfers = month.transfers ?? [];

  // ========================================
  // ACCOUNTS
  // ========================================

  for (const [accountId, account] of Object.entries(accounts)) {
    let actualBalance = Number(account.initialBalance) || 0;

    // ========================================
    // TRANSACTIONS
    // ========================================

    for (const transaction of transactions) {
      if (transaction.type !== "debit") {
        continue;
      }

      if (transaction.account !== accountId) {
        continue;
      }

      actualBalance = addMoney(actualBalance, Number(transaction.amount) || 0);
    }

    // ========================================
    // TRANSFERS
    // ========================================

    for (const transfer of transfers) {
      const amount = Number(transfer.amount) || 0;

      if (transfer.from === accountId) {
        actualBalance = subtractMoney(actualBalance, amount);
      }

      if (transfer.to === accountId) {
        actualBalance = addMoney(actualBalance, amount);
      }
    }

    account.actualBalance = actualBalance;
  }
}

// ========================================
// UPDATE ACCOUNT
// ========================================

export function updateAccount(data, accountId, name, initialBalance) {
  const currentMonth = data.currentMonth;

  const accounts = data.months[currentMonth].accounts;

  const account = accounts[accountId];

  if (!account) {
    return;
  }

  account.name = name;

  account.initialBalance = initialBalance;
}

// ========================================
// CREATE TRANSFER
// ========================================

export function createTransfer(data, accountId, destinationAccountId, amount) {
  const currentMonth = data.currentMonth;

  const month = data.months[currentMonth];

  if (!month) {
    return;
  }

  if (
    !accountId ||
    !destinationAccountId ||
    accountId === destinationAccountId
  ) {
    return;
  }

  if (!amount || amount <= 0) {
    return;
  }

  // ========================================
  // TRANSFERS
  // ========================================

  if (!Array.isArray(month.transfers)) {
    month.transfers = [];
  }

  // ========================================
  // ID
  // ========================================

  const transferId = createTransferId(month.transfers);

  // ========================================
  // TRANSFER
  // ========================================

  month.transfers.push({
    id: transferId,
    date: new Date().toISOString().slice(0, 10),
    from: accountId,
    to: destinationAccountId,
    amount,
  });
}

// ========================================
// TRANSFER ID
// ========================================

function createTransferId(transfers) {
  if (transfers.length === 0) {
    return "1";
  }

  const ids = transfers
    .map((transfer) => Number(transfer.id))
    .filter((id) => Number.isFinite(id));

  if (ids.length === 0) {
    return "1";
  }

  return String(Math.max(...ids) + 1);
}
