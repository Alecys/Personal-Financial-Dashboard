import {
    loadTemplate,
    loadStyle,
    createElement
} from "../../core/component.js";

import {
    getCurrentMonth,
    subscribe
} from "../../core/store.js";

import {
    buildAccounts
} from "./accounts-builder.js";

import {
    openAccountEdit
} from "./accounts-edit.js";


export async function Accounts() {

    loadStyle(
        "./css/components/accounts.css"
    );

    const html =
        await loadTemplate(
            "./js/components/accounts/accounts.html"
        );

    const element =
        createElement(html);

    function refresh() {

        const month =
            getCurrentMonth();

        buildAccounts(
            element,
            month
        );

    }

    element.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    '[data-action="edit"]'
                );

            if (!button) {
                return;
            }

            const accountElement =
                button.closest(
                    "[data-account-id]"
                );

            openAccountEdit(
                accountElement
            );

        }
    );

    window.addEventListener(
        "finance-account-edit-cancel",
        refresh
    );

    refresh();

    subscribe(() => {
        refresh();
    });

    return element;

}