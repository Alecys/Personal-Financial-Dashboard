import { getCurrentMonth, updateCurrentMonth } from "../../core/store.js";
import { buildTransactionForm, buildTransactionActions, bindTransactionForm } from "./transactions-form.js";

export function addTransaction(
    element
) {

    const list =
        element.querySelector(
            "[data-transactions-list]"
        );

    if (!list) {
        return;
    }

    const existing =
        list.querySelector(
            "[data-transaction-new]"
        );

    if (existing) {

        existing
            .querySelector(
                '[data-transaction-field="description"]'
            )
            ?.focus();

        return;

    }

    const month =
        getCurrentMonth();

    const transaction = {

        description: "",

        group: "",

        account: "",

        date:
            getDefaultDate(month),

        amount: ""

    };

    const transactionElement =
        document.createElement(
            "article"
        );

    transactionElement.className =
        "transaction transaction-editing";

    transactionElement.dataset
        .transactionNew = "";

    transactionElement.innerHTML = `

        <div class="transaction-content">

            ${buildTransactionForm(
                transaction,
                month
            )}

        </div>

        ${buildTransactionActions(false)}

    `;

    list.prepend(
        transactionElement
    );

    bindTransactionForm(
        transactionElement,

        values => {

            if (
                !validateTransaction(
                    transactionElement,
                    values
                )
            ) {
                return false;
            }

            updateCurrentMonth(
                currentMonth => {

                    currentMonth.transactions
                        ||= [];

                    currentMonth.transactions.push({

                        id:
                            createTransactionId(
                                currentMonth.transactions
                            ),

                        description:
                            values.description
                                .trim(),

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

                    });

                }
            );

        },

        {
            cancelOnOutside: true
        }
    );

    transactionElement
        .querySelector(
            '[data-transaction-field="description"]'
        )
        ?.focus();

}

function validateTransaction(
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

function createTransactionId(
    transactions
) {

    const ids =
        transactions
            .map(
                transaction =>
                    Number(
                        transaction.id
                    )
            )
            .filter(
                id =>
                    Number.isFinite(id)
            );

    if (!ids.length) {
        return "1";
    }

    return String(
        Math.max(...ids) + 1
    );

}

function getDefaultDate(
    month
) {

    const now =
        new Date();

    const [year, monthNumber] =
        month.id.split("-");

    const currentYear =
        Number(year);

    const currentMonth =
        Number(monthNumber);

    if (
        now.getFullYear() ===
            currentYear &&
        now.getMonth() + 1 ===
            currentMonth
    ) {

        return [
            currentYear,
            String(
                currentMonth
            ).padStart(2, "0"),
            String(
                now.getDate()
            ).padStart(2, "0")
        ].join("-");

    }

    return `${year}-${monthNumber}-01`;

}