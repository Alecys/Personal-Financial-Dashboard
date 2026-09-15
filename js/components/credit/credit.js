import { loadTemplate, loadStyle, createElement } from "../../core/component.js";
import { getCurrentMonth, updateCurrentMonth, subscribe } from "../../core/store.js";
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

    function getToday() {

        const now =
            new Date();

        return {
            year:
                now.getFullYear(),

            month:
                now.getMonth() + 1,

            day:
                now.getDate()
        };

    }

    function getTransactionDate(
        transaction
    ) {

        if (
            !transaction?.date ||
            !/^\d{4}-\d{2}-\d{2}$/.test(
                transaction.date
            )
        ) {
            return null;
        }

        const [
            year,
            month,
            day
        ] =
            transaction.date
                .split("-")
                .map(
                    Number
                );

        return {
            year,
            month,
            day
        };

    }

    function getTransactionAmount(
        transaction
    ) {

        return Number(
            transaction?.amount || 0
        );

    }

    function getTransactions(
        card
    ) {

        return (
            month?.transactions ||
            []
        ).filter(
            transaction =>
                transaction.account ===
                    card.id &&
                transaction.type ===
                    "credit"
        );

    }

    function getMonthId(
        year,
        monthNumber
    ) {

        return `${year}-${String(
            monthNumber
        ).padStart(
            2,
            "0"
        )}`;

    }

    function getCurrentCycle(
        card
    ) {

        const closingDay =
            Number(
                card.closingDay || 0
            );

        const today =
            getToday();

        if (
            closingDay <= 0
        ) {

            return {
                currentMonth:
                    getMonthId(
                        today.year,
                        today.month
                    ),

                previousMonth:
                    getMonthId(
                        today.year,
                        today.month
                    )
            };

        }

        /*
         * Before the closing day:
         *
         * The current cycle started on the
         * previous closing day.
         *
         * Example:
         *
         * Closing = 10
         * Today   = 08/09
         *
         * Current cycle:
         * 10/08 → 09/09
         *
         * Closed cycle:
         * previous cycle
         */

        if (
            today.day <
            closingDay
        ) {

            const previousDate =
                new Date(
                    today.year,
                    today.month - 2,
                    1
                );

            return {
                currentMonth:
                    getMonthId(
                        today.year,
                        today.month
                    ),

                previousMonth:
                    getMonthId(
                        previousDate.getFullYear(),
                        previousDate.getMonth() + 1
                    )
            };

        }

        /*
         * On or after the closing day:
         *
         * The current cycle starts today.
         *
         * Example:
         *
         * Closing = 10
         * Today   = 15/09
         *
         * Closed cycle:
         * 01/09 → 09/09
         *
         * Current cycle:
         * 10/09 → 09/10
         */

        const previousDate =
            new Date(
                today.year,
                today.month - 1,
                1
            );

        return {
            currentMonth:
                getMonthId(
                    today.year,
                    today.month
                ),

            previousMonth:
                getMonthId(
                    previousDate.getFullYear(),
                    previousDate.getMonth() + 1
                )
        };

    }

    function calculateInvoices(
        card
    ) {

        const transactions =
            getTransactions(
                card
            );

        const closingDay =
            Number(
                card.closingDay || 0
            );

        const today =
            getToday();

        let currentInvoice =
            0;

        let closedInvoice =
            Number(
                card.initialBalance || 0
            );

        let nextInvoice =
            0;

        if (
            closingDay <= 0
        ) {

            return {
                currentInvoice,
                closedInvoice,
                nextInvoice
            };

        }

        const currentMonthId =
            getMonthId(
                today.year,
                today.month
            );

        const currentMonthClosed =
            today.day >=
            closingDay;

        transactions.forEach(
            transaction => {

                const date =
                    getTransactionDate(
                        transaction
                    );

                if (!date) {
                    return;
                }

                const amount =
                    getTransactionAmount(
                        transaction
                    );

                const transactionMonthId =
                    getMonthId(
                        date.year,
                        date.month
                    );

                /*
                 * ------------------------------------------------
                 * CURRENT CALENDAR MONTH
                 * ------------------------------------------------
                 */

                if (
                    transactionMonthId ===
                    currentMonthId
                ) {

                    /*
                     * Before closing:
                     *
                     * 01 → closingDay - 1
                     * belongs to FACE.
                     *
                     * closingDay+
                     * belongs to next cycle.
                     */

                    if (
                        !currentMonthClosed
                    ) {

                        if (
                            date.day <
                            closingDay
                        ) {

                            currentInvoice +=
                                amount;

                        } else {

                            nextInvoice +=
                                amount;

                        }

                        return;

                    }

                    /*
                     * After closing:
                     *
                     * 01 → closingDay - 1
                     * belongs to FLIP.
                     *
                     * closingDay+
                     * belongs to FACE.
                     */

                    if (
                        date.day <
                        closingDay
                    ) {

                        closedInvoice +=
                            amount;

                    } else {

                        currentInvoice +=
                            amount;

                    }

                    return;

                }

                /*
                 * ------------------------------------------------
                 * PREVIOUS CALENDAR MONTH
                 * ------------------------------------------------
                 *
                 * When we are before the closing day,
                 * transactions from the previous month
                 * after the previous closing date belong
                 * to the current FACE invoice.
                 */

                const previousMonth =
                    new Date(
                        today.year,
                        today.month - 2,
                        1
                    );

                const previousMonthId =
                    getMonthId(
                        previousMonth.getFullYear(),
                        previousMonth.getMonth() + 1
                    );

                if (
                    transactionMonthId !==
                    previousMonthId
                ) {

                    return;

                }

                /*
                 * If today is before the closing day,
                 * the current invoice started on the
                 * previous month's closing day.
                 */

                if (
                    !currentMonthClosed &&
                    date.day >=
                    closingDay
                ) {

                    currentInvoice +=
                        amount;

                }

            }
        );

        return {
            currentInvoice,
            closedInvoice,
            nextInvoice
        };

    }

    function getInvoiceStatus(
        card,
        closedInvoice
    ) {

        const storedStatus =
            card.invoiceStatus ||
            "open";

        /*
         * Paid is persistent.
         *
         * Even if a late transaction is added
         * to the already-paid invoice, the status
         * remains paid and Pay does not return.
         */

        if (
            storedStatus ===
            "paid"
        ) {

            return "paid";

        }

        const hasClosedInvoice =
            Math.abs(
                Number(
                    closedInvoice || 0
                )
            ) > 0;

        if (
            !hasClosedInvoice
        ) {

            return "open";

        }

        if (
            storedStatus ===
            "overdue"
        ) {

            return "overdue";

        }

        if (
            storedStatus ===
            "closed"
        ) {

            const today =
                getToday();

            const dueDay =
                Number(
                    card.dueDay || 0
                );

            if (
                dueDay > 0 &&
                today.day >
                    dueDay
            ) {

                return "overdue";

            }

            return "closed";

        }

        return "open";

    }

    function syncCreditInvoices() {

        const currentMonth =
            getCurrentMonth();

        const changes =
            [];

        Object.entries(
            currentMonth.credit || {}
        ).forEach(
            ([cardId, card]) => {

                const calculated =
                    calculateInvoices(
                        card
                    );

                const openInvoice =
                    Number(
                        calculated.currentInvoice
                    );

                const nextInvoice =
                    Number(
                        calculated.nextInvoice
                    );

                const storedOpenInvoice =
                    Number(
                        card.openInvoice || 0
                    );

                const storedNextInvoice =
                    Number(
                        card.nextInvoice || 0
                    );

                if (
                    storedOpenInvoice !==
                        openInvoice ||
                    storedNextInvoice !==
                        nextInvoice
                ) {

                    changes.push({

                        cardId,

                        openInvoice,

                        nextInvoice

                    });

                }

            }
        );

        if (
            !changes.length
        ) {

            return false;

        }

        updateCurrentMonth(
            currentMonth => {

                changes.forEach(
                    change => {

                        const card =
                            currentMonth
                                .credit?.[
                                    change.cardId
                                ];

                        if (!card) {
                            return;
                        }

                        card.openInvoice =
                            change.openInvoice;

                        card.nextInvoice =
                            change.nextInvoice;

                    }
                );

            }
        );

        return true;

    }

    function getInvoiceData(
        card
    ) {

        const calculated =
            calculateInvoices(
                card
            );

        const currentInvoice =
            calculated.currentInvoice;

        const closedInvoice =
            calculated.closedInvoice;

        const nextInvoice =
            calculated.nextInvoice;

        const status =
            getInvoiceStatus(
                card,
                closedInvoice
            );

        return {

            status,

            openInvoice:
                currentInvoice,

            closedInvoice,

            nextInvoice,

            invoiceClosed:
                status === "closed" ||
                status === "overdue" ||
                status === "paid",

            invoicePaid:
                status === "paid"

        };

    }

    function renderCard(
        card
    ) {

        const {
            status,
            openInvoice,
            closedInvoice,
            nextInvoice,
            invoiceClosed,
            invoicePaid
        } =
            getInvoiceData(
                card
            );

        /*
         * FACE
         *
         * Always shows the invoice currently
         * being built.
         */

        const faceInvoice =
            openInvoice;

        /*
         * Credit usage:
         *
         * Closed invoice
         * + current invoice
         * + next invoice
         */

        const closedAmount =
            Math.abs(
                closedInvoice
            );

        const openAmount =
            Math.abs(
                openInvoice
            );

        const nextAmount =
            Math.abs(
                nextInvoice
            );

        const used =
            closedAmount +
            openAmount +
            nextAmount;

        const limit =
            Number(
                card.limit || 0
            );

        const usage =
            limit > 0
                ? Math.min(
                    (
                        used /
                        limit
                    ) * 100,
                    100
                )
                : 0;

        const available =
            Math.max(
                limit -
                used,
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

                        isPaid:
                            invoicePaid,

                        invoiceStatus:
                            status

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
            action === "edit"
        ) {

            creditEdit(
                cardId
            );

        }

        if (
            action === "pay"
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

    function refresh() {

        month =
            getCurrentMonth();

        cards =
            getCards();

        cardDeck?.updateItems(
            cards
        );

    }

    syncCreditInvoices();

    refresh();

    subscribe(() => {

        month =
            getCurrentMonth();

        syncCreditInvoices();

        month =
            getCurrentMonth();

        refresh();

    });

    return section;

}