// ========================================
// HEADER
// ========================================

const { initializeHeaderControl } = await import(
  globalThis.path.financialControl.components.header.control
);

// ========================================
// INITIALIZE
// ========================================

export async function initializeHeader() {
  const stylesheetHeader = document.createElement("link");

  stylesheetHeader.rel = "stylesheet";

  stylesheetHeader.href =
    globalThis.path.financialControl.components.header.css;

  document.head.appendChild(stylesheetHeader);

  await initializeHeaderControl();
}
