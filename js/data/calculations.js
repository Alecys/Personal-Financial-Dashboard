export function calculateAccountBalance(
    account,
    transactions
) {

    const movementTotal =
        transactions
            .filter(
                transaction =>
                    transaction.account === account.id
            )
            .reduce(
                (total, transaction) =>
                    total + transaction.amount,
                0
            );


    return account.initialBalance + movementTotal;

}


export function calculateTotalBalance(
    accounts,
    transactions
) {

    return Object.entries(accounts)
        .reduce(
            (total, [id, account]) => {

                return total +
                    calculateAccountBalance(
                        {
                            ...account,
                            id
                        },
                        transactions
                    );

            },
            0
        );

}


export function calculateIncome(transactions) {

    return transactions
        .filter(transaction => transaction.amount > 0)
        .reduce(
            (total, transaction) =>
                total + transaction.amount,
            0
        );

}


export function calculateExpenses(transactions) {

    return transactions
        .filter(transaction => transaction.amount < 0)
        .reduce(
            (total, transaction) =>
                total + Math.abs(transaction.amount),
            0
        );

}


export function calculateResult(transactions) {

    return transactions
        .reduce(
            (total, transaction) =>
                total + transaction.amount,
            0
        );

}


export function calculateCategories(transactions) {

    const categories = {};


    transactions
        .filter(transaction => transaction.amount < 0)
        .forEach(transaction => {

            const group =
                transaction.group || "Sem grupo";


            categories[group] =
                (categories[group] || 0)
                + Math.abs(transaction.amount);

        });


    return categories;

}