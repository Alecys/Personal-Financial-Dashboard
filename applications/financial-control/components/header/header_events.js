// ========================================
// HEADER EVENTS
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

const { navigateHeader } = await import(
  globalThis.path.financialControl.components.header.actions
);

// ========================================
// INITIALIZE
// ========================================

export function initializeHeaderEvents() {
  const headerContainer = document.querySelector('[data-slot="header"]');

  if (!headerContainer) {
    return;
  }

  // ========================================
  // HEADER CLICK
  // ========================================

  headerContainer.addEventListener("pointerdown", handleHeaderClick);
}

// ========================================
// HEADER CLICK
// ========================================

async function handleHeaderClick(event) {
  const button = event.target.closest("[data-action]");

  if (!button) {
    return;
  }

  const action = button.dataset.action;

  // ========================================
  // DATA
  // ========================================

  const data = getFinancialControlData();

  const headerData = await getHeaderData(data);

  // ========================================
  // PREVIOUS
  // ========================================

  if (action === "previous") {
    await navigateHeader(headerData.previousMonth);

    return;
  }

  // ========================================
  // NEXT
  // ========================================

  if (action === "next") {
    await navigateHeader(headerData.nextMonth);
  }
}
