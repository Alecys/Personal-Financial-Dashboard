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

    return `

        <div
            class="transaction-edit-form"
            data-transaction-form
        >

            <label
                class="transaction-edit-field"
            >

                <span>
                    Description
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
                    Group
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
                        Select...
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
                    Account
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
                        No account
                    </option>

                    ${buildAccountOptions(
                        month,
                        transaction.account
                    )}

                    ${buildCreditOptions(
                        month,
                        transaction.account
                    )}

                </select>

            </label>

            <label
                class="transaction-edit-field"
            >

                <span>
                    Date
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
                    Amount
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

function buildAccountOptions(
    month,
    selectedId
) {

    const accounts =
        Object.entries(
            month.accounts || {}
        );

    if (!accounts.length) {
        return "";
    }

    return `

        <optgroup
            label="Accounts"
        >

            ${accounts
                .map(
                    ([id, account]) => `

                        <option
                            value="${escapeHTML(id)}"
                            data-source-type="account"
                            ${id === selectedId
                                ? "selected"
                                : ""
                            }
                        >
                            ${escapeHTML(
                                account.name
                            )}
                        </option>

                    `
                )
                .join("")
            }

        </optgroup>

    `;

}

function buildCreditOptions(
    month,
    selectedId
) {

    const credit =
        Object.entries(
            month.credit || {}
        );

    if (!credit.length) {
        return "";
    }

    return `

        <optgroup
            label="Credit Cards"
        >

            ${credit
                .map(
                    ([id, card]) => `

                        <option
                            value="${escapeHTML(id)}"
                            data-source-type="credit"
                            ${id === selectedId
                                ? "selected"
                                : ""
                            }
                        >
                            ${escapeHTML(
                                card.name
                            )}
                        </option>

                    `
                )
                .join("")
            }

        </optgroup>

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
                aria-label="Save transaction"
                title="Save transaction"
            >
                ✓
            </button>

            ${
                includeDelete
                    ? `
                        <button
                            class="transaction-edit transaction-delete"
                            data-transaction-form-delete
                            aria-label="Delete transaction"
                            title="Delete transaction"
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

export function getTransactionSource(
    transactionElement
) {

    const field =
        transactionElement.querySelector(
            '[data-transaction-field="account"]'
        );

    const option =
        field?.selectedOptions?.[0];

    if (!option) {
        return null;
    }

    return {

        id:
            option.value,

        type:
            option.dataset.sourceType || null

    };

}

export function validateTransaction(
    element,
    values
) {

    if (!values.description.trim()) {

        element
            .querySelector(
                '[data-transaction-field="description"]'
            )
            ?.focus();

        return false;

    }

    if (!values.group) {

        element
            .querySelector(
                '[data-transaction-field="group"]'
            )
            ?.focus();

        return false;

    }

    if (!values.date) {

        element
            .querySelector(
                '[data-transaction-field="date"]'
            )
            ?.focus();

        return false;

    }

    const amount =
        Number(
            values.amount
        );

    if (
        values.amount === "" ||
        !Number.isFinite(amount) ||
        amount === 0
    ) {

        element
            .querySelector(
                '[data-transaction-field="amount"]'
            )
            ?.focus();

        return false;

    }

    return true;

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
        FEB: "02",
        MAR: "03",
        APR: "04",
        MAY: "05",
        JUN: "06",
        JUL: "07",
        AUG: "08",
        SEP: "09",
        OCT: "10",
        NOV: "11",
        DEC: "12"
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