export function renderAccounts(container, accounts) {

    const cards = Object.values(accounts)
        .map(account => `

            <article class="account-card">

                <div class="account-header">

                    <span class="account-name">
                        ${account.name}
                    </span>

                    <span class="account-type">
                        ${account.type}
                    </span>

                </div>


                <div class="account-value">

                    R$
                    ${account.balance.toLocaleString(
                        "pt-BR",
                        {
                            minimumFractionDigits: 2
                        }
                    )}

                </div>


                <div class="account-footer">

                    <span>
                        Saldo inicial
                    </span>

                    <span>

                        R$
                        ${account.initialBalance.toLocaleString(
                            "pt-BR",
                            {
                                minimumFractionDigits: 2
                            }
                        )}

                    </span>

                </div>

            </article>

        `)
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