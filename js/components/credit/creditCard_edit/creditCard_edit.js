import { getCurrentMonth, updateCurrentMonth } from "../../../core/store.js";
import { escapeHTML } from "../../../core/formatters.js";

export function createCreditCardEdit() {
    return `
        <div class="credit-edit"></div>
    `;
}

export function initializeCreditEdit(root) {
    if (!root) {
        return null;
    }

    function getCard(cardId) {
        const month =
            getCurrentMonth();

        const card =
            month?.credit?.[cardId];

        if (!card) {
            return null;
        }

        return {
            id: cardId,
            ...card
        };
    }

    function open(cardId) {
        const card =
            getCard(cardId);

        if (!card) {
            return;
        }

        const deckCard =
            root.querySelector(
                `.deck-card[data-card-id="${CSS.escape(String(cardId))}"]`
            );

        if (!deckCard) {
            return;
        }

        const edit =
            deckCard.querySelector(
                ".credit-edit"
            );

        if (!edit) {
            return;
        }

        const flip =
            deckCard.querySelector(
                ".flip"
            );

        flip?.classList.remove(
            "is-flipped"
        );

        deckCard.classList.remove(
            "is-paying"
        );

        edit.innerHTML =
            createForm(card);

        deckCard.classList.add(
            "is-editing"
        );

        bindForm(
            deckCard,
            cardId
        );
    }

    function close(cardId) {
        const deckCard =
            root.querySelector(
                `.deck-card[data-card-id="${CSS.escape(String(cardId))}"]`
            );

        if (!deckCard) {
            return;
        }

        deckCard.classList.remove(
            "is-editing"
        );
    }

    function createForm(card) {
        return `
            <div class="credit-edit__header">

                <div class="credit-edit__heading">

                    <span class="credit-edit__label">
                        Edit card
                    </span>

                    <strong class="credit-edit__title">
                        ${escapeHTML(
                            card.name
                        )}
                    </strong>

                </div>

                <button
                    class="credit-edit__close"
                    type="button"
                    data-edit-action="close"
                    aria-label="Cancel editing"
                >
                    ×
                </button>

            </div>

            <form class="credit-edit__form">

                <label class="credit-edit__field">
                    <span>Name</span>

                    <input
                        type="text"
                        name="name"
                        value="${escapeHTML(
                            card.name || ""
                        )}"
                        autocomplete="off"
                        required
                    >
                </label>

                <div class="credit-edit__row">

                    <label class="credit-edit__field">
                        <span>Last four</span>

                        <input
                            type="text"
                            name="lastFour"
                            value="${escapeHTML(
                                card.lastFour || ""
                            )}"
                            maxlength="4"
                            inputmode="numeric"
                            autocomplete="off"
                        >
                    </label>

                    <label class="credit-edit__field">
                        <span>Credit limit</span>

                        <input
                            type="number"
                            name="limit"
                            value="${Number(
                                card.limit || 0
                            )}"
                            min="0"
                            step="0.01"
                        >
                    </label>

                </div>

                <div class="credit-edit__row">

                    <label class="credit-edit__field">
                        <span>Closing</span>

                        <input
                            type="number"
                            name="closingDay"
                            value="${Number(
                                card.closingDay || 1
                            )}"
                            min="1"
                            max="31"
                        >
                    </label>

                    <label class="credit-edit__field">
                        <span>Due</span>

                        <input
                            type="number"
                            name="dueDay"
                            value="${Number(
                                card.dueDay || 1
                            )}"
                            min="1"
                            max="31"
                        >
                    </label>

                </div>

                <div class="credit-edit__actions">

                    <button
                        type="button"
                        class="credit-edit__cancel"
                        data-edit-action="close"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        class="credit-edit__save"
                    >
                        Save
                    </button>

                </div>

            </form>
        `;
    }

    function bindForm(
        deckCard,
        cardId
    ) {
        const edit =
            deckCard.querySelector(
                ".credit-edit"
            );

        if (!edit) {
            return;
        }

        edit.addEventListener(
            "click",
            event => {
                const action =
                    event.target.closest(
                        "[data-edit-action]"
                    );

                if (!action) {
                    return;
                }

                if (
                    action.dataset.editAction ===
                    "close"
                ) {
                    close(cardId);
                }
            }
        );

        edit.addEventListener(
            "submit",
            event => {
                event.preventDefault();

                const form =
                    event.target;

                const formData =
                    new FormData(form);

                const name =
                    String(
                        formData.get(
                            "name"
                        ) || ""
                    ).trim();

                const lastFour =
                    String(
                        formData.get(
                            "lastFour"
                        ) || ""
                    )
                        .replace(
                            /\D/g,
                            ""
                        )
                        .slice(
                            0,
                            4
                        );

                const limit =
                    Math.max(
                        Number(
                            formData.get(
                                "limit"
                            ) || 0
                        ),
                        0
                    );

                const closingDay =
                    Math.min(
                        Math.max(
                            Number(
                                formData.get(
                                    "closingDay"
                                ) || 1
                            ),
                            1
                        ),
                        31
                    );

                const dueDay =
                    Math.min(
                        Math.max(
                            Number(
                                formData.get(
                                    "dueDay"
                                ) || 1
                            ),
                            1
                        ),
                        31
                    );

                if (!name) {
                    return;
                }

                updateCurrentMonth(
                    month => {
                        const currentCard =
                            month.credit?.[
                                cardId
                            ];

                        if (!currentCard) {
                            return;
                        }

                        month.credit[
                            cardId
                        ] = {
                            ...currentCard,
                            name,
                            lastFour,
                            limit,
                            closingDay,
                            dueDay
                        };
                    }
                );

                close(cardId);
            }
        );
    }

    return {
        open,
        close
    };
}