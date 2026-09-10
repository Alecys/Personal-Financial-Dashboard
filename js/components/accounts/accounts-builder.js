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

    const variation =
        calculateVariation(
            account.initialBalance,
            balance
        );

    return `

        <article
            class="account-card"
            data-account-id="${escapeHTML(id)}"
        >

            <div class="account-header">

                <div>

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

                <button
                    class="account-edit"
                    type="button"
                    data-action="edit"
                    aria-label="Edit account"
                    title="Edit account"
                >
                    ✎
                </button>

            </div>

            <div class="account-value-row">

                <div class="account-value">

                    ${formatMoney(
                        balance
                    )}

                </div>

                ${renderVariation(
                    variation
                )}

            </div>

            <div class="account-footer">

                <span>
                    Opening balance
                </span>

                <span>
                    ${formatMoney(
                        account.initialBalance
                    )}
                </span>

            </div>

        </article>

    `;

}


function calculateAccountBalance(
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

    return (
        initialBalance +
        transactionTotal
    );

}


function calculateVariation(
    initialBalance,
    currentBalance
) {

    const initial =
        Number(
            initialBalance || 0
        );

    const current =
        Number(
            currentBalance || 0
        );

    if (initial === 0) {
        return null;
    }

    return (
        (
            (current - initial) /
            Math.abs(initial)
        ) * 100
    );

}


function renderVariation(
    variation
) {

    if (
        variation === null ||
        !Number.isFinite(variation)
    ) {
        return "";
    }

    if (variation === 0) {

        return `

            <div class="account-variation neutral">

                <span class="account-variation-symbol">
                    —
                </span>

                <span>
                    0.0%
                </span>

            </div>

        `;

    }

    const positive =
        variation > 0;

    const symbol =
        positive
            ? "+"
            : "−";

    const className =
        positive
            ? "positive"
            : "negative";

    return `

        <div
            class="account-variation ${className}"
        >

            <span class="account-variation-symbol">
                ${symbol}
            </span>

            <span>
                ${Math.abs(
                    variation
                ).toFixed(1)}%
            </span>

        </div>

    `;

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