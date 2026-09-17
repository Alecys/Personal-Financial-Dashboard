import { getCurrentMonth, updateCurrentMonth } from "../../core/store.js";
import { formatMoney, escapeHTML } from "../../core/formatters.js";

export function createCreditCardPayment() {
    return `
        <div class="credit-payment"></div>
    `;
}

export function initializeCreditPayment({
    root,
    getInvoice
}) {
    if (
        !root ||
        !getInvoice
    ) {
        return null;
    }

    function getCard(
        cardId
    ) {
        const month =
            getCurrentMonth();

        const card =
            month?.credit?.[cardId];

        if (!card) {
            return null;
        }

        return {
            id:
                cardId,
            ...card
        };
    }

    function getAccounts() {
        const month =
            getCurrentMonth();

        return Object.entries(
            month?.accounts || {}
        ).map(
            ([id, account]) => ({
                id,
                ...account
            })
        );
    }

    function open(
        cardId
    ) {
        const card =
            getCard(
                cardId
            );

        if (!card) {
            return;
        }

        const invoice =
            getInvoice(
                card
            );

        if (!invoice) {
            return;
        }

        if (
            invoice.status !==
                "closed" &&
            invoice.status !==
                "overdue"
        ) {
            return;
        }

        const amount =
            Math.abs(
                Number(
                    invoice.closedInvoice ||
                    0
                )
            );

        if (
            amount <= 0
        ) {
            return;
        }

        const deckCard =
            root.querySelector(
                `.deck-card[data-card-id="${CSS.escape(String(cardId))}"]`
            );

        if (!deckCard) {
            return;
        }

        const payment =
            deckCard.querySelector(
                ".credit-payment"
            );

        if (!payment) {
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
            "is-editing"
        );

        payment.innerHTML =
            createPayment(
                card,
                amount
            );

        deckCard.classList.add(
            "is-paying"
        );

        bindPayment(
            deckCard,
            cardId,
            amount
        );
    }

    function close(
        cardId
    ) {
        const deckCard =
            root.querySelector(
                `.deck-card[data-card-id="${CSS.escape(String(cardId))}"]`
            );

        if (!deckCard) {
            return;
        }

        deckCard.classList.remove(
            "is-paying"
        );
    }

    function createPayment(
        card,
        amount
    ) {
        const accounts =
            getAccounts();

        return `
            <div class="credit-payment__header">

                <div class="credit-payment__heading">

                    <span class="credit-payment__title">
                        ${escapeHTML(
                            card.name
                        )}
                    </span>    
                
                    <span class="credit-payment__label">
                        Pay invoice
                    </span>
                    

                </div>

                <button
                    class="credit__close"
                    type="button"
                    data-payment-action="close"
                    aria-label="Cancel payment"
                >
                    <span>×</span>
                </button>

            </div>

            <div class="credit-payment__invoice">

                <span>
                    Closed invoice
                </span>

                <strong>
                    ${formatMoney(
                        amount
                    )}
                </strong>

            </div>

            <form class="credit-payment__form">

                <label class="credit-payment__field">

                    <span>
                        Pay from
                    </span>

                    <select
                        name="account"
                        required
                    >

                        <option value="">
                            Select account
                        </option>

                        ${accounts.map(
                            account => `
                                <option
                                    value="${escapeHTML(
                                        account.id
                                    )}"
                                >
                                    ${escapeHTML(
                                        account.name ||
                                        account.id
                                    )}
                                </option>
                            `
                        ).join("")}

                    </select>

                </label>

                <div class="credit-payment__actions">

                    <button
                        type="button"
                        class="credit-payment__cancel"
                        data-payment-action="close"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        class="credit-payment__pay"
                    >
                        Pay
                    </button>

                </div>

            </form>
        `;
    }

    function bindPayment(
        deckCard,
        cardId,
        amount
    ) {
        const payment =
            deckCard.querySelector(
                ".credit-payment"
            );

        if (!payment) {
            return;
        }

        payment.onclick =
            event => {
                const action =
                    event.target.closest(
                        "[data-payment-action]"
                    );

                if (!action) {
                    return;
                }

                if (
                    action.dataset.paymentAction ===
                    "close"
                ) {
                    close(
                        cardId
                    );
                }
            };

        payment.onsubmit =
            event => {
                event.preventDefault();

                const form =
                    event.target;

                const formData =
                    new FormData(
                        form
                    );

                const accountId =
                    String(
                        formData.get(
                            "account"
                        ) || ""
                    );

                if (!accountId) {
                    return;
                }

                updateCurrentMonth(
                    month => {
                        if (
                            !month.accounts?.[
                                accountId
                            ]
                        ) {
                            return;
                        }

                        const card =
                            month.credit?.[
                                cardId
                            ];

                        if (!card) {
                            return;
                        }

                        if (
                            card.invoiceStatus !==
                                "closed" &&
                            card.invoiceStatus !==
                                "overdue"
                        ) {
                            return;
                        }

                        if (!Array.isArray(
                            month.transactions
                        )) {
                            month.transactions =
                                [];
                        }

                        const ids =
                            month.transactions
                                .map(
                                    transaction =>
                                        Number(
                                            transaction.id
                                        )
                                )
                                .filter(
                                    id =>
                                        Number.isFinite(
                                            id
                                        )
                                );

                        const nextId =
                            ids.length
                                ? Math.max(
                                    ...ids
                                ) + 1
                                : 1;

                        const today =
                            new Date()
                                .toISOString()
                                .slice(
                                    0,
                                    10
                                );

                        month.transactions.push({
                            id:
                                String(
                                    nextId
                                ),

                            date:
                                today,

                            description:
                                `Credit Payment • ${card.name}`,

                            group:
                                "Credit",

                            account:
                                accountId,

                            type:
                                "debit",

                            amount:
                                -amount,

                            installments:
                                "one-time"
                        });

                        card.initialBalance =
                            0;

                        card.openInvoice =
                            0;

                        card.invoiceStatus =
                            "paid";
                    }
                );

                close(
                    cardId
                );
            };
    }

    return {
        open,
        close
    };
}