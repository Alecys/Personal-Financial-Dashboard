import { initializeStore } from "./core/store.js";
import { Header } from "./components/header/header.js";
import { Balance } from "./components/balance/balance.js";
import { Accounts } from "./components/accounts/accounts.js";
import { Transactions } from "./components/transactions/transactions.js";
import { Summary } from "./components/summary/summary.js";
import { Categories } from "./components/categories/categories.js";
import { Credit } from "./components/credit/credit.js";

async function start() {
    await initializeStore();

    const app =
        document.querySelector("#app");

    const header =
        await Header();

    const balance =
        await Balance();

    const accounts =
        await Accounts();

    const transactions =
        await Transactions();

    const summary =
        await Summary();

    const categories =
        await Categories();

    const credit =
        await Credit();

    app.append(
        header,
        balance,
        accounts,
        credit,
        transactions,
        summary,
        categories,
    );
}

start();