// ========================================
// CREDIT ACTIONS
// ========================================

// ========================================
// MODULE
// ========================================

const { getFinancialControlData } = await import(
  globalThis.path.financialControl.data.js
);

const {
  setCreditViewFace,
  setCreditViewFlip,
  setCreditViewEdit,
  setCreditViewPayment,
} = await import(globalThis.path.financialControl.components.credit.view);

const { saveCreditPaymentLogic, saveCreditEditLogic } = await import(
  globalThis.path.financialControl.components.credit.logic
);

const { notifyFinancialControlLogic } = await import(
  globalThis.path.financialControl.notify.logic
);

const { notifyFinancialControlView } = await import(
  globalThis.path.financialControl.notify.view
);

// ========================================
// INITIALIZE
// ========================================

export function initializeCreditActions() {}

// ========================================
// FLIP
// ========================================

export function flipCredit(creditId) {
  const data = getFinancialControlData();

  setCreditViewFlip(data, creditId);
}

// ========================================
// EDIT
// ========================================

export function editCredit(creditId) {
  const data = getFinancialControlData();

  setCreditViewEdit(data, creditId);
}

// ========================================
// CREDIT EDIT SAVE
// ========================================

export async function saveCreditEdit(creditId) {
  const data = getFinancialControlData();

  // ========================================
  // LOGIC
  // ========================================

  saveCreditEditLogic(data, creditId);

  // ========================================
  // UPDATE LOGIC
  // ========================================

  await notifyFinancialControlLogic(data);

  // ========================================
  // UPDATE VIEW
  // ========================================

  await notifyFinancialControlView(data);

  // ========================================
  // CREDIT VIEW
  // ========================================

  setCreditViewFace(data, creditId);
}

// ========================================
// PAYMENT
// ========================================

export function paymentCredit(creditId) {
  const data = getFinancialControlData();

  setCreditViewPayment(data, creditId);
}

// ========================================
// CREDIT PAYMENT SAVE
// ========================================

export async function saveCreditPayment(creditId) {
  const data = getFinancialControlData();

  // ========================================
  // LOGIC
  // ========================================

  saveCreditPaymentLogic(data, creditId);

  // ========================================
  // UPDATE LOGIC
  // ========================================

  await notifyFinancialControlLogic(data);

  // ========================================
  // UPDATE VIEW
  // ========================================

  await notifyFinancialControlView(data);

  // ========================================
  // CREDIT VIEW
  // ========================================

  setCreditViewFace(data, creditId);
}

// ========================================
// CLOSE
// ========================================

export function closeCredit(creditId) {
  const data = getFinancialControlData();

  setCreditViewFace(data, creditId);
}
