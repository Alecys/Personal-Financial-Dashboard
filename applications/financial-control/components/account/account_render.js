// ========================================
// ACCOUNT RENDER
// ========================================
const { formatCurrency } = await import(
  globalThis.path.financialControl.shared.formatters
);

export function renderAccount(data, accountId, accountState) {
  const accountContainer = document.querySelector('[data-slot="accounts"]');

  if (!accountContainer) {
    return;
  }

  const currentMonth = data.currentMonth;

  const accounts = data.months[currentMonth].accounts;

  const accountData = Object.entries(accounts).map(([accountId, account]) => ({
    id: accountId,
    ...account,
  }));

  accountContainer.innerHTML = `
    <section class="account-section">

      <div class="lettering-title-minimal-more upper">
        Accounts
      </div>

      <div
        class="account-grid"
        data-field="accounts"
      >

        ${accountData
          .map((account) =>
            renderAccountCard(account, accountData, accountId, accountState),
          )
          .join("")}

      </div>

    </section>
  `;
}

// ========================================
// ACCOUNT CARD
// ========================================

function renderAccountCard(account, accountData, accountId, accountState) {
  const isSelected = account.id === accountId;

  const currentState = isSelected ? accountState : "normal";

  return `
    <article class="account-float">

      <div
        class="account-card"
        data-account-id="${account.id}"
        data-account-state="${currentState}"
        show-button-hidden
      >

        <div class="account-card-content">

          ${renderAccountFace(account, accountData, currentState)}

        </div>

      </div>

    </article>
  `;
}

// ========================================
// ACCOUNT FACE
// ========================================

function renderAccountFace(account, accountData, accountState) {
  if (accountState === "editing") {
    return renderAccountEditing(account);
  }

  if (accountState === "transfer") {
    return renderAccountTransfer(account, accountData);
  }

  return renderAccountNormal(account);
}

// ========================================
// ACCOUNT NORMAL
// ========================================

function renderAccountNormal(account) {
  return `

    <div class="account-card-top">

      <div class="account-heading">

        <div class="lettering-title-minimal-soft-more upper">
          ${account.name}
        </div>

        <div class="lettering-title-minimal-soft">
          ${account.type}
        </div>

      </div>

      <div class="account-actions">

        <button
          class="button-translucent button-hidden"
          type="button"
          data-account-action="edit"
        >
          <span>
            ✎
          </span>
        </button>

        <button
          class="button-translucent"
          type="button"
          data-account-action="transfer"
        >
          <span class="translateY-minusTwo">
            ⇄
          </span>
        </button>

      </div>

    </div>

    <div class="account-card-main">

      <div class="account-value-row">

        <div class="lettering-value-currency ${account.actualBalance < 0 ? "value-negative" : ""}">
          ${formatCurrency(account.actualBalance)}
        </div>

      </div>

    </div>

    <div class="account-card-bottom">

      <div class="account-footer-info">

        <span class="lettering-title-minimal-soft">
          Opening balance
        </span>

        <span class="lettering-title-minimal-soft">
          R$ ${account.initialBalance}
        </span>

      </div>

    </div>

  `;
}

// ========================================
// ACCOUNT EDITING
// ========================================

function renderAccountEditing(account) {
  return `

    <div class="account-card-top">

      <div class="account-heading">

        <div class="lettering-title-minimal-soft-more upper">
          ${account.name}
        </div>

        <div class="lettering-title-minimal-soft">
          Edit account
        </div>

      </div>

      <button
        type="button"
        data-account-action="cancel"
        class="button-translucent"
      >
        <span>
          ×
        </span>
      </button>

    </div>

    <div class="account-card-main">

      <div class="account-edit-content">

        <div>

          <span class="lettering-title-minimal-soft upper"> 
            Name 
          </span>

          <input
            class="input-opacity"
            type="text"
            value="${account.name}"
            placeholder="Account name"
            data-account-field="name"
          >

        <div>

        <div>

          <span class="lettering-title-minimal-soft upper"> 
            Opening balance 
          </span>

          <input
            class="input-opacity"
            type="number"
            value="${account.initialBalance}"
            placeholder="Initial balance"
            data-account-field="initial-balance"
          >

        <div>

      </div>

    </div>

    <div class="account-card-bottom">

      <div class="displayFlex-right">
      
      <button 
        class="button-text-cancel" 
        type="button"
        data-account-action="cancel"
      >
        Cancel
      </button>

      <button
          class="button-text-confirm"
          type="button"
          data-account-action="save"
        >
          Save
      </button>

      </div>   

    </div>

  `;
}

// ========================================
// ACCOUNT TRANSFER
// ========================================

function renderAccountTransfer(account, accountData) {
  const destinationAccounts = accountData.filter(
    (destinationAccount) => destinationAccount.id !== account.id,
  );

  return `

    <div class="account-card-top">

      <div class="account-heading">

        <div class="lettering-title-minimal-soft-more upper">
          ${account.name}
        </div>

        <div class="lettering-title-minimal-soft">
          Transfer money
        </div>

      </div>

      <button
        type="button"
        data-account-action="cancel"
        class="button-translucent"
      >
        <span>
          ×
        </span>
      </button>

    </div>

    <div class="account-card-main">

      <div class="account-transfer-content">
        
      <div>

        <span
          class="lettering-title-minimal-soft upper">
           To
        </span>

        <select
          class="input-opacity"
          data-account-field="transfer-to"
        >

          <option value="">
            Select account
          </option>

          ${destinationAccounts
            .map(
              (destinationAccount) => `
                <option
                  value="${destinationAccount.id}"
                >
                  ${destinationAccount.name}
                </option>
              `,
            )
            .join("")}

          </select>

        </div>

        <div>
          <span
            class="lettering-title-minimal-soft upper">
            Amount
          </span>

          <input
            class="input-opacity"
            type="number"
            data-account-field="transfer-amount"
            placeholder="0.00"
            required
          >
        </div>

      </div>

    </div>

    <div class="account-card-bottom">

      <div class="displayFlex-right">
      
      <button 
        class="button-text-cancel" 
        type="button"
        data-account-action="cancel"
      >
        Cancel
      </button>

      <button
          class="button-text-confirm"
          type="button"
          data-account-action="confirm-transfer"
        >
          Transfer
      </button>

      </div>     

    </div>

  `;
}
