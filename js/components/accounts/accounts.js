import { loadTemplate, loadStyle, createElement } from "../../core/component.js";
import { getCurrentMonth, subscribe } from "../../core/store.js";
import { formatMoney, escapeHTML } from "../../core/formatters.js";

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

    const container =
        element.querySelector(
            '[data-field="accounts"]'
        );

    function refresh() {
        const month =
            getCurrentMonth();

        const accounts =
            Object.entries(
                month.accounts || {}
            );

        container.innerHTML =
            accounts
                .map(
                    renderAccount
                )
                .join("");
    }

    refresh();

    subscribe(() => {
        refresh();
    });

    return element;
}

function renderAccount(
    [id, account]
) {

    return `

        <article
            class="account-card"
            data-account-id="${id}"
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
                    data-action="edit"
                >

                    ✎

                </button>

            </div>

            <div class="account-value">

                ${formatMoney(
                    account.balance
                )}

            </div>

            <div class="account-footer">

                <span>
                    Saldo inicial
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