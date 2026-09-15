export function CreditCardStackedCards({
    root,
    items: initialItems,
    renderCard,
    initialIndex = 0,
    onSelect
}) {
    if (
        !root ||
        !Array.isArray(initialItems) ||
        !initialItems.length
    ) {
        return null;
    }

    let items =
        initialItems;

    let currentIndex =
        Math.min(
            Math.max(
                initialIndex,
                0
            ),
            items.length - 1
        );

    let startX = 0;
    let currentX = 0;
    let dragDistance = 0;
    let isDragging = false;
    let hasMoved = false;
    let pointerId = null;

    function getCards() {
        return [
            ...root.querySelectorAll(
                ".deck-card"
            )
        ];
    }

    function getSelectedCard() {
        return getCards()[
            currentIndex
        ];
    }

    function renderStackedCards() {
        root.innerHTML = `
            <div class="card-deck">
                <div class="card-deck__track"></div>
            </div>
        `;

        const track =
            root.querySelector(
                ".card-deck__track"
            );

        track.innerHTML =
            items
                .map(
                    item =>
                        renderCard(item)
                )
                .join("");

        updateCards();
        bindEvents();
    }

    function updateItems(
        newItems
    ) {
        if (
            !Array.isArray(newItems) ||
            !newItems.length
        ) {
            return;
        }

        const selectedId =
            items[currentIndex]?.id;

        items =
            newItems;

        const newIndex =
            items.findIndex(
                item =>
                    String(item.id) ===
                    String(selectedId)
            );

        currentIndex =
            newIndex >= 0
                ? newIndex
                : Math.min(
                    currentIndex,
                    items.length - 1
                );

        const track =
            root.querySelector(
                ".card-deck__track"
            );

        if (!track) {
            return;
        }

        track.innerHTML =
            items
                .map(
                    item =>
                        renderCard(item)
                )
                .join("");

        updateCards();
        bindEvents();
    }

    function updateCards() {
        const cards =
            getCards();

        cards.forEach(
            (
                card,
                index
            ) => {
                const position =
                    (
                        index -
                        currentIndex +
                        cards.length
                    ) %
                    cards.length;

                card.classList.remove(
                    "swipe-left",
                    "swipe-right"
                );

                card.style.opacity =
                    "1";

                card.style.pointerEvents =
                    "auto";

                if (
                    position === 0
                ) {
                    card.dataset.position =
                        "0";

                    card.style.zIndex =
                        "10";

                    card.style.transform =
                        "translateX(0) scale(1)";
                }

                else if (
                    position === 1
                ) {
                    card.dataset.position =
                        "1";

                    card.style.zIndex =
                        "9";

                    card.style.transform =
                        "translateX(45px) scale(.94)";
                }

                else if (
                    position === 2
                ) {
                    card.dataset.position =
                        "2";

                    card.style.zIndex =
                        "8";

                    card.style.transform =
                        "translateX(82px) scale(.88)";
                }

                else if (
                    position === 3
                ) {
                    card.dataset.position =
                        "3";

                    card.style.zIndex =
                        "7";

                    card.style.transform =
                        "translateX(112px) scale(.82)";
                }

                else {
                    card.dataset.position =
                        "hidden";

                    card.style.zIndex =
                        "0";

                    card.style.transform =
                        "translateX(140px) scale(.76)";

                    card.style.opacity =
                        "0";

                    card.style.pointerEvents =
                        "none";
                }
            }
        );

        const selectedCard =
            items[currentIndex];

        if (
            selectedCard &&
            onSelect
        ) {
            onSelect(
                selectedCard.id
            );
        }
    }

    function selectCard(
        index
    ) {
        if (
            index < 0 ||
            index >= items.length ||
            index === currentIndex
        ) {
            return;
        }

        currentIndex =
            index;

        updateCards();
    }

    function nextCard() {
        if (
            isDragging ||
            items.length <= 1
        ) {
            return;
        }

        const cards =
            getCards();

        const activeCard =
            cards[currentIndex];

        if (!activeCard) {
            return;
        }

        activeCard.classList.add(
            "swipe-left"
        );

        setTimeout(
            () => {
                currentIndex =
                    (
                        currentIndex +
                        1
                    ) %
                    items.length;

                updateCards();
            },
            280
        );
    }

    function previousCard() {
        if (
            isDragging ||
            items.length <= 1
        ) {
            return;
        }

        const cards =
            getCards();

        const activeCard =
            cards[currentIndex];

        if (!activeCard) {
            return;
        }

        activeCard.classList.add(
            "swipe-right"
        );

        setTimeout(
            () => {
                currentIndex =
                    (
                        currentIndex -
                        1 +
                        items.length
                    ) %
                    items.length;

                updateCards();
            },
            280
        );
    }

    function bindEvents() {
        const deck =
            root.querySelector(
                ".card-deck"
            );

        getCards().forEach(
            card => {
                card.addEventListener(
                    "pointerdown",
                    event => {
                        const editing =
                            card.classList.contains(
                                "is-editing"
                            );

                        const paying =
                            card.classList.contains(
                                "is-paying"
                            );

                        if (
                            editing ||
                            paying
                        ) {
                            return;
                        }

                        const cardIndex =
                            items.findIndex(
                                item =>
                                    String(
                                        item.id
                                    ) ===
                                    String(
                                        card.dataset.cardId
                                    )
                            );

                        if (
                            cardIndex === -1
                        ) {
                            return;
                        }

                        if (
                            cardIndex !==
                            currentIndex
                        ) {
                            selectCard(
                                cardIndex
                            );

                            return;
                        }

                        if (
                            event.target.closest(
                                "button"
                            )
                        ) {
                            return;
                        }

                        isDragging =
                            true;

                        hasMoved =
                            false;

                        pointerId =
                            event.pointerId;

                        startX =
                            event.clientX;

                        currentX =
                            event.clientX;

                        dragDistance =
                            0;

                        deck?.classList.add(
                            "is-dragging"
                        );

                        card.setPointerCapture(
                            pointerId
                        );
                    }
                );
            }
        );
    }

    function finishDrag(
        event
    ) {
        if (
            !isDragging ||
            event.pointerId !==
                pointerId
        ) {
            return;
        }

        isDragging =
            false;

        const deck =
            root.querySelector(
                ".card-deck"
            );

        deck?.classList.remove(
            "is-dragging"
        );

        const threshold =
            80;

        if (
            dragDistance <
            -threshold
        ) {
            nextCard();
        }

        else if (
            dragDistance >
            threshold
        ) {
            previousCard();
        }

        else {
            updateCards();
        }

        dragDistance =
            0;

        pointerId =
            null;

        hasMoved =
            false;
    }

    function handleOutsideClick(
        event
    ) {
        const selectedCard =
            getSelectedCard();

        if (!selectedCard) {
            return;
        }

        const isEditing =
            selectedCard.classList.contains(
                "is-editing"
            );

        const isPaying =
            selectedCard.classList.contains(
                "is-paying"
            );

        if (
            !isEditing &&
            !isPaying
        ) {
            return;
        }

        if (
            selectedCard.contains(
                event.target
            )
        ) {
            return;
        }

        selectedCard.classList.remove(
            "is-editing",
            "is-paying"
        );
    }

    function handleKeyboard(
        event
    ) {
        if (
            event.key ===
            "ArrowRight"
        ) {
            nextCard();
        }

        if (
            event.key ===
            "ArrowLeft"
        ) {
            previousCard();
        }
    }

    document.addEventListener(
        "keydown",
        handleKeyboard
    );

    document.addEventListener(
        "pointerdown",
        handleOutsideClick
    );

    renderStackedCards();

    const renderedDeck =
        root.querySelector(
            ".card-deck"
        );

    renderedDeck?.addEventListener(
        "pointermove",
        event => {
            if (
                !isDragging ||
                event.pointerId !==
                    pointerId
            ) {
                return;
            }

            currentX =
                event.clientX;

            dragDistance =
                currentX -
                startX;

            if (
                Math.abs(
                    dragDistance
                ) > 5
            ) {
                hasMoved =
                    true;
            }

            const activeCard =
                getCards()[
                    currentIndex
                ];

            if (!activeCard) {
                return;
            }

            const rotation =
                dragDistance /
                18;

            activeCard.style.transform =
                `translateX(${dragDistance}px) rotate(${rotation}deg) scale(1)`;
        }
    );

    renderedDeck?.addEventListener(
        "pointerup",
        finishDrag
    );

    renderedDeck?.addEventListener(
        "pointercancel",
        finishDrag
    );

    return {
        next:
            nextCard,

        previous:
            previousCard,

        select:
            selectCard,

        updateItems,

        getSelectedId:
            () =>
                items[
                    currentIndex
                ]?.id ?? null,

        destroy:
            () => {
                document.removeEventListener(
                    "keydown",
                    handleKeyboard
                );

                document.removeEventListener(
                    "pointerdown",
                    handleOutsideClick
                );

                root.innerHTML =
                    "";
            }
    };
}