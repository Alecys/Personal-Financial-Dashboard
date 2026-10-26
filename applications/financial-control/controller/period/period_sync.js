// ========================================
// PERIOD SYNC
// ========================================

export async function synchronizeFutureMonth(data, targetMonth, previousMonth) {
  const previousData = data.months[previousMonth];

  // ========================================
  // CREATE MONTH
  // ========================================

  if (!data.months[targetMonth]) {
    data.months[targetMonth] = {
      name: "",
      year: 0,
      accounts: {},
      credit: {},
      transactions: [],
      transfers: [],
    };
  }

  const targetData = data.months[targetMonth];

  // ========================================
  // MONTH INFORMATION
  // ========================================

  const [year, month] = targetMonth.split("-").map(Number);

  const date = new Date(year, month - 1, 1);

  targetData.name = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(date);

  targetData.year = year;

  // ========================================
  // ACCOUNTS
  // ========================================

  synchronizeAccounts(previousData, targetData);

  // ========================================
  // CREDIT
  // ========================================

  synchronizeCredit(previousData, targetData);

  // ========================================
  // TRANSACTIONS
  // ========================================

  synchronizeTransactions(previousData, targetData);
}

// ========================================
// ACCOUNTS
// ========================================

function synchronizeAccounts(previousData, targetData) {
  if (!targetData.accounts) {
    targetData.accounts = {};
  }

  for (const [accountId, previousAccount] of Object.entries(
    previousData.accounts,
  )) {
    // ========================================
    // FIND ACCOUNT
    // ========================================

    let targetAccount = targetData.accounts[accountId];

    // ========================================
    // FIND BY NAME
    // ========================================

    if (!targetAccount) {
      const existingEntry = Object.entries(targetData.accounts).find(
        ([, account]) => account.name === previousAccount.name,
      );

      if (existingEntry) {
        targetAccount = existingEntry[1];
      }
    }

    // ========================================
    // NEW ACCOUNT
    // ========================================

    if (!targetAccount) {
      targetData.accounts[accountId] = {
        ...previousAccount,
        initialBalance: previousAccount.actualBalance,
      };

      continue;
    }

    // ========================================
    // EXISTING ACCOUNT
    // ========================================

    targetAccount.name = previousAccount.name;

    targetAccount.type = previousAccount.type;

    targetAccount.initialBalance = previousAccount.actualBalance;
  }
}

// ========================================
// CREDIT
// ========================================

function synchronizeCredit(previousData, targetData) {
  if (!targetData.credit) {
    targetData.credit = {};
  }

  for (const [creditId, previousCredit] of Object.entries(
    previousData.credit || {},
  )) {
    const targetCredit = targetData.credit[creditId];

    // ========================================
    // NEW CREDIT
    // ========================================

    if (!targetCredit) {
      const initialBalance = Number(previousCredit.nextInvoice || 0);

      targetData.credit[creditId] = {
        ...previousCredit,
        initialBalance,
        openInvoice: initialBalance,
        nextInvoice: 0,
        invoiceStatus: "unpaid",
      };

      continue;
    }

    // ========================================
    // EXISTING CREDIT
    // ========================================

    targetCredit.name = previousCredit.name;
    targetCredit.color = previousCredit.color;
    targetCredit.lastFour = previousCredit.lastFour;
    targetCredit.limit = previousCredit.limit;
    targetCredit.closingDay = previousCredit.closingDay;
    targetCredit.dueDay = previousCredit.dueDay;
  }
}

// ========================================
// TRANSACTIONS
// ========================================

function synchronizeTransactions(previousData, targetData) {
  if (!targetData.transactions) {
    targetData.transactions = [];
  }

  for (const transaction of previousData.transactions || []) {
    // ========================================
    // ONCE
    // ========================================

    if (transaction.recurrence === "once") {
      continue;
    }

    // ========================================
    // FIXED
    // ========================================

    if (transaction.recurrence === "fixed") {
      synchronizeTransaction(transaction, targetData);

      continue;
    }

    // ========================================
    // INSTALLMENT
    // ========================================

    if (transaction.recurrence === "installment") {
      if (transaction.installments <= 1) {
        continue;
      }

      const targetTransaction = {
        ...transaction,
        installments: transaction.installments - 1,
      };

      synchronizeTransaction(targetTransaction, targetData);
    }
  }
}

// ========================================
// TRANSACTION UPDATE
// ========================================

function synchronizeTransaction(sourceTransaction, targetData) {
  const existingIndex = targetData.transactions.findIndex(
    (transaction) => transaction.id === sourceTransaction.id,
  );

  // ========================================
  // NEW TRANSACTION
  // ========================================

  if (existingIndex === -1) {
    targetData.transactions.push({
      ...sourceTransaction,
    });

    return;
  }

  // ========================================
  // EXISTING TRANSACTION
  // ========================================

  targetData.transactions[existingIndex] = {
    ...targetData.transactions[existingIndex],
    ...sourceTransaction,
  };
}
