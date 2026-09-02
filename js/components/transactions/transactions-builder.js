import { formatMoney, escapeHTML } from "../../core/formatters.js";
import { bindTransactionsEvents } from "./transactions-events.js";

export function buildTransactions(
    element,
    month
) {

    const transactions =
        month.transactions || [];

    const list =
        element.querySelector(
            "[data-transactions-list]"
        );

    const count =
        element.querySelector(
            "[data-transactions-count]"
        );

    count.textContent =
        `${transactions.length} lançamentos`;

    list.innerHTML =
        transactions
            .map(
                renderTransaction
            )
            .join("");

    bindTransactionsEvents(
        element,
        month
    );

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

            <div class="transaction-main">

                <div class="transaction-name">

                    ${escapeHTML(
                        transaction.description
                    )}

                </div>

                <div class="transaction-meta">

                    ${escapeHTML(
                        transaction.group ||
                        "Sem grupo"
                    )}

                    ·

                    ${escapeHTML(
                        transaction.account ||
                        "Sem conta"
                    )}

                </div>

            </div>

            <div class="transaction-date">

                ${escapeHTML(
                    transaction.date ||
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

            <div
                class="transaction-edit-area"
            >

                <button
                    class="transaction-edit"
                    data-transactions-action="edit"
                    aria-label="Editar movimentação"
                >

                    ✎

                </button>

            </div>

        </article>

    `;

}