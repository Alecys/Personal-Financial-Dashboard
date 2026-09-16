import {
    getCurrentMonth,
    updateCurrentMonth
} from "../../core/store.js";

import {
    escapeHTML,
    formatMoney
} from "../../core/formatters.js";

import {
    calculateAccountBalance
} from "./accounts-builder.js";

export function openAccountTransfer(
    accountElement
) {

    if (!accountElement) {
        return;
    }

    const accountId =
        accountElement.dataset.accountId;

    if (!accountId) {
        return;
    }

    const month =
        getCurrentMonth();

    const account =
        month?.accounts?.[accountId];

    if (!account) {
        return;
    }

    if (
        accountElement.classList.contains(
            "account-transfer-mode"
        )
    ) {
        return;
    }

    if (
        accountElement.classList.contains(
            "account-editing"
        )
    ) {
        return;
    }

    const balance =
        calculateAccountBalance(
            accountId,
            account,
            month
        );

    accountElement.classList.add(
        "account-transfer-mode"
    );

    accountElement.innerHTML =
        createTransferForm(
            accountId,
            account,
            balance,
            month
        );

    const amountInput =
        accountElement.querySelector(
            '[data-transfer-field="amount"]'
        );

    amountInput?.focus();

    bindTransferEvents(
        accountElement,
        accountId
    );

}

function createTransferForm(
    accountId,
    account,
    balance,
    month
) {

    const accounts =
        Object.entries(
            month?.accounts || {}
        ).filter(
            ([id]) =>
                id !== accountId
        );

    return `

        <div class="account-header">

            <div class="account-heading">

                <div class="account-name">
                    ${escapeHTML(
                        account.name
                    )}
                </div>

                <div class="account-type">
                    Transfer
                </div>

            </div>

            <div class="account-actions">

                <button
                    type="button"
                    class="system-action"
                    data-transfer-action="cancel"
                    aria-label="Cancel transfer"
                    title="Cancel transfer"
                >
                    <span>×</span>
                </button>

            </div>

        </div>

        <div class="account-main">

            <div class="account-transfer-balance">
                
                <div class="account-value">
                    ${formatMoney(
                        balance
                    )}
                </div>

            </div>

            <div class="account-transfer-fields">

                <label class="account-transfer-field">

                    <span>
                        To
                    </span>

                    <select
                        class="system-input"
                        data-transfer-field="to"
                        required
                    >

                        <option value="">
                            Select account
                        </option>

                        ${accounts
                            .map(
                                ([id, target]) => `
                                    <option
                                        value="${escapeHTML(
                                            id
                                        )}"
                                    >
                                        ${escapeHTML(
                                            target.name ||
                                            id
                                        )}
                                    </option>
                                `
                            )
                            .join("")}

                    </select>

                </label>

                <label class="account-transfer-field">

                    <span>
                        Amount
                    </span>

                    <input
                        class="system-input"
                        type="number"
                        step="0.01"
                        min="0.01"
                        data-transfer-field="amount"
                        placeholder="0.00"
                        required
                    >

                </label>

            </div>

        </div>

        <div class="account-footer">

            <div class="system-actions">

                <button
                    type="button"
                    class="system-cancel"
                    data-transfer-action="cancel"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    class="system-save"
                    data-transfer-action="save"
                >
                    Transfer
                </button>

            </div>

        </div>

    `;

}

function bindTransferEvents(
    accountElement,
    accountId
) {

    const saveButton =
        accountElement.querySelector(
            '[data-transfer-action="save"]'
        );

    const cancelButtons =
        accountElement.querySelectorAll(
            '[data-transfer-action="cancel"]'
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

        closeAccountTransfer(
            accountElement
        );

        window.dispatchEvent(
            new CustomEvent(
                "finance-account-transfer-cancel"
            )
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
                !saveTransfer(
                    accountElement,
                    accountId
                )
            ) {
                return;
            }

            if (!finish()) {
                return;
            }

            closeAccountTransfer(
                accountElement
            );

            window.dispatchEvent(
                new CustomEvent(
                    "finance-account-transfer-finish"
                )
            );

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

function saveTransfer(
    accountElement,
    accountId
) {

    const toInput =
        accountElement.querySelector(
            '[data-transfer-field="to"]'
        );

    const amountInput =
        accountElement.querySelector(
            '[data-transfer-field="amount"]'
        );

    if (
        !toInput ||
        !amountInput
    ) {
        return false;
    }

    const to =
        String(
            toInput.value || ""
        ).trim();

    const amount =
        Number(
            amountInput.value
        );

    if (!to) {

        toInput.focus();

        return false;

    }

    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        amountInput.focus();

        return false;

    }

    if (
        to === accountId
    ) {

        toInput.focus();

        return false;

    }

    updateCurrentMonth(
        month => {

            if (
                !month.accounts?.[
                    accountId
                ]
            ) {
                return;
            }

            if (
                !month.accounts?.[
                    to
                ]
            ) {
                return;
            }

            if (
                !Array.isArray(
                    month.transfers
                )
            ) {

                month.transfers =
                    [];

            }

            const ids =
                month.transfers
                    .map(
                        transfer =>
                            Number(
                                transfer.id
                            )
                    )
                    .filter(
                        id =>
                            Number.isFinite(
                                id
                            )
                    );

            const nextId =
                ids.length
                    ? Math.max(
                        ...ids
                    ) + 1
                    : 1;

            const now =
                new Date();

            const today =
                `${now.getFullYear()}-${String(
                    now.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                )}-${String(
                    now.getDate()
                ).padStart(
                    2,
                    "0"
                )}`;

            month.transfers.push({

                id:
                    String(
                        nextId
                    ),

                date:
                    today,

                from:
                    accountId,

                to,

                amount

            });

        }
    );

    return true;

}

function closeAccountTransfer(
    accountElement
) {

    accountElement.classList.remove(
        "account-transfer-mode"
    );

}