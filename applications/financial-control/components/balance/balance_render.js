// ========================================
// BALANCE RENDER
// ========================================

export function renderBalance(data) {
  const balanceContainer = document.querySelector('[data-slot="balance"]');

  if (!balanceContainer) {
    return;
  }

  balanceContainer.innerHTML = `

        <section class="section-balance">

            <div class="lettering-title-minimal-more upper">

                Available balance

            </div>

            <div
                class="lettering-value-currency-upper"
                data-field="balance"
            >

                ${data.formattedBalance}

            </div>

            <div class="balance-change">

                <span
                    class="lettering-value-percent value-${data.changeClass}"
                    data-field="change"
                >

                    ${data.formattedChange}

                </span>

                <span class="lettering-text-small">
                    compared to the beginning of the month
                </span>
            </div>
        </section>

    `;
}
