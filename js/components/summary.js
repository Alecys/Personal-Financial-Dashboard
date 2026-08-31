export function renderSummary(container, summary) {

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
                        R$ ${summary.income.toLocaleString(
                            "pt-BR",
                            {
                                minimumFractionDigits: 2
                            }
                        )}
                    </span>

                </div>


                <div class="summary-row">

                    <span class="summary-label">
                        Total de gastos
                    </span>

                    <span class="summary-value negative">
                        R$ ${summary.expenses.toLocaleString(
                            "pt-BR",
                            {
                                minimumFractionDigits: 2
                            }
                        )}
                    </span>

                </div>


                <div class="summary-row summary-total">

                    <span class="summary-label">
                        Resultado
                    </span>

                    <span class="summary-value">
                        R$ ${summary.result.toLocaleString(
                            "pt-BR",
                            {
                                minimumFractionDigits: 2
                            }
                        )}
                    </span>

                </div>


                <div class="chart-placeholder">

                    GRÁFICO

                </div>

            </div>

        </div>

    `;
}