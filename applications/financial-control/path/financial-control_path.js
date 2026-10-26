// ========================================
// FINANCIAL CONTROL PATHS
// ========================================

export const paths = {
  controller: {
    js: `${globalThis.path.root.path}/applications/financial-control/controller/financial-control_controller.js`,
    core: `${globalThis.path.root.path}/applications/financial-control/controller/financial-control_core.js`,
    //notify: `${globalThis.path.root.path}/applications/financial-control/controller/financial-control_notify.js`,
    period: {
      js: `${globalThis.path.root.path}/applications/financial-control/controller/period/period.js`,
      logic: `${globalThis.path.root.path}/applications/financial-control/controller/period/period_logic.js`,
      sync: `${globalThis.path.root.path}/applications/financial-control/controller/period/period_sync.js`,
    },
  },

  base: {
    js: `${globalThis.path.root.path}/applications/financial-control/base/financial-control_base.js`,
    css: `${globalThis.path.root.path}/applications/financial-control/base/financial-control_base.css`,
  },

  data: {
    converter: `${globalThis.path.root.path}/applications/financial-control/data/financial-control_converter.js`,
    js: `${globalThis.path.root.path}/applications/financial-control/data/financial-control_data.js`,
    load: `${globalThis.path.root.path}/applications/financial-control/data/financial-control_load.js`,
    save: `${globalThis.path.root.path}/applications/financial-control/data/financial-control_save.js`,
    json: `${globalThis.path.root.path}/applications/financial-control/data/financial-control.json`,
  },

  notify: {
    logic: `${globalThis.path.root.path}/applications/financial-control/notify/financial-control_notify_logic.js`,
    view: `${globalThis.path.root.path}/applications/financial-control/notify/financial-control_notify_view.js`,
  },

  shared: {
    formatters: `${globalThis.path.root.path}/applications/financial-control/shared/financial-control_formatters.js`,
  },

  components: {
    header: {
      js: `${globalThis.path.root.path}/applications/financial-control/components/header/header.js`,
      control: `${globalThis.path.root.path}/applications/financial-control/components/header/header_control.js`,
      events: `${globalThis.path.root.path}/applications/financial-control/components/header/header_events.js`,
      actions: `${globalThis.path.root.path}/applications/financial-control/components/header/header_actions.js`,
      view: `${globalThis.path.root.path}/applications/financial-control/components/header/header_view.js`,
      logic: `${globalThis.path.root.path}/applications/financial-control/components/header/header_logic.js`,
      render: `${globalThis.path.root.path}/applications/financial-control/components/header/header_render.js`,
      css: `${globalThis.path.root.path}/applications/financial-control/components/header/header.css`,
    },

    balance: {
      js: `${globalThis.path.root.path}/applications/financial-control/components/balance/balance.js`,
      control: `${globalThis.path.root.path}/applications/financial-control/components/balance/balance_control.js`,
      view: `${globalThis.path.root.path}/applications/financial-control/components/balance/balance_view.js`,
      logic: `${globalThis.path.root.path}/applications/financial-control/components/balance/balance_logic.js`,
      render: `${globalThis.path.root.path}/applications/financial-control/components/balance/balance_render.js`,
      css: `${globalThis.path.root.path}/applications/financial-control/components/balance/balance.css`,
    },

    account: {
      js: `${globalThis.path.root.path}/applications/financial-control/components/account/account.js`,
      control: `${globalThis.path.root.path}/applications/financial-control/components/account/account_control.js`,
      events: `${globalThis.path.root.path}/applications/financial-control/components/account/account_events.js`,
      actions: `${globalThis.path.root.path}/applications/financial-control/components/account/account_actions.js`,
      view: `${globalThis.path.root.path}/applications/financial-control/components/account/account_view.js`,
      logic: `${globalThis.path.root.path}/applications/financial-control/components/account/account_logic.js`,
      render: `${globalThis.path.root.path}/applications/financial-control/components/account/account_render.js`,
      css: `${globalThis.path.root.path}/applications/financial-control/components/account/account.css`,
    },

    transactions: {
      js: `${globalThis.path.root.path}/applications/financial-control/components/transactions/transactions.js`,
      control: `${globalThis.path.root.path}/applications/financial-control/components/transactions/transactions_control.js`,
      events: `${globalThis.path.root.path}/applications/financial-control/components/transactions/transactions_events.js`,
      actions: `${globalThis.path.root.path}/applications/financial-control/components/transactions/transactions_actions.js`,
      view: `${globalThis.path.root.path}/applications/financial-control/components/transactions/transactions_view.js`,
      logic: `${globalThis.path.root.path}/applications/financial-control/components/transactions/transactions_logic.js`,
      render: `${globalThis.path.root.path}/applications/financial-control/components/transactions/transactions_render.js`,
      css: `${globalThis.path.root.path}/applications/financial-control/components/transactions/transactions.css`,
    },

    credit: {
      js: `${globalThis.path.root.path}/applications/financial-control/components/credit/credit.js`,
      control: `${globalThis.path.root.path}/applications/financial-control/components/credit/credit_control.js`,
      events: `${globalThis.path.root.path}/applications/financial-control/components/credit/credit_events.js`,
      actions: `${globalThis.path.root.path}/applications/financial-control/components/credit/credit_actions.js`,
      view: `${globalThis.path.root.path}/applications/financial-control/components/credit/credit_view.js`,
      logic: `${globalThis.path.root.path}/applications/financial-control/components/credit/credit_logic.js`,
      render: `${globalThis.path.root.path}/applications/financial-control/components/credit/credit_render.js`,
      css: `${globalThis.path.root.path}/applications/financial-control/components/credit/credit.css`,
      stackedCard: {
        js: `${globalThis.path.root.path}/applications/financial-control/components/credit/stackedCard/stackedCard.js`,
        control: `${globalThis.path.root.path}/applications/financial-control/components/credit/stackedCard/stackedCard_control.js`,
        events: `${globalThis.path.root.path}/applications/financial-control/components/credit/stackedCard/stackedCard_events.js`,
        logic: `${globalThis.path.root.path}/applications/financial-control/components/credit/stackedCard/stackedCard_logic.js`,
        css: `${globalThis.path.root.path}/applications/financial-control/components/credit/stackedCard/stackedCard.css`,
      },
      flip: {
        js: `${globalThis.path.root.path}/applications/financial-control/components/credit/flip/flip.js`,
        control: `${globalThis.path.root.path}/applications/financial-control/components/credit/flip/flip_control.js`,
        events: `${globalThis.path.root.path}/applications/financial-control/components/credit/flip/flip_events.js`,
        actions: `${globalThis.path.root.path}/applications/financial-control/components/credit/flip/flip_actions.js`,
        view: `${globalThis.path.root.path}/applications/financial-control/components/credit/flip/flip_view.js`,
        logic: `${globalThis.path.root.path}/applications/financial-control/components/credit/flip/flip_logic.js`,
        render: `${globalThis.path.root.path}/applications/financial-control/components/credit/flip/flip_render.js`,
        css: `${globalThis.path.root.path}/applications/financial-control/components/credit/flip/flip.css`,
      },
    },
  },
};
