// ========================================
// CREDIT LOGIC
// ========================================

export async function initializeCreditLogic() {
  // Credit logic
}

// ========================================
// UPDATE CREDITS
// ========================================

export function updateCreditLogic(data) {
  const currentMonth = data.currentMonth;

  const currentMonthData = data.months[currentMonth];

  if (!currentMonthData?.credit) {
    return;
  }

  const previousMonth = getPreviousMonth(currentMonth);

  const previousMonthData = data.months[previousMonth];

  Object.entries(currentMonthData.credit).forEach(([creditId, credit]) => {
    if (previousMonthData?.credit?.[creditId]) {
      credit.initialBalance =
        previousMonthData.credit[creditId].nextInvoice || 0;
    }

    credit.openInvoice = getCreditOpenInvoice(
      currentMonthData,
      creditId,
      credit,
    );

    credit.nextInvoice = getCreditNextInvoice(
      currentMonthData,
      creditId,
      credit,
    );

    credit.installmentTotal = getCreditInstallmentTotal(
      data,
      currentMonth,
      creditId,
    );
  });
}

// ========================================
// OPEN INVOICE
// ========================================

function getCreditOpenInvoice(monthData, creditId, credit) {
  const transactions = monthData.transactions || [];
  const closingDay = Number(credit.closingDay);

  const transactionsValue = transactions
    .filter((transaction) => {
      if (transaction.type !== "credit") return false;
      if (transaction.account !== creditId) return false;

      return getTransactionDay(transaction.date) < closingDay;
    })
    .reduce((total, transaction) => {
      const value = getTransactionAmount(transaction);

      return total + value;
    }, 0);

  const initialBalance = Number(credit.initialBalance || 0);
  const result = initialBalance + transactionsValue;

  return result;
}

// ========================================
// NEXT INVOICE
// ========================================

function getCreditNextInvoice(monthData, creditId, credit) {
  const transactions = monthData.transactions || [];
  const closingDay = Number(credit.closingDay);

  return transactions
    .filter((transaction) => {
      if (transaction.type !== "credit") return false;
      if (transaction.account !== creditId) return false;

      return getTransactionDay(transaction.date) >= closingDay;
    })
    .reduce((total, transaction) => {
      const value = getTransactionAmount(transaction);

      return total + value;
    }, 0);
}

// ========================================
// TRANSACTION AMOUNT
// ========================================

function getTransactionAmount(transaction) {
  const amount = Number(transaction.amount || 0);

  if (transaction.type === "credit") {
    return -Math.abs(amount);
  }

  return amount;
}

// ========================================
// TRANSACTION DAY
// ========================================

function getTransactionDay(date) {
  return Number(date.split("-")[2]);
}

// ========================================
// PREVIOUS MONTH
// ========================================

function getPreviousMonth(currentMonth) {
  const [year, month] = currentMonth.split("-").map(Number);

  const date = new Date(year, month - 2, 1);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}`;
}

// ========================================
// CREDIT EDIT SAVE
// ========================================

export function saveCreditEditLogic(data, creditId) {
  const creditCard = document.querySelector(`[data-credit-id="${creditId}"]`);

  if (!creditCard) {
    return;
  }

  const form = creditCard.querySelector(".card-form");

  if (!form) {
    return;
  }

  const name = form.elements.name.value;
  const lastFour = form.elements["input-opacity"].value;
  const limit = Number(form.elements.limit.value);
  const closingDay = Number(form.elements.closingDay.value);
  const dueDay = Number(form.elements.dueDay.value);

  const currentMonth = data.currentMonth;

  const credit = data.months[currentMonth].credit[creditId];

  if (!credit) {
    return;
  }

  credit.name = name;
  credit.lastFour = lastFour;
  credit.limit = limit;
  credit.closingDay = closingDay;
  credit.dueDay = dueDay;
}

// ========================================
// CREDIT PAYMENT SAVE
// ========================================

export function saveCreditPaymentLogic(data, creditId) {
  const creditCard = document.querySelector(`[data-credit-id="${creditId}"]`);

  if (!creditCard) return false;

  const form = creditCard.querySelector(".card-form");

  if (!form) return false;

  const accountId = form.elements.account.value;

  if (!accountId) return false;

  const currentMonth = data.currentMonth;
  const monthData = data.months[currentMonth];

  if (!monthData || !Array.isArray(monthData.transactions)) {
    return false;
  }

  const credit = monthData.credit?.[creditId];

  if (!credit) return false;

  // PAYMENT AMOUNT
  const amount = Math.abs(Number(credit.openInvoice || 0));

  if (amount === 0) return false;

  // REGISTER PAYMENT
  const now = new Date();

  const transaction = {
    id: String(Date.now()),
    date: now.toISOString().split("T")[0],
    time: now.toTimeString().split(" ")[0],
    description: `Payment - ${credit.name}`,
    group: "Credit Card",
    account: accountId,
    type: "debit",
    amount: -amount,
    recurrence: "once",
    installments: 0,
  };

  monthData.transactions.push(transaction);

  // CLOSE INVOICE
  credit.invoiceStatus = "paid";

  return true;
}

// ========================================
// INSTALLMENT TOTAL
// ========================================

function getCreditInstallmentTotal(data, currentMonth, creditId) {
  const transactions = data.months[currentMonth]?.transactions || [];

  let total = 0;

  transactions.forEach((transaction) => {
    if (transaction.account !== creditId) return;
    if (transaction.type !== "credit") return;
    if (transaction.recurrence !== "installment") return;

    const installments = Number(transaction.installments) || 0;

    if (installments <= 1) return;

    const amount = Math.abs(Number(transaction.amount) || 0);
    const futureInstallments = installments - 1;
    const futureTotal = amount * futureInstallments;

    total += futureTotal;
  });

  return total;
}
