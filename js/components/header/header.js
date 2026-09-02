import { loadTemplate, loadStyle, createElement } from "../../core/component.js";
import { getCurrentMonth, subscribe } from "../../core/store.js";
import { formatMonth } from "../../core/formatters.js";
import { headerConfig } from "./config.js";

export async function Header() {
    loadStyle(headerConfig.style);

    const html =
        await loadTemplate(
            "./js/components/header/header.html"
        );

    const element =
        createElement(html);

    const monthElement =
        element.querySelector(
            '[data-field="month"]'
        );

    function refresh() {
        const month =
            getCurrentMonth();

        monthElement.textContent =
            formatMonth(month);
    }

    refresh();

    subscribe(() => {
        refresh();
    });

    return element;
}