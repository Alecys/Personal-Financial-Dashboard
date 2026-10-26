// ========================================
// IMPORTS
// ========================================

// ========================================
// MAIN
// ========================================

export async function initializeFinancialControlBase() {
  // ========================================
  // STYLES
  // ========================================

  const stylesheetBase = document.createElement("link");

  stylesheetBase.rel = "stylesheet";

  stylesheetBase.href = globalThis.path.financialControl.base.css;

  document.head.appendChild(stylesheetBase);

  // ========================================
  // STRUCTURE
  // ========================================

  const baseContent = document.getElementById("base-content");

  baseContent.innerHTML = `
    <div class="financial-control">

      <header
        class="financial-control-header"
        data-slot="header">
      </header>

      <main class="financial-control-layout">

        <section
          class="financial-control-balance"
          data-slot="balance">
        </section>

        <section
          class="financial-control-accounts"
          data-slot="accounts">
        </section>

        <section
          class="financial-control-credit"
          data-slot="credit">
        </section>

        <section
          class="financial-control-transactions"
          data-slot="transactions">
        </section>

        <section
          class="financial-control-summary"
          data-slot="summary">
        </section>

        <section
          class="financial-control-categories"
          data-slot="categories">
        </section>

      </main>

    </div>
    `;
}
