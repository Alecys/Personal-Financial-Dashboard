// ========================================
// HEADER RENDER
// ========================================

export function renderHeader(data) {
  const headerContainer = document.querySelector('[data-slot="header"]');

  if (!headerContainer) {
    return;
  }

  headerContainer.innerHTML = `
    <header class="section-header">

      <div class="header-brand">

        <div class="button-opacity-select-bigger">

          <div class="text-white-main upper">
            DF
          </div>

        </div>

        <div>

          <div class="text-white-bigger upper">
            FINANCE
          </div>

          <div class="lettering-title-minimal upper">
            Personal Control
          </div>

        </div>

      </div>

      <div class="header-month-control">

        <button
          class="button-opacity-select button-cubic"
          data-action="previous"
          aria-label="Previous month"
        >
          <span class="translateY-minusOne">
            ←
          </span>
        </button>

        <div class="header-month-display text-align-center">

          <div class="lettering-title-minimal upper">
            Current month
          </div>

          <div
            class="text-white-bigger upper"
            data-field="month"
          >
            ${data.monthName}
          </div>

        </div>

        <button
          class="button-opacity-select button-cubic"
          data-action="next"
          aria-label="Next month"
        >
          <span class="translateY-minusOne">
            →
          </span>
        </button>

      </div>

    </header>
  `;
}
