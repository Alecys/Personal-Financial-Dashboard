import { loadTemplate, loadStyle, createElement } from "../../core/component.js";
import { getCurrentMonth, subscribe } from "../../core/store.js";
import { formatMoney } from "../../core/formatters.js";

export async function Credit() {
    loadStyle(
        "./css/components/credit.css"
    );

    const html =
        await loadTemplate(
            "./js/components/credit/credit.html"
        );

    const element =
        createElement(html);

    function refresh() {
        const month =
            getCurrentMonth();

        const value =
            month.credit?.value ||
            0;

        const monthName =
            month.credit?.month ||
            "Próximo mês";

        element
            .querySelector(
                '[data-field="value"]'
            )
            .textContent =
                formatMoney(value);

        element
            .querySelector(
                '[data-field="month"]'
            )
            .textContent =
                monthName;
    }

    refresh();

    subscribe(() => {
        refresh();
    });

    return element;
}