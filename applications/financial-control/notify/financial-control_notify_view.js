// ========================================
// FINANCIAL CONTROL VIEW
// ========================================

// ========================================
// VIEW
// ========================================

const viewListeners = new Set();

// ========================================
// REGISTER
// ========================================

export function registerFinancialControlView(listener) {
  viewListeners.add(listener);
}

// ========================================
// NOTIFY
// ========================================

export async function notifyFinancialControlView(data) {
  for (const listener of viewListeners) {
    await listener(data);
  }
}
