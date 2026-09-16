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

        ${createEditHeader(account)}

        <div class="account-main">

            <div class="account-edit-form">

                <label class="account-edit-field">

                    <span>
                        Name
                    </span>

                    <input
                        class="system-input"
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
                        class="system-input"
                        type="number"
                        step="0.01"
                        value="${Number(
                            account.initialBalance || 0
                        )}"
                        data-account-field="initialBalance"
                    >

                </label>

            </div>

        </div>

        <div class="account-footer">

            <div class="system-actions">

                <button
                    type="button"
                    class="system-cancel"
                    data-account-action="cancel"
                    aria-label="Cancel"
                    title="Cancel"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    class="system-save"
                    data-account-action="save"
                    aria-label="Save account"
                    title="Save account"
                >
                    Save
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

function createEditHeader(
    account
) {

    return `

        <div class="account-header">

            <div class="account-heading">

                <div class="account-name">
                    ${escapeHTML(
                        account.name
                    )}
                </div>

                <div class="account-type">
                    Edit account
                </div>

            </div>

            <div class="account-actions">

                <button
                    class="system-action"
                    type="button"
                    data-account-action="cancel"
                    aria-label="Cancel editing"
                    title="Cancel editing"
                >
                    <span>×</span>
                </button>

            </div>

        </div>

    `;

}

function bindEditEvents(
    accountElement,
    accountId
) {

    const saveButton =
        accountElement.querySelector(
            '[data-account-action="save"]'
        );

    const cancelButtons =
        accountElement.querySelectorAll(
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

    function cancel() {

        if (!finish()) {
            return;
        }

        cancelAccountEdit(
            accountElement
        );

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

        cancel();

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

    cancelButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                cancel
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
                month.accounts?.[
                    accountId
                ];

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