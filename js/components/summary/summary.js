import { loadTemplate, loadStyle, createElement } from "../../core/component.js";
import { getCurrentMonth, subscribe } from "../../core/store.js";
import { formatMoney } from "../../core/formatters.js";

export async function Summary() {
    loadStyle(
        "./css/components/summary.css"
    );

    const html =
        await loadTemplate(
            "./js/components/summary/summary.html"
        );

    const element =
        createElement(html);

    function refresh() {
        const month =
            getCurrentMonth();

        const transactions =
            month.transactions || [];

        const income =
            transactions
                .filter(
                    transaction =>
                        transaction.amount > 0
                )
                .reduce(
                    (
                        total,
                        transaction
                    ) =>
                        total +
                        transaction.amount,
                    0
                );

        const expenses =
            transactions
                .filter(
                    transaction =>
                        transaction.amount < 0
                )
                .reduce(
                    (
                        total,
                        transaction
                    ) =>
                        total +
                        Math.abs(
                            transaction.amount
                        ),
                    0
                );

        const result =
            income - expenses;

        element
            .querySelector(
                '[data-field="income"]'
            )
            .textContent =
                formatMoney(income);

        element
            .querySelector(
                '[data-field="expenses"]'
            )
            .textContent =
                formatMoney(expenses);

        element
            .querySelector(
                '[data-field="result"]'
            )
            .textContent =
                formatMoney(result);
    }

    refresh();

    subscribe(() => {
        refresh();
    });

    return element;
}