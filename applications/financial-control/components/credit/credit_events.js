// ========================================
// CREDIT EVENTS
// ========================================

// ========================================
// MODULE
// ========================================

const {
  flipCredit,
  editCredit,
  paymentCredit,
  closeCredit,
  saveCreditEdit,
  saveCreditPayment,
} = await import(globalThis.path.financialControl.components.credit.actions);

// ========================================
// INITIALIZE
// ========================================

export function initializeCreditEvents() {
  const creditContainer = document.querySelector('[data-slot="credit"]');

  if (!creditContainer) {
    return;
  }

  // ========================================
  // CREDIT CLICK
  // ========================================

  creditContainer.addEventListener("pointerdown", handleCreditClick);

  // ========================================
  // OUTSIDE CLICK
  // ========================================

  document.addEventListener("pointerdown", handleCreditOutsideClick, true);
}

// ========================================
// CREDIT CLICK
// ========================================

function handleCreditClick(event) {
  const creditAction = event.target.closest("[data-action]");

  if (!creditAction) {
    return;
  }

  const creditCard = creditAction.closest("[data-credit-id]");

  if (!creditCard) {
    return;
  }

  const creditId = creditCard.dataset.creditId;

  const action = creditAction.dataset.action;

  // ========================================
  // FLIP
  // ========================================

  if (action === "flip") {
    flipCredit(creditId);

    return;
  }

  // ========================================
  // EDIT
  // ========================================

  if (action === "edit") {
    editCredit(creditId);

    return;
  }

  // ========================================
  // CREDIT EDIT SAVE
  // ========================================

  if (action === "CreditEditSave") {
    saveCreditEdit(creditId);

    return;
  }

  // ========================================
  // PAYMENT
  // ========================================

  if (action === "payment") {
    paymentCredit(creditId);

    return;
  }

  // ========================================
  // CREDIT PAYMENT SAVE
  // ========================================

  if (action === "CreditPaymentSave") {
    saveCreditPayment(creditId);

    return;
  }

  // ========================================
  // CLOSE
  // ========================================

  if (action === "close") {
    closeCredit(creditId);
  }
}

// ========================================
// OUTSIDE CLICK
// ========================================

function handleCreditOutsideClick(event) {
  const activeCard = document.querySelector(
    '[data-credit-state="flip"],' +
      '[data-credit-state="edit"],' +
      '[data-credit-state="payment"]',
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

  const creditId = activeCard.closest("[data-credit-id]")?.dataset.creditId;

  if (!creditId) {
    return;
  }

  closeCredit(creditId);
}
