import { getState } from "../../core/store.js";
import { escapeHTML } from "../../core/formatters.js";

export function buildTransactionForm(
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
            data-transaction-form
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
                        transaction.description ?? ""
                    )}"
                    data-transaction-field="description"
                >

            </label>

            <label
                class="transaction-edit-field"
            >

                <span>
                    Grupo
                </span>

                <select
                    data-transaction-field="group"
                >

                    <option
                        value=""
                        ${!transaction.group
                            ? "selected"
                            : ""
                        }
                    >
                        Selecione...
                    </option>

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
                    data-transaction-field="account"
                >

                    <option
                        value=""
                        ${!transaction.account
                            ? "selected"
                            : ""
                        }
                    >
                        Selecione...
                    </option>

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
                    data-transaction-field="date"
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
                    value="${transaction.amount ?? ""}"
                    data-transaction-field="amount"
                >

            </label>

        </div>

    `;

}

export function buildTransactionActions(
    includeDelete = false
) {

    return `

        <div
            class="transaction-edit-area"
        >

            <button
                class="transaction-edit transaction-save"
                data-transaction-form-save
                aria-label="Salvar movimentação"
                title="Salvar movimentação"
            >
                ✓
            </button>

            ${
                includeDelete
                    ? `
                        <button
                            class="transaction-edit transaction-delete"
                            data-transaction-form-delete
                            aria-label="Remover movimentação"
                            title="Remover movimentação"
                        >
                            🗑
                        </button>
                    `
                    : ""
            }

        </div>

    `;

}

export function getTransactionFormValues(
    transactionElement
) {

    const fields =
        transactionElement.querySelectorAll(
            "[data-transaction-field]"
        );

    return Object.fromEntries(
        Array.from(fields)
            .map(
                field => [
                    field.dataset.transactionField,
                    field.value
                ]
            )
    );

}

export function bindTransactionForm(
    transactionElement,
    onSave,
    options = {}
) {

    const saveButton =
        transactionElement.querySelector(
            "[data-transaction-form-save]"
        );

    const deleteButton =
        transactionElement.querySelector(
            "[data-transaction-form-delete]"
        );

    let saved = false;

    function save() {

        if (saved) {
            return;
        }

        const values =
            getTransactionFormValues(
                transactionElement
            );

        const result =
            onSave(values);

        if (result === false) {
            return;
        }

        saved = true;

        document.removeEventListener(
            "pointerdown",
            handleOutsideClick
        );

    }

    function remove() {

        if (saved) {
            return;
        }

        if (!options.onDelete) {
            return;
        }

        saved = true;

        document.removeEventListener(
            "pointerdown",
            handleOutsideClick
        );

        options.onDelete();

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

        if (options.cancelOnOutside) {

            saved = true;

            transactionElement.remove();

            document.removeEventListener(
                "pointerdown",
                handleOutsideClick
            );

            return;

        }

        save();

    }

    saveButton?.addEventListener(
        "click",
        save
    );

    deleteButton?.addEventListener(
        "click",
        remove
    );

    document.addEventListener(
        "pointerdown",
        handleOutsideClick
    );

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