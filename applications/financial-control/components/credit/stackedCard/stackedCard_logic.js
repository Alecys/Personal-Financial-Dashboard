// ========================================
// STACKED CARD LOGIC
// ========================================

// ========================================
// STATE
// ========================================

let deck = null;

let cards = [];

let currentIndex = 0;

let isAnimating = false;

// ========================================
// INITIALIZE
// ========================================

export async function initializeStackedCardLogic() {
  deck = document.querySelector('[data-field="credits"]');

  if (!deck) {
    return;
  }

  cards = [...deck.querySelectorAll(".credit-float")];

  currentIndex = 0;

  isAnimating = false;

  updateCardDeck();
}

// ========================================
// GETTERS
// ========================================

export function getStackedCardDeck() {
  return deck;
}

export function getStackedCards() {
  return cards;
}

export function getCurrentStackedCard() {
  return cards[currentIndex];
}

export function getStackedCardAnimating() {
  return isAnimating;
}

// ========================================
// SETTERS
// ========================================

export function setStackedCardAnimating(value) {
  isAnimating = value;
}

// ========================================
// UPDATE CARD DECK
// ========================================

export function updateCardDeck() {
  cards.forEach((card, index) => {
    const position = (index - currentIndex + cards.length) % cards.length;

    if (position > 3) {
      card.style.opacity = "0";

      card.style.pointerEvents = "none";

      return;
    }

    card.style.opacity = "1";

    card.style.pointerEvents = position === 0 ? "auto" : "none";

    card.dataset.position = position;

    if (position === 0) {
      card.style.transform = "translateX(0) scale(1)";

      card.style.zIndex = "10";
    }

    if (position === 1) {
      card.style.transform = "translateX(28px) scale(.94)";

      card.style.zIndex = "9";
    }

    if (position === 2) {
      card.style.transform = "translateX(52px) scale(.88)";

      card.style.zIndex = "8";
    }

    if (position === 3) {
      card.style.transform = "translateX(72px) scale(.82)";

      card.style.zIndex = "7";
    }
  });
}

// ========================================
// NEXT
// ========================================

export function nextStackedCard() {
  currentIndex = (currentIndex + 1) % cards.length;

  updateCardDeck();
}

// ========================================
// PREVIOUS
// ========================================

export function previousStackedCard() {
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;

  updateCardDeck();
}
