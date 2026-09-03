import { loadTemplate, loadStyle, createElement } from "../../core/component.js";
import { getState, getCurrentMonth, setCurrentMonth, subscribe } from "../../core/store.js";
import { formatMonth } from "../../core/formatters.js";

export async function Header() {

    loadStyle(
        "./css/components/header.css"
    );

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

    const previousButton =
        element.querySelector(
            '[data-action="previous"]'
        );

    const nextButton =
        element.querySelector(
            '[data-action="next"]'
        );

    function refresh() {

        const month =
            getCurrentMonth();

        monthElement.textContent =
            formatMonth(month);

        updateButtons();

    }

    function updateButtons() {

        const state =
            getState();

        const currentId =
            state.currentMonth;

        const ids =
            Object.keys(
                state.months
            ).sort();

        const index =
            ids.indexOf(
                currentId
            );

        previousButton.disabled =
            index <= 0;

        nextButton.disabled =
            index >= ids.length - 1;

        previousButton.disabled =
        index <= 0;

        nextButton.disabled =
            index >= ids.length - 1;

        previousButton.textContent =
            previousButton.disabled
                ? "🔒"
                : "←";

        nextButton.textContent =
            nextButton.disabled
                ? "🔒"
                : "→";

    }

    function changeMonth(
        direction
    ) {

        const state =
            getState();

        const ids =
            Object.keys(
                state.months
            ).sort();

        const index =
            ids.indexOf(
                state.currentMonth
            );

        const nextIndex =
            index + direction;

        if (
            nextIndex < 0 ||
            nextIndex >= ids.length
        ) {
            return;
        }

        setCurrentMonth(
            ids[nextIndex]
        );

    }

    previousButton.addEventListener(
        "click",
        () => {
            changeMonth(-1);
        }
    );

    nextButton.addEventListener(
        "click",
        () => {
            changeMonth(1);
        }
    );

    refresh();

    subscribe(() => {
        refresh();
    });

    return element;

}