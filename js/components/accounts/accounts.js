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

import {
    openAccountTransfer
} from "./accounts-transfer.js";


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

            const editButton =
                event.target.closest(
                    '[data-action="edit"]'
                );

            if (editButton) {

                const accountElement =
                    editButton.closest(
                        "[data-account-id]"
                    );

                openAccountEdit(
                    accountElement
                );

                return;

            }

            const transferButton =
                event.target.closest(
                    '[data-action="transfer"]'
                );

            if (transferButton) {

                const accountElement =
                    transferButton.closest(
                        "[data-account-id]"
                    );

                openAccountTransfer(
                    accountElement
                );

            }

        }
    );

    window.addEventListener(
        "finance-account-edit-cancel",
        refresh
    );

    window.addEventListener(
        "finance-account-transfer-finish",
        refresh
    );

    window.addEventListener(
        "finance-account-transfer-cancel",
        refresh
    );

    refresh();

    subscribe(() => {
        refresh();
    });

    return element;

}