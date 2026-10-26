// ========================================
// ACCOUNT ACTIONS
// ========================================

// ========================================
// MODULE
// ========================================

const { getFinancialControlData } = await import(
  globalThis.path.financialControl.data.js
);

const { setAccountViewNormal, setAccountViewEditing, setAccountViewTransfer } =
  await import(globalThis.path.financialControl.components.account.view);

const { updateAccount, createTransfer } = await import(
  globalThis.path.financialControl.components.account.logic
);

const { renderAccount } = await import(
  globalThis.path.financialControl.components.account.render
);

const { saveFinancialControlData } = await import(
  globalThis.path.financialControl.data.save
);

const { notifyFinancialControlLogic } = await import(
  globalThis.path.financialControl.notify.logic
);

const { notifyFinancialControlView } = await import(
  globalThis.path.financialControl.notify.view
);

// ========================================
// EDIT
// ========================================

export function editAccount(accountId) {
  const data = getFinancialControlData();

  setAccountViewEditing(data, accountId, renderAccount);
}

// ========================================
// TRANSFER
// ========================================

export function transferAccount(accountId) {
  const data = getFinancialControlData();

  setAccountViewTransfer(data, accountId, renderAccount);
}

// ========================================
// CANCEL
// ========================================

export function cancelAccount(accountId) {
  const data = getFinancialControlData();

  setAccountViewNormal(data, accountId, renderAccount);
}

// ========================================
// SAVE
// ========================================

export async function saveAccount(accountId, accountCard) {
  // ========================================
  // INTERFACE
  // ========================================

  const name = accountCard.querySelector('[data-account-field="name"]').value;

  const initialBalance = Number(
    accountCard.querySelector('[data-account-field="initial-balance"]').value,
  );

  // ========================================
  // DATA
  // ========================================

  const data = getFinancialControlData();

  // ========================================
  // LOGIC
  // ========================================

  updateAccount(data, accountId, name, initialBalance);

  // ========================================
  // UPDATE LOGIC
  // ========================================

  await notifyFinancialControlLogic(data);

  // ========================================
  // UPDATE VIEW
  // ========================================

  await notifyFinancialControlView(data);

  // ========================================
  // SAVE
  // ========================================

  await saveFinancialControlData(data);
}

// ========================================
// CONFIRM TRANSFER
// ========================================

export async function confirmAccountTransfer(accountId, accountCard) {
  // ========================================
  // INTERFACE
  // ========================================

  const destinationAccountId = accountCard.querySelector(
    '[data-account-field="transfer-to"]',
  ).value;

  const amount = Number(
    accountCard.querySelector('[data-account-field="transfer-amount"]').value,
  );

  // ========================================
  // DATA
  // ========================================

  const data = getFinancialControlData();

  // ========================================
  // LOGIC
  // ========================================

  createTransfer(data, accountId, destinationAccountId, amount);

  // ========================================
  // UPDATE LOGIC
  // ========================================

  await notifyFinancialControlLogic(data);

  // ========================================
  // UPDATE VIEW
  // ========================================

  await notifyFinancialControlView(data);

  // ========================================
  // SAVE
  // ========================================

  await saveFinancialControlData(data);
}

// ========================================
// OUTSIDE
// ========================================

export function closeAccount(accountId) {
  const data = getFinancialControlData();

  setAccountViewNormal(data, accountId, renderAccount);
}
