import { formatMoney } from "../../core/formatters.js";
import { calculateAccountBalance } from "../../data/calculations.js";


export function renderAccounts(
    container,
    month
) {

    const accounts =
        Object.entries(month.accounts);


    const cards =
        accounts
            .map(([id, account]) => {

                const balance =
                    calculateAccountBalance(
                        {
                            ...account,
                            id
                        },
                        month.transactions
                    );


                return `

                    <article
                        class="account-card"
                        data-account-id="${id}"
                    >

                        <div class="account-view">

                            <div class="account-header">

                                <div>

                                    <div class="account-name">
                                        ${account.name}
                                    </div>

                                    <div class="account-type">
                                        ${account.type}
                                    </div>

                                </div>

                            </div>


                            <div class="account-value">

                                ${formatMoney(balance)}

                            </div>


                            <div class="account-footer">

                                <span>
                                    Saldo inicial
                                </span>

                                <span>
                                    ${formatMoney(account.initialBalance)}
                                </span>

                            </div>

                        </div>

                    </article>

                `;

            })
            .join("");


    container.innerHTML = `

        <section>

            <div class="section-label">
                Contas & cartões
            </div>

            <div class="accounts-grid">

                ${cards}

            </div>

        </section>

    `;

}