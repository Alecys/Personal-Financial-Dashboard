// ========================================
// STACKED CARD
// ========================================

const { initializeStackedCardControl } = await import(
  globalThis.path.financialControl.components.credit.stackedCard.control
);

// ========================================
// INITIALIZE
// ========================================

export async function initializeStackedCard() {
  const stylesheetStackedCard = document.createElement("link");

  stylesheetStackedCard.rel = "stylesheet";

  stylesheetStackedCard.href =
    globalThis.path.financialControl.components.credit.stackedCard.css;

  document.head.appendChild(stylesheetStackedCard);

  await initializeStackedCardControl();
}
