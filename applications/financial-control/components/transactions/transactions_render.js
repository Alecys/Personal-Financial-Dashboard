// ========================================
// TRANSACTIONS RENDER
// ========================================

const { formatCurrencySigned, formatDateShort } = await import(
  globalThis.path.financialControl.shared.formatters
);

// ========================================
// TRANSACTIONS
// ========================================

export function renderTransactions(container, data) {
  const month = data.months[data.currentMonth];

  const transactions = month?.transactions || [];

  container.innerHTML = `

    <section class="transactions-section">

      <div class="lettering-title-minimal-more upper">
        Transactions
      </div>

      <div class="transactions-card">

        <div class="transactions-card-top">

          <div class="transactions-heading">

            <div class="text-white-main upper">
              Transactions
            </div>

            <div class="lettering-title-minimal-soft">
              ${transactions.length} transactions
            </div>

          </div>

          <div class="transactions-actions">

            <button
              type="button"
              class="button-opacity-select button-cubic"
              data-transaction-action="short"
            >
              <span class="lettering-text-small">
                ⇅
              </span>
            </button>

            <button
              type="button"
              class="button-opacity-select"
              data-transaction-action="add"
            >
              <span class="lettering-text-small">
                + Add
              </span>
            </button>

          </div>

        </div>

        <div
          class="transactions-card-main"
          data-transactions-list
        >

          ${
            transactions.length
              ? renderTransactionList(transactions, data)
              : `
                <div class="transactions-empty">
                  No transactions
                </div>
              `
          }

        </div>

      </div>

    </section>

  `;
}

// ========================================
// LIST
// ========================================

function renderTransactionList(transactions, data) {
  return transactions
    .map((transaction) => renderTransaction(transaction, data))
    .join("");
}

// ========================================
// TRANSACTION
// ========================================

function renderTransaction(transaction, data) {
  const source = getTransactionSource(transaction, data);

  return `

    <div
      class="transaction-item"
      data-transaction-id="${transaction.id}"
    >

      <div class="transaction-item-main">

        <div class="transaction-item-info">

          <div class="text-white-main">
            ${transaction.description || "Transaction"}
          </div>

          <div class="lettering-title-minimal-soft margin-top-4px">

            ${transaction.group ? `${transaction.group} ·` : ""}

            ${source ? `${source}` : ""}

          </div>

        </div>

        <div class="lettering-title-minimal-minimal upper">
          ${formatDateShort(transaction.date)}
        </div>

        <div
          class="
            value-normal-text
            ${transaction.amount < 0 ? "value-negative" : "value-positive"}
          "
        >
          ${formatCurrencySigned(transaction.amount)}
        </div>

      </div>

      <div class="transaction-item-actions">

        <button
          type="button"
          class="button-transaction-actions"
          data-transaction-action="edit"
          aria-label="Edit transaction"
          title="Edit transaction"
        >
          <span>
            ✎
          </span>
        </button>

      </div>

    </div>

  `;
}

// ========================================
// SOURCE
// ========================================

function getTransactionSource(transaction, data) {
  if (!transaction.account) {
    return "";
  }

  const month = data.months[data.currentMonth];

  if (transaction.type === "credit") {
    return month.credit?.[transaction.account]?.name || transaction.account;
  }

  return month.accounts?.[transaction.account]?.name || transaction.account;
}

// ========================================
// TRANSACTION FORM
// ========================================

export function renderTransactionForm(data, transactionId = null) {
  const month = data.months[data.currentMonth];
  const groups = [...(data.groups || [])].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
  const accounts = month?.accounts || {};
  const credit = month?.credit || {};

  // ----------------------------------------
  // EDIT DATA
  // ----------------------------------------

  const transaction = transactionId
    ? month?.transactions?.find(
        (item) => String(item.id) === String(transactionId),
      )
    : null;

  // ----------------------------------------
  // FIELD VALUES
  // ----------------------------------------

  const description = transaction?.description || "";
  const date = transaction?.date || "";
  const group = transaction?.group || "";
  const account = transaction?.account || "";
  const amount = transaction?.amount ?? "";
  const recurrence = transaction?.recurrence || "once";
  const installments = transaction?.installments ?? 0;
  const type = transaction?.type || "credit";

  return `

    <div
      class="transaction-form"
      data-transaction-form
      ${transactionId ? `data-transaction-id="${transactionId}"` : ""}
    >

      <div class="transaction-form-main">

        <div class="transaction-form-inputs">

          <div class="ajust-input-4px">

            <span class="lettering-title-minimal-soft">
              Description
            </span>

            <input
              class="input-opacity"
              type="text"
              value="${description}"
              data-transaction-field="description"
            >

          </div>

          <div class="ajust-input-4px">

            <span class="lettering-title-minimal-soft">
              Date
            </span>

            <input
              class="input-opacity"
              type="date"
              value="${date}"
              data-transaction-field="date"
            >

          </div>

          <div class="ajust-input-4px">

            <span class="lettering-title-minimal-soft">
              Group
            </span>

            <select
              class="input-opacity"
              data-transaction-field="group"
            >

              <option
                value=""
                ${!group ? "selected" : ""}
              >
                Select...
              </option>

              ${groups
                .map(
                  (item) => `
                      <option
                        value="${item}"
                        ${item === group ? "selected" : ""}
                      >
                        ${item}
                      </option>
                    `,
                )
                .join("")}

            </select>

          </div>

          <div class="ajust-input-4px">

            <span class="lettering-title-minimal-soft">
              Account
            </span>

            <select
              class="input-opacity"
              data-transaction-field="account"
            >

              <option
                value=""
                ${!account ? "selected" : ""}
                data-account-id=""
                data-transaction-type=""
              >
                No account
              </option>

              ${
                Object.keys(accounts).length
                  ? `
                    <optgroup label="Accounts">

                      ${Object.entries(accounts)
                        .map(
                          ([id, item]) => `
                            <option
                              value="account:${id}"
                              ${id === account && type === "debit" ? "selected" : ""}
                              data-account-id="${id}"
                              data-transaction-type="debit"
                            >
                              ${item.name || id}
                            </option>
                          `,
                        )
                        .join("")}

                    </optgroup>
                  `
                  : ""
              }

              ${
                Object.keys(credit).length
                  ? `
                    <optgroup label="Credit Cards">

                      ${Object.entries(credit)
                        .map(
                          ([id, item]) => `
                            <option
                              value="credit:${id}"
                              ${id === account && type === "credit" ? "selected" : ""}
                              data-account-id="${id}"
                              data-transaction-type="credit"
                            >
                              ${item.name || id}
                            </option>
                          `,
                        )
                        .join("")}

                    </optgroup>
                  `
                  : ""
              }

            </select>

          </div>

          <div class="ajust-input-4px">

            <span class="lettering-title-minimal-soft">
              Amount
            </span>

            <input
              class="input-opacity"
              type="number"
              step="0.01"
              value="${amount}"
              data-transaction-field="amount"
            >

          </div>

          <div class="ajust-input-4px">

            <span class="lettering-title-minimal-soft">
              Recurrence
            </span>

            <select
              class="input-opacity"
              data-transaction-field="recurrence"
            >

              <option
                value="once"
                ${recurrence === "once" ? "selected" : ""}
              >
                Once
              </option>

              <option
                value="fixed"
                ${recurrence === "fixed" ? "selected" : ""}
              >
                Fixed
              </option>

              <option
                value="installment"
                ${recurrence === "installment" ? "selected" : ""}
              >
                Installment
              </option>

            </select>

          </div>

          <div class="ajust-input-4px">

            <span class="lettering-title-minimal-soft">
              Installments
            </span>

            <input
              class="input-opacity"
              type="number"
              min="0"
              step="1"
              value="${installments}"
              data-transaction-field="installments"
            >

          </div>

        </div>

      </div>

      <div class="transaction-form-actions">

        <button
          type="button"
          class="button-transaction-actions"
          data-transaction-action="save"
          aria-label="Save transaction"
          title="Save transaction"
        >
          <span>
            ✓
          </span>
        </button>

        <button
          type="button"
          class="button-transaction-actions"
          data-transaction-action="delete"
          aria-label="Delete transaction"
          title="Delete transaction"
        >
          <span>
            🗑
          </span>
        </button>

      </div>

    </div>

  `;
}
