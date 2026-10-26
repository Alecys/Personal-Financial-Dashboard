// ========================================

// LISTENERS

// ========================================

const listeners = new Set();

// ========================================

// SUBSCRIBE

// ========================================

export function subscribeFinancialControl(listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

// ========================================

// NOTIFY

// ========================================

export async function notifyFinancialControl(data) {
  for (const listener of listeners) {
    await listener(data);
  }
}
