export function renderHeader(container, month) {

    container.innerHTML = `

        <div class="header">

            <div class="brand">

                <div class="brand-logo">
                    DF
                </div>

                <div>

                    <div class="brand-name">
                        FINANCE
                    </div>

                    <div class="brand-subtitle">
                        Personal Control
                    </div>

                </div>

            </div>


            <div class="month-control">

                <button
                    class="month-button"
                    id="previous-month"
                    aria-label="Mês anterior"
                >
                    ←
                </button>


                <div class="month-display">

                    <div class="month-label">
                        Mês atual
                    </div>

                    <div class="month-name">
                        ${month.name} ${month.year}
                    </div>

                </div>


                <button
                    class="month-button"
                    id="next-month"
                    aria-label="Próximo mês"
                >
                    →
                </button>

            </div>

        </div>

    `;
}