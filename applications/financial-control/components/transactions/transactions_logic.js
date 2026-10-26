// ========================================
// TRANSACTIONS LOGIC
// ========================================

// ========================================
// ADD
// ========================================

export function addTransaction(data, transactionData) {
  const month = data.months[data.currentMonth];

  if (!month) {
    return;
  }

  if (!Array.isArray(month.transactions)) {
    month.transactions = [];
  }

  // ========================================
  // TIME
  // ========================================

  const now = new Date();

  const time = [
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join(":");

  // ========================================
  // ID
  // ========================================

  const id = createTransactionId(month.transactions);

  // ========================================
  // TRANSACTION
  // ========================================

  month.transactions.push({
    id,
    date: transactionData.date,
    time,
    description: transactionData.description,
    group: transactionData.group,
    account: transactionData.account,
    type: transactionData.type,
    amount: normalizeTransactionAmount(
      transactionData.amount,
      transactionData.type,
    ),
    recurrence: transactionData.recurrence,
    installments: transactionData.installments,
  });
}

// ========================================
// UPDATE
// ========================================

export function updateTransaction(data, transactionId, transactionData) {
  const month = data.months[data.currentMonth];

  if (!month) {
    return;
  }

  if (!Array.isArray(month.transactions)) {
    return;
  }

  const transaction = month.transactions.find(
    (item) => String(item.id) === String(transactionId),
  );

  if (!transaction) {
    return;
  }

  // ========================================
  // UPDATE FIELDS
  // ========================================

  transaction.date = transactionData.date;

  transaction.description = transactionData.description;

  transaction.group = transactionData.group;

  transaction.account = transactionData.account;

  transaction.type = transactionData.type;

  transaction.amount = normalizeTransactionAmount(
    transactionData.amount,
    transactionData.type,
  );

  transaction.recurrence = transactionData.recurrence;

  transaction.installments = transactionData.installments;
}

// ========================================
// DELETE
// ========================================

export function deleteTransaction(data, transactionId) {
  const month = data.months[data.currentMonth];

  if (!month) {
    return;
  }

  if (!Array.isArray(month.transactions)) {
    return;
  }

  month.transactions = month.transactions.filter(
    (transaction) => String(transaction.id) !== String(transactionId),
  );
}

// ========================================
// SORT
// ========================================

export function sortTransactions(data, ascending = true) {
  const month = data.months[data.currentMonth];

  if (!month) {
    return;
  }

  if (!Array.isArray(month.transactions)) {
    return;
  }

  month.transactions.sort((first, second) => {
    const firstDate = new Date(`${first.date}T${first.time || "00:00:00"}`);

    const secondDate = new Date(`${second.date}T${second.time || "00:00:00"}`);

    const difference = firstDate - secondDate;

    return ascending ? difference : -difference;
  });
}

// ========================================
// TRANSACTION ID
// ========================================

function createTransactionId(transactions) {
  if (transactions.length === 0) {
    return "1";
  }

  const ids = transactions
    .map((transaction) => Number(transaction.id))
    .filter((id) => Number.isFinite(id));

  if (ids.length === 0) {
    return "1";
  }

  return String(Math.max(...ids) + 1);
}

// ========================================
// NORMALIZE TRANSACTION AMOUNT
// ========================================

function normalizeTransactionAmount(amount, type) {
  const value = Number(amount) || 0;

  if (type === "credit") {
    return -Math.abs(value);
  }

  return value;
}
