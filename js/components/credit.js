export function renderCredit(container, credit) {

    container.innerHTML = `

        <section class="panel credit-panel">

            <div class="panel-header">

                <div class="panel-title">
                    Crédito futuro
                </div>

                <div class="panel-subtitle">
                    Próximo mês
                </div>

            </div>


            <div class="credit-content">

                <div class="credit-box">

                    <div class="credit-header">

                        <div class="credit-label">
                            Fatura prevista
                        </div>

                        <div class="credit-month">
                            ${credit.month}
                        </div>

                    </div>


                    <div class="credit-value">

                        R$
                        ${credit.value.toLocaleString(
                            "pt-BR",
                            {
                                minimumFractionDigits: 2
                            }
                        )}

                    </div>

                </div>

            </div>

        </section>

    `;
}