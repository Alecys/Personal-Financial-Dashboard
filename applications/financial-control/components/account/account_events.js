// ========================================
// ACCOUNT EVENTS
// ========================================

// ========================================
// MODULE
// ========================================

const {
  editAccount,
  transferAccount,
  cancelAccount,
  saveAccount,
  confirmAccountTransfer,
  closeAccount,
} = await import(globalThis.path.financialControl.components.account.actions);

// ========================================
// INITIALIZE
// ========================================

export function initializeAccountEvents() {
  const accountContainer = document.querySelector('[data-slot="accounts"]');

  if (!accountContainer) {
    return;
  }

  // ========================================
  // ACCOUNT CLICK
  // ========================================

  accountContainer.addEventListener("pointerdown", handleAccountClick);

  // ========================================
  // OUTSIDE CLICK
  // ========================================

  document.addEventListener("pointerdown", handleAccountOutsideClick, true);
}

// ========================================
// ACCOUNT CLICK
// ========================================

function handleAccountClick(event) {
  const accountAction = event.target.closest("[data-account-action]");

  if (!accountAction) {
    return;
  }

  const accountCard = accountAction.closest("[data-account-id]");

  if (!accountCard) {
    return;
  }

  const accountId = accountCard.dataset.accountId;

  const action = accountAction.dataset.accountAction;

  // ========================================
  // EDIT
  // ========================================

  if (action === "edit") {
    editAccount(accountId);
    return;
  }

  // ========================================
  // TRANSFER
  // ========================================

  if (action === "transfer") {
    transferAccount(accountId);
    return;
  }

  // ========================================
  // CANCEL
  // ========================================

  if (action === "cancel") {
    cancelAccount(accountId);
    return;
  }

  // ========================================
  // SAVE
  // ========================================

  if (action === "save") {
    saveAccount(accountId, accountCard);
    return;
  }

  // ========================================
  // CONFIRM TRANSFER
  // ========================================

  if (action === "confirm-transfer") {
    confirmAccountTransfer(accountId, accountCard);
  }
}

// ========================================
// OUTSIDE CLICK
// ========================================

function handleAccountOutsideClick(event) {
  const activeCard = document.querySelector(
    '[data-account-state="editing"], [data-account-state="transfer"]',
  );

  if (!activeCard) {
    return;
  }

  // ========================================
  // CLICK INSIDE
  // ========================================

  if (activeCard.contains(event.target)) {
    return;
  }

  // ========================================
  // NORMAL VIEW
  // ========================================

  const accountId = activeCard.dataset.accountId;

  closeAccount(accountId);
}
