import { renderHeader } from "./components/header.js";
import { renderBalance } from "./components/balance.js";
import { renderAccounts } from "./components/accounts.js";
import { renderSummary } from "./components/summary.js";
import { renderTransactions } from "./components/transactions.js";
import { renderCategories } from "./components/categories.js";
import { renderCredit } from "./components/credit.js";


async function loadData() {

    const response =
        await fetch("./data/finance.json");

    if (!response.ok) {

        throw new Error(
            "Não foi possível carregar os dados."
        );

    }

    return await response.json();

}


async function init() {

    try {

        const data =
            await loadData();


        const currentMonth =
            data.months["2026-08"];


        renderHeader(
            document.getElementById("header"),
            currentMonth
        );


        renderBalance(
            document.getElementById("balance"),
            currentMonth
        );


        renderAccounts(
            document.getElementById("accounts"),
            currentMonth.accounts
        );


        renderTransactions(
            document.getElementById("transactions"),
            currentMonth.transactions
        );


        renderSummary(
            document.getElementById("summary"),
            currentMonth.summary
        );


        renderCategories(
            document.getElementById("categories"),
            currentMonth.categories
        );


        renderCredit(
            document.getElementById("credit"),
            currentMonth.credit
        );


    } catch (error) {

        console.error(error);

    }

}


init();