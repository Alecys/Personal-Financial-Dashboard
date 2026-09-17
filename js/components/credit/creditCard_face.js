import { formatMoney, escapeHTML } from "../../core/formatters.js";

export function createCreditCardFace({
    card,
    faceInvoice,
    limit,
    used,
    available,
    usage,
    formattedClosingDate,
    formattedDueDate
}) {
    return `
        <div class="card-top">

            <div>
                <div class="card-brand">
                    ${escapeHTML(card.name)}
                </div>

                <div class="card-number">
                    •••• ${escapeHTML(
                        card.lastFour || "0000"
                    )}
                </div>
            </div>

            <button
                class="card-flip"
                type="button"
                aria-label="Flip card"
                data-action="flip"
            >
                <span>↗</span>
            </button>

        </div>

        <div class="card-content">

            <div class="display-value">
                ${formatMoney(faceInvoice)}
            </div>

            <div class="card-limit">

                <div class="card-limit-info">

                    <span>
                        Credit limit
                    </span>

                    <span>
                        ${formatMoney(limit)}
                    </span>

                </div>

                <div class="card-limit-wrapper">

                    <div class="card-limit-bar">

                        <span
                            class="card-limit-fill"
                            style="width: ${usage}%"
                        ></span>

                    </div>

                    <div class="card-limit-tooltip">

                        <div>

                            <span>
                                Spent
                            </span>

                            <strong>
                                ${formatMoney(used)}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Available
                            </span>

                            <strong>
                                ${formatMoney(available)}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        <div class="card-footer">

            <div class="card-date">

                <span>
                    Closing
                </span>

                <span>
                    ${formattedClosingDate}
                </span>

            </div>

            <div class="card-date">

                <span>
                    Due
                </span>

                <span>
                    ${formattedDueDate}
                </span>

            </div>

        </div>

        <div class="card-decoration"></div>
    `;
}