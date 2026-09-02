import { loadTemplate, loadStyle, createElement } from "../../core/component.js";
import { getCurrentMonth, subscribe } from "../../core/store.js";
import { formatMoney } from "../../core/formatters.js";
import { balanceConfig } from "./config.js";

export async function Balance() {
    loadStyle(balanceConfig.style);

    const html =
        await loadTemplate(
            "./js/components/balance/balance.html"
        );

    const element =
        createElement(html);

    function refresh() {
        const month =
            getCurrentMonth();

        const accounts =
            Object.values(
                month.accounts || {}
            );

        const balance =
            accounts.reduce(
                (total, account) =>
                    total +
                    Number(
                        account.balance || 0
                    ),
                0
            );

        const initialBalance =
            accounts.reduce(
                (total, account) =>
                    total +
                    Number(
                        account.initialBalance || 0
                    ),
                0
            );

        const change =
            initialBalance
                ? (
                    (
                        balance -
                        initialBalance
                    ) /
                    initialBalance
                ) *
                100
                : 0;

        element
            .querySelector(
                '[data-field="balance"]'
            )
            .textContent =
                formatMoney(balance);

        element
            .querySelector(
                '[data-field="change"]'
            )
            .textContent =
                `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
    }

    refresh();

    subscribe(() => {
        refresh();
    });

    return element;
}