// ========================================
// CREDIT VIEW
// ========================================

// ========================================
// IMPORTS
// ========================================

const { renderCredit, renderCreditState } = await import(
  globalThis.path.financialControl.components.credit.render
);

// ========================================
// INITIALIZE
// ========================================

export async function initializeCreditView(data) {
  renderCredit(data);
}

// ========================================
// FACE
// ========================================

export function setCreditViewFace(data, creditId) {
  renderCreditState(data, creditId, "face");
}

// ========================================
// FLIP
// ========================================

export function setCreditViewFlip(data, creditId) {
  renderCreditState(data, creditId, "flip");
}

// ========================================
// EDIT
// ========================================

export function setCreditViewEdit(data, creditId) {
  renderCreditState(data, creditId, "edit");
}

// ========================================
// PAYMENT
// ========================================

export function setCreditViewPayment(data, creditId) {
  renderCreditState(data, creditId, "payment");
}
