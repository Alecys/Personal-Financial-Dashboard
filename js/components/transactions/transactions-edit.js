import { getState, updateCurrentMonth } from "../../core/store.js";
import { escapeHTML } from "../../core/formatters.js";
import { renderTransaction } from "./transactions-builder.js";

export function openTransactionEdit(
    transactionElement,
    month
) {

    const transactionId =
        transactionElement.dataset
            .transactionId;

    const transaction =
        month.transactions.find(
            item =>
                String(item.id) ===
                String(transactionId)
        );

    if (!transaction) {

        return;

    }

    transactionElement
        .classList
        .add(
            "transaction-editing"
        );

    transactionElement.innerHTML =
        buildTransactionEdit(
            transaction,
            month
        );

    bindTransactionEdit(
        transactionElement,
        transaction,
        month
    );

}

function buildTransactionEdit(
    transaction,
    month
) {

    const state =
        getState();

    const groups =
        state.groups || [];

    const accounts =
        Object.values(
            month.accounts || {}
        );

    return `

        <div
            class="transaction-edit-form"
            data-transaction-edit-form
        >

            <label
                class="transaction-edit-field"
            >

                <span>
                    Descrição
                </span>

                <input
                    type="text"
                    value="${escapeHTML(
                        transaction.description || ""
                    )}"
                    data-transaction-edit-field="description"
                >

            </label>


            <label
                class="transaction-edit-field"
            >

                <span>
                    Grupo
                </span>

                <select
                    data-transaction-edit-field="group"
                >

                    ${groups
                        .map(
                            group => `
                                <option
                                    value="${escapeHTML(group)}"
                                    ${group === transaction.group
                                        ? "selected"
                                        : ""
                                    }
                                >
                                    ${escapeHTML(group)}
                                </option>
                            `
                        )
                        .join("")
                    }

                </select>

            </label>


            <label
                class="transaction-edit-field"
            >

                <span>
                    Conta
                </span>

                <select
                    data-transaction-edit-field="account"
                >

                    ${accounts
                        .map(
                            account => `
                                <option
                                    value="${escapeHTML(account.name)}"
                                    ${account.name === transaction.account
                                        ? "selected"
                                        : ""
                                    }
                                >
                                    ${escapeHTML(account.name)}
                                </option>
                            `
                        )
                        .join("")
                    }

                </select>

            </label>


            <label
                class="transaction-edit-field"
            >

                <span>
                    Data
                </span>

                <input
                    type="date"
                    value="${convertDateToInput(
                        transaction.date,
                        month
                    )}"
                    data-transaction-edit-field="date"
                >

            </label>


            <label
                class="transaction-edit-field"
            >

                <span>
                    Valor
                </span>

                <input
                    type="number"
                    step="0.01"
                    value="${Number(
                        transaction.amount || 0
                    )}"
                    data-transaction-edit-field="amount"
                >

            </label>

        </div>


        <div
            class="transaction-edit-area"
        >

            <button
                class="transaction-edit transaction-save"
                data-transaction-edit-save
                aria-label="Salvar movimentação"
            >

                ✓

            </button>

        </div>

    `;

}

function convertDateToInput(
    date,
    month
) {

    if (!date) {

        return "";

    }

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            date
        )
    ) {

        return date;

    }

    const match =
        date.match(
            /^(\d{2})\s+([A-Z]{3})$/i
        );

    if (!match) {

        return "";

    }

    const months = {
        JAN: "01",
        FEV: "02",
        MAR: "03",
        ABR: "04",
        MAI: "05",
        JUN: "06",
        JUL: "07",
        AGO: "08",
        SET: "09",
        OUT: "10",
        NOV: "11",
        DEZ: "12"
    };

    const monthNumber =
        months[
            match[2].toUpperCase()
        ];

    if (!monthNumber) {

        return "";

    }

    return `${month.year}-${monthNumber}-${match[1]}`;

}

function bindTransactionEdit(
    transactionElement,
    transaction,
    month
) {

    const inputs =
        transactionElement.querySelectorAll(
            "[data-transaction-edit-field]"
        );

    const saveButton =
        transactionElement.querySelector(
            "[data-transaction-edit-save]"
        );

    let saved = false;

    function save() {

        if (saved) {

            return;

        }

        saved = true;

        document.removeEventListener(
            "pointerdown",
            handleOutsideClick
        );

        saveTransactionEdit(
            transaction,
            inputs,
            month,
            transactionElement
        );

    }

    function handleOutsideClick(
        event
    ) {

        if (
            transactionElement.contains(
                event.target
            )
        ) {

            return;

        }

        save();

    }

    saveButton.addEventListener(
        "click",
        save
    );

    document.addEventListener(
        "pointerdown",
        handleOutsideClick
    );

}

function saveTransactionEdit(
    transaction,
    inputs,
    month,
    transactionElement
) {

    const values =
        Object.fromEntries(
            Array.from(
                inputs
            ).map(
                input => [
                    input.dataset
                        .transactionEditField,
                    input.value
                ]
            )
        );

    const index =
        month.transactions.findIndex(
            item =>
                String(item.id) ===
                String(transaction.id)
        );

    if (
        index === -1
    ) {

        return;

    }

    updateCurrentMonth(
        currentMonth => {

            currentMonth.transactions[
                index
            ] = {

                ...currentMonth.transactions[
                    index
                ],

                description:
                    values.description,

                group:
                    values.group,

                account:
                    values.account,

                date:
                    values.date,

                amount:
                    Number(
                        values.amount
                    )

            };

        }
    );

    const updatedTransaction =
        month.transactions[index];

    transactionElement
        .classList
        .remove(
            "transaction-editing"
        );

    transactionElement.outerHTML =
        renderTransaction(
            updatedTransaction
        );

}