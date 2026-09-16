import {
    formatMoney,
    escapeHTML
} from "../../core/formatters.js";

export function buildAccounts(
    element,
    month
) {

    const container =
        element.querySelector(
            '[data-field="accounts"]'
        );

    if (!container) {
        return;
    }

    const accounts =
        Object.entries(
            month?.accounts || {}
        );

    container.innerHTML =
        accounts
            .map(
                ([id, account]) =>
                    renderAccount(
                        id,
                        account,
                        month
                    )
            )
            .join("");

}

function renderAccount(
    id,
    account,
    month
) {

    const balance =
        calculateAccountBalance(
            id,
            account,
            month
        );

    return `
        <article
            class="account-float"
        >
            <div
                class="account-card"
                data-account-id="${escapeHTML(id)}"
            >

                <div class="account-header">

                    <div class="account-heading">

                        <div class="account-name">
                            ${escapeHTML(
                                account.name
                            )}
                        </div>

                        <div class="account-type">
                            ${escapeHTML(
                                account.type
                            )}
                        </div>

                    </div>

                    <div class="account-actions">

                        <button
                            class="system-action account-edit-button"
                            type="button"
                            data-action="edit"
                            aria-label="Edit account"
                            title="Edit account"
                        >
                            <span>✎</span>
                        </button>

                        <button
                            class="system-action account-transfer-button"
                            type="button"
                            data-action="transfer"
                            aria-label="Transfer money"
                            title="Transfer money"
                        >
                            <span>⇄</span>
                        </button>

                    </div>

                </div>

                <div class="account-main">

                    <div class="account-value-row">

                        <div class="account-value">
                            ${formatMoney(
                                balance
                            )}
                        </div>

                    </div>

                </div>

                <div class="account-footer">

                    <div class="account-footer-info">

                        <span>
                            Opening balance
                        </span>

                        <span>
                            ${formatMoney(
                                account.initialBalance
                            )}
                        </span>

                    </div>

                </div>
            </div>
        </article>

    `;

}

export function calculateAccountBalance(
    accountId,
    account,
    month
) {

    const initialBalance =
        Number(
            account.initialBalance || 0
        );

    const transactions =
        month?.transactions || [];

    const transactionTotal =
        transactions.reduce(
            (total, transaction) => {

                if (
                    transactionBelongsToAccount(
                        transaction,
                        accountId,
                        account
                    )
                ) {

                    return total +
                        Number(
                            transaction.amount || 0
                        );

                }

                return total;

            },
            0
        );

    const transfers =
        month?.transfers || [];

    const transferTotal =
        transfers.reduce(
            (total, transfer) => {

                const amount =
                    Math.abs(
                        Number(
                            transfer.amount || 0
                        )
                    );

                if (
                    transfer.from ===
                    accountId
                ) {

                    return total - amount;

                }

                if (
                    transfer.to ===
                    accountId
                ) {

                    return total + amount;

                }

                return total;

            },
            0
        );

    return (
        initialBalance +
        transactionTotal +
        transferTotal
    );

}

function transactionBelongsToAccount(
    transaction,
    accountId,
    account
) {

    const transactionAccount =
        String(
            transaction?.account || ""
        ).trim();

    if (!transactionAccount) {
        return false;
    }

    if (
        transactionAccount ===
        String(accountId)
    ) {
        return true;
    }

    if (
        transactionAccount.toLowerCase() ===
        String(accountId).toLowerCase()
    ) {
        return true;
    }

    if (
        account?.name &&
        transactionAccount.toLowerCase() ===
        String(account.name).toLowerCase()
    ) {
        return true;
    }

    return false;

}