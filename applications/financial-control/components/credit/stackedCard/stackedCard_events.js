// ========================================
// STACKED CARD EVENTS
// ========================================

// ========================================
// IMPORTS
// ========================================

const {
  getStackedCardDeck,
  getStackedCards,
  getCurrentStackedCard,
  getStackedCardAnimating,
  setStackedCardAnimating,
  nextStackedCard,
  previousStackedCard,
  updateCardDeck,
} = await import(
  globalThis.path.financialControl.components.credit.stackedCard.logic
);

const { closeCredit } = await import(
  globalThis.path.financialControl.components.credit.actions
);

// ========================================
// STATE
// ========================================

let startX = 0;

let dragDistance = 0;

let isDragging = false;

// ========================================
// INITIALIZE
// ========================================

export async function initializeStackedCardEvents() {
  const deck = getStackedCardDeck();

  if (!deck) {
    return;
  }

  const cards = getStackedCards();

  cards.forEach((card) => {
    card.addEventListener("pointerdown", startDrag);
  });

  deck.addEventListener("pointermove", handlePointerMove);

  deck.addEventListener("pointerup", endDrag);

  deck.addEventListener("pointercancel", endDrag);
}

// ========================================
// START DRAG
// ========================================

function startDrag(event) {
  if (getStackedCardAnimating()) {
    return;
  }

  const activeCard = getCurrentStackedCard();

  if (activeCard !== event.currentTarget) {
    return;
  }

  isDragging = true;

  startX = event.clientX;

  dragDistance = 0;

  const deck = getStackedCardDeck();

  deck.classList.add("is-dragging");

  event.currentTarget.setPointerCapture(event.pointerId);
}

// ========================================
// HANDLE POINTER MOVE
// ========================================

function handlePointerMove(event) {
  if (!isDragging) {
    return;
  }

  const activeCard = getCurrentStackedCard();

  dragDistance = event.clientX - startX;

  const rotation = dragDistance / 18;

  activeCard.style.transform = `
    translateX(${dragDistance}px)
    rotate(${rotation}deg)
    scale(1)
  `;
}

// ========================================
// END DRAG
// ========================================

function endDrag() {
  if (!isDragging) {
    return;
  }

  isDragging = false;

  const deck = getStackedCardDeck();

  deck.classList.remove("is-dragging");

  const threshold = 90;

  if (dragDistance < -threshold) {
    nextCard();
  } else if (dragDistance > threshold) {
    previousCard();
  } else {
    updateCardDeck();
  }

  dragDistance = 0;
}

// ========================================
// CLOSE CURRENT CARD
// ========================================

function closeCurrentCard() {
  const activeCard = getCurrentStackedCard();

  if (!activeCard) {
    return;
  }

  const creditState =
    activeCard.querySelector(".deck-card")?.dataset.creditState;

  if (
    creditState !== "flip" &&
    creditState !== "edit" &&
    creditState !== "payment"
  ) {
    return;
  }

  const creditId = activeCard.dataset.creditId;

  if (!creditId) {
    return;
  }

  closeCredit(creditId);
}

// ========================================
// NEXT CARD
// ========================================

function nextCard() {
  if (getStackedCardAnimating()) {
    return;
  }

  setStackedCardAnimating(true);

  const activeCard = getCurrentStackedCard();

  closeCurrentCard();

  activeCard.classList.add("swipe-left");

  setTimeout(() => {
    activeCard.classList.remove("swipe-left");

    nextStackedCard();

    setStackedCardAnimating(false);
  }, 280);
}

// ========================================
// PREVIOUS CARD
// ========================================

function previousCard() {
  if (getStackedCardAnimating()) {
    return;
  }

  setStackedCardAnimating(true);

  const activeCard = getCurrentStackedCard();

  closeCurrentCard();

  activeCard.classList.add("swipe-right");

  setTimeout(() => {
    activeCard.classList.remove("swipe-right");

    previousStackedCard();

    setStackedCardAnimating(false);
  }, 280);
}
