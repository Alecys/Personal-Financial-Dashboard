// ========================================
// CREDIT FLIP LOGIC
// ========================================

// ========================================
// INITIALIZE
// ========================================

export function initializeFlipLogic() {
  // Intentionally empty.
}

// ========================================
// FLIP
// ========================================

export function flipCreditCard(creditId, creditState) {
  const creditCard = document.querySelector(`[data-credit-id="${creditId}"]`);

  if (!creditCard) {
    return;
  }

  const creditFlipper = creditCard.querySelector(".credit-flipper");

  if (!creditFlipper) {
    return;
  }

  if (
    creditState === "flip" ||
    creditState === "edit" ||
    creditState === "payment"
  ) {
    creditFlipper.classList.add("is-flipped");

    return;
  }

  if (creditState === "face") {
    creditFlipper.classList.remove("is-flipped");
  }
}
