// ========================================
// IMPORTS
// ========================================

// ========================================
// CONSTANTS
// ========================================

const storageKey = "financial-control-data";

// ========================================
// MAIN
// ========================================

export async function loadFinancialControlData() {
  // ========================================
  // LOCAL STORAGE
  // ========================================

  const savedData = localStorage.getItem(storageKey);

  if (savedData !== null) {
    return JSON.parse(savedData);
  }

  // ========================================
  // REFERENCE DATA
  // ========================================

  const response = await fetch(globalThis.path.financialControl.data.json);

  if (!response.ok) {
    throw new Error("Failed to load Financial Control reference data.");
  }

  return await response.json();
}
