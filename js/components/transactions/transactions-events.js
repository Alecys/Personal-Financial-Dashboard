import { openTransactionEdit } from "./transactions-edit.js";
import { addTransaction } from "./transactions-add.js";

export function bindTransactionsEvents(
    element,
    onSort
) {

    element.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-transactions-action]"
                );

            if (!button) {
                return;
            }

            const action =
                button.dataset
                    .transactionsAction;

            if (
                action === "edit"
            ) {

                openTransactionEdit(
                    button.closest(
                        "[data-transaction-id]"
                    )
                );

            }

            if (
                action === "add"
            ) {

                addTransaction(
                    element
                );

            }

            if (
                action === "sort"
            ) {

                onSort();

            }

        }
    );

}