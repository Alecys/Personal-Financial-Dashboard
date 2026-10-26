// ========================================
// CREDIT RENDER
// ========================================

// ========================================
// IMPORTS
// ========================================

const { flipCreditCard } = await import(
  globalThis.path.financialControl.components.credit.flip.logic
);

const { formatCurrency, formatDateDayMonth } = await import(
  globalThis.path.financialControl.shared.formatters
);

// ========================================
// INITIALIZE
// ========================================

export function initializeCreditRender() {
  // Intentionally empty.
}

// ========================================
// RENDER
// ========================================

export function renderCredit(data) {
  const creditContainer = document.querySelector('[data-slot="credit"]');

  if (!creditContainer) {
    return;
  }

  const currentMonth = data.currentMonth;

  const credits = data.months[currentMonth].credit;

  const creditData = Object.entries(credits).map(([id, credit]) => ({
    id,
    ...credit,
  }));

  creditContainer.innerHTML = `
    <section class="credit-section">

      <div class="lettering-title-minimal-more upper">
        Credit
      </div>

      <div
        class="credit-grid"
        data-field="credits"
      >

        ${creditData.map((credit) => renderCreditCard(credit, currentMonth, data)).join("")}

      </div>

    </section>
  `;

  creditData.map((credit) => renderCreditState(data, credit.id, "face"));
}

// ========================================
// CREDIT CARD
// ========================================

function renderCreditCard(credit, currentMonth, data) {
  return `
    <article
      class="credit-float"
      data-credit-id="${credit.id}"
    >

      <div
        class="deck-card"
        data-credit-state="face"
        style="background-color: ${credit.color}"
      >

        <div class="credit-flip-container">

          <div class="credit-flipper">

            <div class="credit-face">

              <div class="credit-card-content">

                  **Conteudo**

              </div>

            </div>

            <div class="credit-back">

              <div class="credit-card-content">

              </div>

            </div>

          </div>

        </div>

      </div>

    </article>
  `;
}

// ========================================
// CREDIT STATE
// ========================================

export function renderCreditState(data, creditId, creditState) {
  const creditCard = document.querySelector(`[data-credit-id="${creditId}"]`);

  if (!creditCard) {
    return;
  }

  const deckCard = creditCard.querySelector(".deck-card");

  const creditFace = creditCard.querySelector(
    ".credit-face .credit-card-content",
  );

  const creditBack = creditCard.querySelector(
    ".credit-back .credit-card-content",
  );

  if (!deckCard || !creditFace || !creditBack) {
    return;
  }

  const currentMonth = data.currentMonth;

  const credits = data.months[currentMonth].credit;

  const credit = credits[creditId];

  const accounts = data.months[currentMonth].accounts;

  if (!credit) {
    return;
  }

  const creditData = {
    id: creditId,
    ...credit,
  };

  deckCard.dataset.creditState = creditState;

  // ========================================
  // FACE
  // ========================================

  if (creditState === "face") {
    creditFace.innerHTML = renderCreditStateContent(
      creditData,
      "face",
      currentMonth,
      accounts,
    );

    flipCreditCard(creditId, "face");

    return;
  }

  // ========================================
  // BACK
  // ========================================

  creditBack.innerHTML = renderCreditStateContent(
    creditData,
    creditState,
    currentMonth,
    accounts,
  );

  // ========================================
  // FLIP
  // ========================================

  if (
    creditState === "flip" ||
    creditState === "edit" ||
    creditState === "payment"
  ) {
    flipCreditCard(creditId, creditState);
  }
}

// ========================================
// CREDIT STATE CONTENT
// ========================================

function renderCreditStateContent(credit, creditState, currentMonth, accounts) {
  switch (creditState) {
    case "flip":
      return renderCreditFlip(credit);

    case "edit":
      return renderCreditEdit(credit);

    case "payment":
      return renderCreditPayment(credit, accounts);

    case "face":
    default:
      return renderCreditFace(credit, currentMonth);
  }
}

// ========================================
// CREDIT FACE
// ========================================

function renderCreditFace(credit, currentMonth) {
  const limit = Number(credit.limit) || 0;
  const openInvoice = Number(credit.openInvoice) || 0;
  const nextInvoice = Number(credit.nextInvoice) || 0;
  const invoiceValue =
    credit.invoiceStatus === "paid" ? nextInvoice : openInvoice;
  const used = Math.abs(invoiceValue);
  const futureInvoices = Number(credit.installmentTotal) || 0;
  const committed =
    credit.invoiceStatus === "paid"
      ? Math.abs(nextInvoice) + futureInvoices
      : Math.abs(openInvoice) + Math.abs(nextInvoice) + futureInvoices;
  const available = Math.max(limit - committed, 0);

  const usage = limit > 0 ? Math.min((committed / limit) * 100, 100) : 0;

  return `
    <div class="card-top">

      <div>

        <div class="lettering-text-small-bold">
          ${credit.name}
        </div>

        <div class="lettering-text-small-spaced">
          •••• ${credit.lastFour || "0000"}
        </div>

      </div>

      <div class="card-actions">

        <button
          class="button-translucent-circle"
          type="button"
          aria-label="Flip card"
          data-action="flip"
        >
          <span class="translateY-minusTwo">
            ↗
          </span>
        </button>

      </div>

    </div>

    <div class="card-content">

      <div class="lettering-value-currency">
        ${formatCurrency(invoiceValue)}
      </div>

      <div class="card-limit">

        <div class="card-limit-info">

          <span class="lettering-info-small">
            Credit limit
          </span>

          <span class="lettering-info-small">
            ${formatCurrency(credit.limit)}
          </span>

        </div>

        <div class="card-limit-wrapper">

          <div class="card-limit-bar">
            <span
              class="card-limit-fill"
              style="width: ${usage}%"
            ></span>
          </div>

          <div class="card-limit-tooltip">

            <div>
              <span class="lettering-info-small upper">
                Open Invoice
              </span>

              <span class="lettering-text-small-medium">
                ${formatCurrency(Math.abs(openInvoice))}
              </span>
            </div>

            <div>
              <span class="lettering-info-small upper">
                Next Invoice
              </span>

              <span class="lettering-text-small-medium">
                ${formatCurrency(Math.abs(nextInvoice))}
              </span>
            </div>

            <div>
              <span class="lettering-info-small upper">
                Future Inst.
              </span>

              <span class="lettering-text-small-medium">
                ${formatCurrency(futureInvoices)}
              </span>
            </div>

            <div>
              <span class="lettering-info-small upper">
                Available
              </span>

              <span class="lettering-text-small-medium">
                ${formatCurrency(available)}
              </span>
            </div>

          </div>

        </div>

    </div>

    <div class="card-footer">

      <div class="card-date">

        <span class="lettering-text-tiny upper">
          Closing
        </span>

        <span class="lettering-text-small-medium">
          ${formatDateDayMonth(credit.closingDay, currentMonth)}
        </span>

      </div>

      <div class="card-date">

        <span class="lettering-text-tiny upper">
          Due
        </span>

        <span class="lettering-text-small-medium">
          ${formatDateDayMonth(credit.dueDay, currentMonth)}
        </span>

      </div>

    </div>

    <div class="card-decoration"></div>
  `;
}

// ========================================
// CREDIT FLIP
// ========================================

function renderCreditFlip(credit) {
  const paymentValue = Number(credit.openInvoice);

  return `
    <div class="card-top">

      <div>

        <div class="lettering-text-small-title">
          ${credit.name}
        </div>

        <div class="lettering-text-tiny upper">
          Statement
        </div>

      </div>

      <div class="card-actions">

        <button
          class="button-translucent-circle-flip"
          type="button"
          aria-label="Edit card"
          data-action="edit"
        >
          <span class="translateY-minusTwo">
            ✎
          </span>
        </button>

        <button
          class="button-translucent-circle-flip"
          type="button"
          aria-label="Close"
          data-action="close"
        >
          <span class="translateY-minusTwo">
            ↖
          </span>
        </button>

      </div>

    </div>

    <div class="card-content">

      <div class="lettering-value-currency">
        ${formatCurrency(paymentValue)}
      </div>

      <div class="card-status">

        <span class="card-status-indicator"></span>

        <span class="lettering-text-small-spaced first-upper">
          ${credit.invoiceStatus || "Error"}
        </span>

      </div>

    </div>

    <div class="card-footer">

      <div class="displayFlex-right">

        <button
          class="button-text-confirm"
          type="button"
          data-action="payment"
        >
          <span class="lettering-text-small-medium">
            Pay
          </span>
        </button>

      </div>

    </div>

    
  `;
}

// ========================================
// CREDIT EDIT
// ========================================

// ========================================
// CREDIT EDIT
// ========================================

function renderCreditEdit(credit) {
  return `
    <div class="card-top">

      <div>

        <div class="lettering-text-small-title">
          ${credit.name}
        </div>

        <div class="lettering-text-tiny upper">
          Edit card
        </div>

      </div>

      <div class="card-actions">

        <button
          class="button-translucent-circle-flip"
          type="button"
          aria-label="Close"
          data-action="close"
        >
          <span class="translateY-minusTwo">
            ↖
          </span>
        </button>

      </div>

    </div>

    <div class="card-content">

      <form class="card-form">

          <div class="card-field">

            <span class="lettering-info-small upper">
              Name
            </span>

            <input
              class="input-opacity"
              type="text"
              name="name"
              value="${credit.name || ""}"
              autocomplete="off"
              required
            >

          </div>

          <div class="card-field">

            <span class="lettering-info-small upper">
              Last four
            </span>

            <input
              class="input-opacity"
              type="text"
              name="input-opacity"
              value="${credit.lastFour || ""}"
              maxlength="4"
              inputmode="numeric"
              autocomplete="off"
            >

          </div>

          <div class="card-field">

            <span class="lettering-info-small upper">
              Credit limit
            </span>

            <input
              class="input-opacity"
              type="number"
              name="limit"
              value="${Number(credit.limit || 0)}"
              min="0"
              step="0.01"
            >

          </div>

          <div class="card-field">

            <span class="lettering-info-small upper">
              Closing
            </span>

            <input
              class="input-opacity"
              type="number"
              name="closingDay"
              value="${Number(credit.closingDay || 1)}"
              min="1"
              max="31"
            >

          </div>

          <div class="card-field">

            <span class="lettering-info-small upper">
              Due
            </span>

            <input
              class="input-opacity"
              type="number"
              name="dueDay"
              value="${Number(credit.dueDay || 1)}"
              min="1"
              max="31"
            >

          </div>

      </form>

    </div>

    <div class="card-footer">

      <div class="displayFlex-right">

        <button
          type="button"
          class="button-text-cancel"
          data-action="close"
        >
          <span class="lettering-text-small-medium">
            Cancel
          </span>
        </button>

        <button
          type="submit"
          class="button-text-confirm"
          data-action="CreditEditSave"
        >
          <span class="lettering-text-small-medium">
            Save
          </span>
        </button>

      </div>

    </div>

  `;
}

// ========================================
// CREDIT PAYMENT
// ========================================

// ========================================
// CREDIT PAYMENT
// ========================================

function renderCreditPayment(credit, accounts) {
  return `
    <div class="card-top">

      <div>

        <div class="lettering-text-small-title">
          ${credit.name}
        </div>

        <div class="lettering-text-tiny upper">
          Pay invoice
        </div>

      </div>

      <div class="card-actions">

        <button
          class="button-translucent-circle-flip"
          type="button"
          aria-label="Close"
          data-action="close"
        >
          <span class="translateY-minusTwo">
            ↖
          </span>
        </button>

      </div>

    </div>

    <div class="card-content">

      <div class="lettering-value-currency">
        ${formatCurrency(credit.openInvoice)}
      </div>

      <form class="card-form">

        <div class="card-field">

          <span class="lettering-info-small upper">
            Pay from
          </span>

          <select
            class="input-opacity"
            name="account"
            required
          >

            <option value="">
              Select account
            </option>

            ${Object.entries(accounts)
              .map(
                ([id, account]) => `
                  <option value="${id}">
                    ${account.name}
                  </option>
                `,
              )
              .join("")}

          </select>
        </div>

      </form>

    </div>

    <div class="card-footer">

      <div class="displayFlex-right">

        <button
          type="button"
          class="button-text-cancel"
          data-action="close"
        >
          <span class="lettering-text-small-medium">
            Cancel
          </span>
        </button>

        <button
          type="submit"
          class="button-text-confirm"
          data-action="CreditPaymentSave"
        >
          <span class="lettering-text-small-medium">
            Pay
          </span>
        </button>

      </div>

    </div>

  `;
}
