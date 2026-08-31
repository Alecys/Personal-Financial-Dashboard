export function renderTransactions(container, transactions) {

    const items = transactions
        .map(transaction => {

            const isIncome =
                transaction.type === "income";

            const signal =
                isIncome ? "+" : "−";

            const className =
                isIncome ? "positive" : "negative";


            return `

                <div class="transaction">

                    <div>

                        <div class="transaction-name">
                            ${transaction.description}
                        </div>

                        <div class="transaction-meta">

                            ${transaction.group}
                            ·
                            ${transaction.account}

                        </div>

                    </div>


                    <div class="transaction-date">
                        ${transaction.date}
                    </div>


                    <div class="transaction-value ${className}">

                        ${signal}
                        R$
                        ${transaction.amount.toLocaleString(
                            "pt-BR",
                            {
                                minimumFractionDigits: 2
                            }
                        )}

                    </div>

                </div>

            `;

        })
        .join("");


    container.innerHTML = `

        <div class="panel">

            <div class="panel-header">

                <div class="panel-title">
                    Movimentações
                </div>

                <div class="panel-subtitle">
                    ${transactions.length} lançamentos
                </div>

            </div>

            ${items}

        </div>

    `;
}