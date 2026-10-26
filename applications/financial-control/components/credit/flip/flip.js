// ========================================
// CREDIT FLIP
// ========================================

// ========================================
// IMPORTS
// ========================================

const { initializeFlipControl } = await import(
  globalThis.path.financialControl.components.credit.flip.control
);

// ========================================
// INITIALIZE
// ========================================

export async function initializeFlip() {
  const stylesheetFlip = document.createElement("link");

  stylesheetFlip.rel = "stylesheet";

  stylesheetFlip.href =
    globalThis.path.financialControl.components.credit.flip.css;

  document.head.appendChild(stylesheetFlip);

  await initializeFlipControl();
}
