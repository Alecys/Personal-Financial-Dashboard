import { updateCurrentMonth } from "../../data/store.js";
import { formatMoney, escapeHTML } from "../../core/formatters.js";


export function renderTransactions(container, transactions) {

    const items =
        transactions
            .map(renderTransaction)
            .join("");


    container.innerHTML = `

        <div class="panel">

            <div class="panel-header">

                <div>

                    <div class="panel-title">
                        Movimentações
                    </div>

                    <div class="panel-subtitle">
                        ${transactions.length} lançamentos
                    </div>

                </div>


                <button
                    class="transaction-add"
                    data-action="add"
                >
                    + Adicionar
                </button>

            </div>


            <div class="transactions-list">

                ${items}

            </div>

        </div>

    `;


    bindEvents(container);

}


function renderTransaction(transaction) {

    const positive =
        transaction.amount >= 0;

    const signal =
        positive ? "+" : "−";

    const amount =
        Math.abs(transaction.amount);

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
                            transaction.group || "Sem grupo"
                        )}

                        ·

                        ${escapeHTML(
                            transaction.account || "Sem conta"
                        )}

                    </div>

                </div>


                <div class="transaction-date">

                    ${escapeHTML(
                        transaction.date || "—"
                    )}

                </div>


                <div
                    class="
                        transaction-value
                        ${positive ? "positive" : "negative"}
                    "
                >

                    ${signal}
                    ${formatMoney(amount)}

                </div>

            </div>


            <button
                class="transaction-edit"
                data-action="edit"
                aria-label="Editar movimentação"
            >
                ✎
            </button>

        </article>

    `;

}


function bindEvents(container) {

    container.addEventListener(
        "click",
        event => {

            const action =
                event.target.closest(
                    "[data-action]"
                );


            if (!action) {
                return;
            }


            const transaction =
                action.closest(
                    "[data-transaction-id]"
                );


            if (
                action.dataset.action === "edit" &&
                transaction
            ) {

                openEdit(
                    transaction.dataset.transactionId
                );

                return;

            }


            if (
                action.dataset.action === "add"
            ) {

                addTransaction();

            }

        }
    );

}


function openEdit(id) {

    console.log(
        "Editar movimentação:",
        id
    );

}


function addTransaction() {

    const description =
        prompt("Descrição:");

    if (!description) {
        return;
    }


    const value =
        Number(
            prompt(
                "Valor (positivo = entrada / negativo = gasto):"
            )
        );


    if (
        !Number.isFinite(value) ||
        value === 0
    ) {

        return;

    }


    const group =
        prompt("Grupo:") || "";


    const account =
        prompt("Conta/cartão (opcional):") || "";


    const date =
        prompt("Data:") || "";


    updateCurrentMonth(
        month => {

            const nextId =
                month.transactions.length
                    ? Math.max(
                        ...month.transactions.map(
                            transaction =>
                                Number(transaction.id) || 0
                        )
                    ) + 1
                    : 1;


            month.transactions.push({

                id: nextId,

                date,

                description,

                group,

                account,

                amount: value

            });

        }
    );


    window.location.reload();

}