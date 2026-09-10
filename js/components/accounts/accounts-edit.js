import {
    getCurrentMonth,
    updateCurrentMonth
} from "../../core/store.js";

import {
    escapeHTML
} from "../../core/formatters.js";


export function openAccountEdit(
    accountElement
) {

    if (!accountElement) {
        return;
    }

    const accountId =
        accountElement.dataset.accountId;

    const month =
        getCurrentMonth();

    const account =
        month?.accounts?.[accountId];

    if (!account) {
        return;
    }

    if (
        accountElement.classList.contains(
            "account-editing"
        )
    ) {
        return;
    }

    accountElement.classList.add(
        "account-editing"
    );

    accountElement.innerHTML = `

        <div class="account-edit-form">

            <label class="account-edit-field">

                <span>
                    Name
                </span>

                <input
                    type="text"
                    value="${escapeHTML(
                        account.name ?? ""
                    )}"
                    data-account-field="name"
                >

            </label>

            <label class="account-edit-field">

                <span>
                    Opening balance
                </span>

                <input
                    type="number"
                    step="0.01"
                    value="${Number(
                        account.initialBalance || 0
                    )}"
                    data-account-field="initialBalance"
                >

            </label>

            <div class="account-edit-actions">

                <button
                    type="button"
                    class="account-edit-action account-save"
                    data-account-action="save"
                    aria-label="Save account"
                    title="Save account"
                >
                    ✓
                </button>

                <button
                    type="button"
                    class="account-edit-action account-cancel"
                    data-account-action="cancel"
                    aria-label="Cancel"
                    title="Cancel"
                >
                    ×
                </button>

            </div>

        </div>

    `;

    const nameInput =
        accountElement.querySelector(
            '[data-account-field="name"]'
        );

    nameInput?.focus();

    bindEditEvents(
        accountElement,
        accountId
    );

}


function bindEditEvents(
    accountElement,
    accountId
) {

    const saveButton =
        accountElement.querySelector(
            '[data-account-action="save"]'
        );

    const cancelButton =
        accountElement.querySelector(
            '[data-account-action="cancel"]'
        );

    let finished = false;


    function finish() {

        if (finished) {
            return false;
        }

        finished = true;

        document.removeEventListener(
            "pointerdown",
            handleOutsideClick
        );

        return true;

    }


    function handleOutsideClick(
        event
    ) {

        if (
            accountElement.contains(
                event.target
            )
        ) {
            return;
        }

        cancelAccountEdit(
            accountElement
        );

        finish();

    }


    saveButton?.addEventListener(
        "click",
        () => {

            if (
                saveAccount(
                    accountElement,
                    accountId
                )
            ) {

                finish();

            }

        }
    );


    cancelButton?.addEventListener(
        "click",
        () => {

            if (!finish()) {
                return;
            }

            cancelAccountEdit(
                accountElement
            );

        }
    );


    document.addEventListener(
        "pointerdown",
        handleOutsideClick
    );

}


function saveAccount(
    accountElement,
    accountId
) {

    const nameInput =
        accountElement.querySelector(
            '[data-account-field="name"]'
        );

    const balanceInput =
        accountElement.querySelector(
            '[data-account-field="initialBalance"]'
        );

    if (
        !nameInput ||
        !balanceInput
    ) {
        return false;
    }

    const name =
        nameInput.value.trim();

    const initialBalance =
        Number(
            balanceInput.value
        );


    if (!name) {

        nameInput.focus();

        return false;

    }


    if (
        !Number.isFinite(
            initialBalance
        )
    ) {

        balanceInput.focus();

        return false;

    }


    updateCurrentMonth(
        month => {

            const account =
                month.accounts?.[accountId];

            if (!account) {
                return;
            }

            account.name =
                name;

            account.initialBalance =
                initialBalance;

        }
    );

    return true;

}


function cancelAccountEdit(
    accountElement
) {

    accountElement.classList.remove(
        "account-editing"
    );

    window.dispatchEvent(
        new CustomEvent(
            "finance-account-edit-cancel"
        )
    );

}