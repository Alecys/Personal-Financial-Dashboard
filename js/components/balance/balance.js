import { formatMoney } from "../../core/formatters.js";
import { calculateTotalBalance } from "../../data/calculations.js";


export function renderBalance(
    container,
    month
) {

    const total =
        calculateTotalBalance(
            month.accounts,
            month.transactions
        );


    container.innerHTML = `

        <section class="balance-section">

            <div class="balance-label">
                Patrimônio disponível
            </div>

            <div class="balance-value">
                ${formatMoney(total)}
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