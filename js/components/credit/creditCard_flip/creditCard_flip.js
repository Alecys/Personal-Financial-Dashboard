import { formatMoney, escapeHTML } from "../../../core/formatters.js";

let initialized = false;

export function createCreditCardFlip({
    face,
    card,
    currentInvoice,
    invoiceClosed = false,
    isPaid = false,
    invoiceStatus = "open"
}) {

    const invoiceValue =
        Number(
            currentInvoice || 0
        );

    const hasInvoice =
        invoiceValue !== 0;

    const status =
        isPaid
            ? "Already paid"
            : invoiceStatus ===
                "overdue"
                ? "Overdue"
                : hasInvoice &&
                    (
                        invoiceStatus ===
                            "closed" ||
                        invoiceStatus ===
                            "overdue"
                    )
                    ? "Unpaid"
                    : invoiceStatus ===
                        "paid"
                        ? "Already paid"
                        : "Open";

    const showPayButton =
        (
            invoiceStatus ===
                "closed" ||
            invoiceStatus ===
                "overdue"
        ) &&
        hasInvoice &&
        !isPaid;

    return `
        <div
            class="flip"
            style="background: ${escapeHTML(
                card.color || "#27272a"
            )};"
        >

            <div class="flip__face">
                ${face}
            </div>

            <div class="flip__back">

                <div class="flip__back-top">

                    <div>

                        <div class="flip__brand">
                            ${escapeHTML(
                                card.name
                            )}
                        </div>

                        <div class="flip__label">
                            Statement
                        </div>

                    </div>

                    <div class="flip__actions">

                        <button
                            class="flip__button flip__edit"
                            type="button"
                            aria-label="Edit card"
                            data-action="edit"
                        >
                            <span>✎</span>
                        </button>

                        <button
                            class="flip__button flip__button--back"
                            type="button"
                            aria-label="Flip card"
                            data-action="flip"
                            data-card-id="${escapeHTML(
                                card.id
                            )}"
                        >
                            <span>↗</span>
                        </button>

                    </div>

                </div>

                <div class="flip__content">

                    <div class="flip__invoice">

                        <span>
                            Closed invoice
                        </span>

                        <div class="display-value">
                            ${formatMoney(
                                invoiceValue
                            )}
                        </div>

                    </div>

                    <div class="flip__status">

                        <span class="flip__status-indicator"></span>

                        <span>
                            ${status}
                        </span>

                    </div>

                </div>

                <div class="flip__footer">

                    ${
                        showPayButton
                            ? `
                                <button
                                    class="flip__pay"
                                    type="button"
                                    data-action="pay"
                                >
                                    Pay
                                </button>
                            `
                            : ""
                    }

                </div>

            </div>

        </div>
    `;
}

export function creditFlip(
    cardId
) {

    if (!cardId) {
        return;
    }

    const card =
        document.querySelector(
            `.deck-card[data-card-id="${CSS.escape(
                String(cardId)
            )}"]`
        );

    if (!card) {
        return;
    }

    const flip =
        card.querySelector(
            ".flip"
        );

    if (!flip) {
        return;
    }

    flip.classList.toggle(
        "is-flipped"
    );

}

export function initializeCreditFlip(
    root
) {

    if (
        initialized ||
        !root
    ) {
        return;
    }

    initialized =
        true;

    root.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    '[data-action="flip"]'
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

            creditFlip(
                cardId
            );

        }
    );

}