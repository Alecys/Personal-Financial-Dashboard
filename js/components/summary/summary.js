import { formatMoney } from "../../core/formatters.js";
import {
    calculateIncome,
    calculateExpenses,
    calculateResult
} from "../../data/calculations.js";


export function renderSummary(
    container,
    month
) {

    const income =
        calculateIncome(
            month.transactions
        );


    const expenses =
        calculateExpenses(
            month.transactions
        );


    const result =
        calculateResult(
            month.transactions
        );


    container.innerHTML = `

        <div class="panel">

            <div class="panel-header">

                <div class="panel-title">
                    Resumo
                </div>

                <div class="panel-subtitle">
                    Mês atual
                </div>

            </div>


            <div class="summary">

                <div class="summary-row">

                    <span class="summary-label">
                        Total de entradas
                    </span>

                    <span class="summary-value positive">
                        ${formatMoney(income)}
                    </span>

                </div>


                <div class="summary-row">

                    <span class="summary-label">
                        Total de gastos
                    </span>

                    <span class="summary-value negative">
                        ${formatMoney(expenses)}
                    </span>

                </div>


                <div class="summary-row summary-total">

                    <span class="summary-label">
                        Resultado
                    </span>

                    <span class="summary-value">
                        ${formatMoney(result)}
                    </span>

                </div>


                <div class="chart-placeholder">
                    GRÁFICO
                </div>

            </div>

        </div>

    `;

}