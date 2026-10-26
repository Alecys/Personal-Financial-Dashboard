// ========================================
// HEADER CONTROL
// ========================================

// ========================================
// MODULE
// ========================================

const { getFinancialControlData } = await import(
  globalThis.path.financialControl.data.js
);

const { getHeaderData } = await import(
  globalThis.path.financialControl.components.header.logic
);

const { renderHeader } = await import(
  globalThis.path.financialControl.components.header.render
);

const { registerFinancialControlView } = await import(
  globalThis.path.financialControl.notify.view
);

const { initializeHeaderEvents } = await import(
  globalThis.path.financialControl.components.header.events
);

// ========================================
// INITIALIZE
// ========================================

export async function initializeHeaderControl() {
  // ========================================
  // REGISTER VIEW
  // ========================================

  registerFinancialControlView(updateHeader);

  // ========================================
  // INITIAL DATA
  // ========================================

  const data = getFinancialControlData();

  // ========================================
  // INITIAL VIEW
  // ========================================

  await updateHeader(data);

  // ========================================
  // EVENTS
  // ========================================

  initializeHeaderEvents();
}

// ========================================
// UPDATE VIEW
// ========================================

async function updateHeader(data) {
  // ========================================
  // HEADER DATA
  // ========================================

  const headerData = await getHeaderData(data);

  // ========================================
  // RENDER
  // ========================================

  renderHeader(headerData);
}
