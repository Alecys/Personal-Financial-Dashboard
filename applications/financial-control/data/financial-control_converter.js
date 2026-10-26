// ========================================
// IMPORTS
// ========================================

// ========================================
// CONVERTER
// ========================================

export function convertFinancialControlData(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid Financial Control data.");
  }

  if (!data.version || !data.months) {
    throw new Error("Unsupported Financial Control data format.");
  }

  // Future schema migrations belong here.

  return data;
}
