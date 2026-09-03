import { loadTemplate, loadStyle, createElement } from "../../core/component.js";
import { getCurrentMonth, subscribe } from "../../core/store.js";
import { buildTransactions } from "./transactions-builder.js";
import { bindTransactionsEvents } from "./transactions-events.js";

const SORT_STORAGE_KEY =
    "finance-transactions-sort";

export async function Transactions() {

    loadStyle(
        "./css/components/transactions.css"
    );

    const html =
        await loadTemplate(
            "./js/components/transactions/transactions.html"
        );

    const element =
        createElement(html);

    let sortOrder =
        localStorage.getItem(
            SORT_STORAGE_KEY
        ) || "asc";

    bindTransactionsEvents(
        element,
        () => {

            sortOrder =
                sortOrder === "asc"
                    ? "desc"
                    : "asc";

            localStorage.setItem(
                SORT_STORAGE_KEY,
                sortOrder
            );

            refresh();

        }
    );

    function refresh() {

        const month =
            getCurrentMonth();

        buildTransactions(
            element,
            month,
            sortOrder
        );

    }

    refresh();

    subscribe(() => {
        refresh();
    });

    return element;

}