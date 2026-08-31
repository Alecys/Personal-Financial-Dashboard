export function renderBalance(container, data) {

    container.innerHTML = `

        <section class="balance-section">

            <div class="balance-label">
                Patrimônio disponível
            </div>


            <div class="balance-value">
                R$ ${data.totalBalance.toLocaleString(
                    "pt-BR",
                    {
                        minimumFractionDigits: 2
                    }
                )}
            </div>


            <div class="balance-change">

                <span class="positive">
                    +3,42%
                </span>

                <span>
                    em relação ao início do mês
                </span>

            </div>

        </section>

    `;
}