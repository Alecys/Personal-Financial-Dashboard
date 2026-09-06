import { getCurrentMonth, updateCurrentMonth } from "../../core/store.js";
import { buildTransactionForm, buildTransactionActions, bindTransactionForm, validateTransaction } from "./transactions-form.js";

export function openTransactionEdit(
    transactionElement
) {

    if (!transactionElement) {
        return;
    }

    const transactionId =
        transactionElement.dataset
            .transactionId;

    const month =
        getCurrentMonth();

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

    transactionElement.innerHTML = `

        <div class="transaction-content">

            ${buildTransactionForm(
                transaction,
                month
            )}

        </div>

        ${buildTransactionActions(true)}

    `;

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

            const currentMonth =
                getCurrentMonth();

            const index =
                currentMonth.transactions.findIndex(
                    item =>
                        String(item.id) ===
                        String(transactionId)
                );

            if (index === -1) {
                return false;
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

                    };

                }
            );

        },

        {

            onDelete: () => {

                updateCurrentMonth(
                    currentMonth => {

                        const index =
                            currentMonth.transactions.findIndex(
                                item =>
                                    String(item.id) ===
                                    String(transactionId)
                            );

                        if (
                            index === -1
                        ) {
                            return;
                        }

                        currentMonth.transactions
                            .splice(
                                index,
                                1
                            );

                    }
                );

            }

        }
    );

}