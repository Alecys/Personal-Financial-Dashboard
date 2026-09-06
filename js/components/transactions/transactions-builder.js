import { formatMoney, formatShortDate, escapeHTML } from "../../core/formatters.js";

export function buildTransactions(
    element,
    month,
    sortOrder = "asc"
) {

    const transactions =
        [
            ...(month.transactions || [])
        ].sort(
            (a, b) => {

                const dateA =
                    a.date ||
                    "9999-12-31";

                const dateB =
                    b.date ||
                    "9999-12-31";

                return sortOrder === "asc"
                    ? dateA.localeCompare(dateB)
                    : dateB.localeCompare(dateA);

            }
        );

    const list =
        element.querySelector(
            "[data-transactions-list]"
        );

    const count =
        element.querySelector(
            "[data-transactions-count]"
        );

    count.textContent =
        `${transactions.length} transactions`;

    list.innerHTML =
        transactions
            .map(
                renderTransaction
            )
            .join("");

}

export function renderTransaction(
    transaction
) {

    const positive =
        transaction.amount >= 0;

    const signal =
        positive
            ? "+"
            : "−";

    return `

        <article
            class="transaction"
            data-transaction-id="${transaction.id}"
        >

            <div class="transaction-content">

                <div class="transaction-main">

                    <div class="transaction-name">

                        ${escapeHTML(
                            transaction.description
                        )}

                    </div>

                    <div class="transaction-meta">

                        ${escapeHTML(
                            transaction.group ||
                            "No group"
                        )}

                        ·

                        ${escapeHTML(
                            transaction.account ||
                            "No account"
                        )}

                    </div>

                </div>

                <div class="transaction-date">

                    ${escapeHTML(
                        formatShortDate(
                            transaction.date
                        ) ||
                        "—"
                    )}

                </div>

                <div
                    class="
                        transaction-value
                        ${positive
                            ? "positive"
                            : "negative"
                        }
                    "
                >

                    ${signal}

                    ${formatMoney(
                        Math.abs(
                            transaction.amount
                        )
                    )}

                </div>

            </div>

            <div class="transaction-edit-area">

                <button
                    class="transaction-edit"
                    data-transactions-action="edit"
                    aria-label="Edit transaction"
                    title="Edit transaction"
                >

                    ✎

                </button>

            </div>

        </article>

    `;

}