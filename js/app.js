import { getCurrentMonth } from "./data/store.js";
import { renderBalance } from "./components/balance/balance.js";
import { renderAccounts } from "./components/accounts/accounts.js";
import { renderTransactions } from "./components/transactions/transactions.js";
import { renderSummary } from "./components/summary/summary.js";
import { renderCategories } from "./components/categories/categories.js";
import { renderCredit } from "./components/credit/credit.js";


function renderApp() {

    const month = getCurrentMonth();


    renderBalance(
        document.querySelector("#balance"),
        month
    );


    renderAccounts(
        document.querySelector("#accounts"),
        month
    );


    renderTransactions(
        document.querySelector("#transactions"),
        month.transactions
    );


    renderSummary(
        document.querySelector("#summary"),
        month
    );


    renderCategories(
        document.querySelector("#categories"),
        month
    );


    renderCredit(
        document.querySelector("#credit"),
        month
    );

}


renderApp();