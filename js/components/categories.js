export function renderCategories(container, categories) {

    const items = categories
        .map(category => `

            <div class="category">

                ${category.name}
                ·
                R$ ${category.value.toLocaleString(
                    "pt-BR",
                    {
                        minimumFractionDigits: 2
                    }
                )}

            </div>

        `)
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

                    ${items}

                </div>

            </div>

        </section>

    `;
}