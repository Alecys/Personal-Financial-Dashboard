// ========================================
// CONSTANTS
// ========================================

const storageKey = "financial-control-data";

// ========================================
// SAVE
// ========================================

export function saveFinancialControlData(data) {
  localStorage.setItem(storageKey, JSON.stringify(data));
}
