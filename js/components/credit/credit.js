import { formatMoney } from "../../core/formatters.js";


export function renderCredit(
    container,
    month
) {

    const credit =
        month.credit;


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
                            ${credit?.month || "—"}
                        </div>

                    </div>


                    <div class="credit-value">

                        ${formatMoney(
                            credit?.value || 0
                        )}

                    </div>

                </div>

            </div>

        </section>

    `;

}