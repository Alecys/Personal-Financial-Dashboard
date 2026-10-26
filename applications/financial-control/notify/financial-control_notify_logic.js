// ========================================
// FINANCIAL CONTROL LOGIC
// ========================================

// ========================================
// IMPORTS
// ========================================

const { saveFinancialControlData } = await import(
  globalThis.path.financialControl.data.js
);

// ========================================
// LOGIC
// ========================================

const logicListeners = [];

// ========================================
// REGISTER
// ========================================

export function registerFinancialControlLogic(listener, order = 0) {
  logicListeners.push({
    listener,
    order,
  });

  logicListeners.sort((a, b) => a.order - b.order);
}

// ========================================
// NOTIFY
// ========================================

export async function notifyFinancialControlLogic(data) {
  for (const item of logicListeners) {
    await item.listener(data);
  }
  await saveFinancialControlData(data);
}
