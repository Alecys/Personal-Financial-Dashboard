// ========================================
// IMPORTS
// ========================================

// ========================================
// DATA
// ========================================

let financialControlData = null;

// ========================================
// INITIALIZE
// ========================================

export async function initializeFinancialControlData() {
  const { loadFinancialControlData } = await import(
    globalThis.path.financialControl.data.load
  );

  const { convertFinancialControlData } = await import(
    globalThis.path.financialControl.data.converter
  );

  const { saveFinancialControlData } = await import(
    globalThis.path.financialControl.data.save
  );

  // ========================================
  // LOAD
  // ========================================

  const loadedData = await loadFinancialControlData();

  // ========================================
  // CONVERT
  // ========================================

  financialControlData = convertFinancialControlData(loadedData);

  // ========================================
  // SAVE
  // ========================================

  saveFinancialControlData(financialControlData);

  return financialControlData;
}

// ========================================
// GET
// ========================================

export function getFinancialControlData() {
  return financialControlData;
}

// ========================================
// SAVE
// ========================================

export async function saveFinancialControlData(data) {
  const { convertFinancialControlData } = await import(
    globalThis.path.financialControl.data.converter
  );

  const { saveFinancialControlData: save } = await import(
    globalThis.path.financialControl.data.save
  );

  financialControlData = convertFinancialControlData(data);

  await save(financialControlData);

  return financialControlData;
}
