import { formatMoney } from "../../core/formatters.js";
import { calculateCategories } from "../../data/calculations.js";


export function renderCategories(
    container,
    month
) {

    const categories =
        calculateCategories(
            month.transactions
        );


    const items =
        Object.entries(categories)
            .map(
                ([name, value]) => `

                    <div class="category">

                        ${name}

                        ·

                        ${formatMoney(value)}

                    </div>

                `
            )
            .join("");


    container.innerHTML = `

        <section class="panel bottom-panel">

            <div class="panel-header">

                <div class="panel-title">
                    Gastos por grupo
                </div>

            </div>


            <div class="category-container">

                <div class="category-list">

                    ${items || `

                        <div class="category">
                            Nenhum gasto registrado
                        </div>

                    `}

                </div>

            </div>

        </section>

    `;

}