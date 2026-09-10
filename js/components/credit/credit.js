import { loadTemplate, loadStyle, createElement } from "../../core/component.js";
import { getCurrentMonth, subscribe } from "../../core/store.js";
import { formatShortDate, escapeHTML } from "../../core/formatters.js";
import { CreditCardStackedCards } from "./creditCard_stackedCards/creditCard_stackedCards.js";
import { createCreditCardFace } from "./creditCard_face/creditCard_face.js";
import { createCreditCardFlip, initializeCreditFlip } from "./creditCard_flip/creditCard_flip.js";
import { createCreditCardEdit, initializeCreditEdit } from "./creditCard_edit/creditCard_edit.js";
import { createCreditCardPayment, initializeCreditPayment } from "./creditCard_payment/creditCard_payment.js";

loadStyle("./css/components/credit.css");
loadStyle("./css/components/credit/creditCard_stackedCards/creditCard_stackedCards.css");
loadStyle("./css/components/credit/creditCard_face/creditCard_face.css");
loadStyle("./css/components/credit/creditCard_flip/creditCard_flip.css");
loadStyle("./css/components/credit/creditCard_edit/creditCard_edit.css");
loadStyle("./css/components/credit/creditCard_payment/creditCard_payment.css");

export async function Credit() {
    const template =
        await loadTemplate(
            "./js/components/credit/credit.html"
        );

    const section =
        createElement(template);

    const stage =
        section.querySelector(
            ".credit-card-stage"
        );

    let month =
        getCurrentMonth();

    let cards =
        getCards();

    function getCards() {
        return Object.entries(
            month?.credit || {}
        ).map(
            ([id, card]) => ({
                id,
                ...card
            })
        );
    }

    function getTransactionDate(
        transaction
    ) {
        return String(
            transaction.date || ""
        );
    }

    function getTransactionAmount(
        transaction
    ) {
        return Number(
            transaction.amount || 0
        );
    }

    function getInvoiceData(
        card
    ) {
        const closingDay =
            Number(
                card.closingDay || 0
            );

        const transactions =
            (
                month?.transactions ||
                []
            ).filter(
                transaction =>
                    transaction.account ===
                    card.id
            );

        const beforeClosing =
            transactions.filter(
                transaction => {
                    const date =
                        getTransactionDate(
                            transaction
                        );

                    const day =
                        Number(
                            date.split("-")[2]
                        );

                    return (
                        day <
                        closingDay
                    );
                }
            );

        const afterClosing =
            transactions.filter(
                transaction => {
                    const date =
                        getTransactionDate(
                            transaction
                        );

                    const day =
                        Number(
                            date.split("-")[2]
                        );

                    return (
                        day >=
                        closingDay
                    );
                }
            );

        const calculatedClosedInvoice =
            Number(
                card.initialBalance || 0
            ) +
            beforeClosing.reduce(
                (
                    total,
                    transaction
                ) =>
                    total +
                    getTransactionAmount(
                        transaction
                    ),
                0
            );

        const invoicePaid =
            Boolean(
                card.invoicePaid
            );

        const paidInvoiceAmount =
            Math.abs(
                Number(
                    card.paidInvoiceAmount || 0
                )
            );

        const closedInvoice =
            invoicePaid &&
            paidInvoiceAmount > 0
                ? -paidInvoiceAmount
                : calculatedClosedInvoice;

        const currentInvoice =
            afterClosing.reduce(
                (
                    total,
                    transaction
                ) =>
                    total +
                    getTransactionAmount(
                        transaction
                    ),
                0
            );

        return {
            closedInvoice,
            currentInvoice,
            invoiceClosed:
                new Date().getDate() >=
                closingDay,
            invoicePaid:
                invoicePaid &&
                paidInvoiceAmount > 0
        };
    }

    function renderCard(
        card
    ) {
        const {
            closedInvoice,
            currentInvoice,
            invoiceClosed,
            invoicePaid
        } =
            getInvoiceData(
                card
            );

        const faceInvoice =
            invoiceClosed
                ? currentInvoice
                : closedInvoice;

        const isPaid =
            invoicePaid;

        const used =
            isPaid
                ? Math.abs(
                    currentInvoice
                )
                : Math.abs(
                    closedInvoice
                ) +
                Math.abs(
                    currentInvoice
                );

        const limit =
            Number(
                card.limit || 0
            );

        const usage =
            limit > 0
                ? Math.min(
                    (used / limit) * 100,
                    100
                )
                : 0;

        const available =
            Math.max(
                limit - used,
                0
            );

        const monthNumber =
            String(
                month.id?.split("-")[1] ||
                "01"
            ).padStart(
                2,
                "0"
            );

        const dueDate =
            `${month.year}-${monthNumber}-01`;

        const formattedDueDate =
            formatShortDate(
                dueDate
            ).replace(
                /^01 /,
                `${String(
                    card.dueDay
                ).padStart(
                    2,
                    "0"
                )} `
            );

        const formattedClosingDate =
            `${String(
                card.closingDay
            ).padStart(
                2,
                "0"
            )} ${
                formatShortDate(
                    `${month.year}-${monthNumber}-01`
                ).split(" ")[1] || ""
            }`;

        const face =
            createCreditCardFace({
                card,
                faceInvoice,
                limit,
                used,
                available,
                usage,
                formattedClosingDate,
                formattedDueDate
            });

        return `
            <article
                class="deck-card"
                data-card-id="${escapeHTML(
                    card.id
                )}"
            >

                <div
                    class="card-surface"
                    style="background: ${escapeHTML(
                        card.color || "#27272a"
                    )};"
                >

                    ${createCreditCardFlip({
                        face,
                        card,
                        currentInvoice:
                            closedInvoice,
                        invoiceClosed,
                        isPaid
                    })}

                    ${createCreditCardEdit()}

                    ${createCreditCardPayment()}

                </div>

            </article>
        `;
    }

    function handleAction(
        event
    ) {
        const button =
            event.target.closest(
                "[data-action]"
            );

        if (!button) {
            return;
        }

        const card =
            button.closest(
                ".deck-card"
            );

        if (!card) {
            return;
        }

        const cardId =
            card.dataset.cardId;

        if (!cardId) {
            return;
        }

        const action =
            button.dataset.action;

        if (
            action ===
            "edit"
        ) {
            creditEdit(
                cardId
            );
        }

        if (
            action ===
            "pay"
        ) {
            creditPayment(
                cardId
            );
        }
    }

    stage.addEventListener(
        "click",
        handleAction
    );

    const edit =
        initializeCreditEdit(
            stage
        );

    const payment =
        initializeCreditPayment({
            root:
                stage,

            getInvoice:
                getInvoiceData
        });

    function creditEdit(
        cardId
    ) {
        payment?.close(
            cardId
        );

        edit?.open(
            cardId
        );
    }

    function creditPayment(
        cardId
    ) {
        edit?.close(
            cardId
        );

        payment?.open(
            cardId
        );
    }

    const cardDeck =
        CreditCardStackedCards({
            root:
                stage,

            items:
                cards,

            renderCard,

            initialIndex:
                0,

            onSelect:
                cardId => {
                    edit?.close(
                        cardId
                    );

                    payment?.close(
                        cardId
                    );
                }
        });

    initializeCreditFlip(
        stage
    );

    subscribe(() => {
        month =
            getCurrentMonth();

        cards =
            getCards();

        cardDeck?.updateItems(
            cards
        );
    });

    return section;
}