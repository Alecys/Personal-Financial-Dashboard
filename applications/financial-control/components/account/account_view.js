// ========================================
// ACCOUNT VIEW
// ========================================

// ========================================
// INITIALIZE
// ========================================

export function initializeAccountView(data, accountRender) {
  accountRender(data, null, "normal");
}

// ========================================
// NORMAL
// ========================================

export function setAccountViewNormal(data, accountId, accountRender) {
  accountRender(data, accountId, "normal");
}

// ========================================
// EDITING
// ========================================

export function setAccountViewEditing(data, accountId, accountRender) {
  accountRender(data, accountId, "editing");
}

// ========================================
// TRANSFER
// ========================================

export function setAccountViewTransfer(data, accountId, accountRender) {
  accountRender(data, accountId, "transfer");
}
