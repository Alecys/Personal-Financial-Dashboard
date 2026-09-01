const STORAGE_KEY = "finance-data";


const defaultData = {

    version: 1,

    months: {

        "2026-08": {

            name: "Agosto",

            year: 2026,

            accounts: {

                nubank: {
                    name: "Nubank",
                    type: "Conta",
                    initialBalance: 7800
                },

                itau: {
                    name: "Itaú",
                    type: "Conta",
                    initialBalance: 6200
                },

                "mercado-pago": {
                    name: "Mercado Pago",
                    type: "Conta",
                    initialBalance: 2000
                }

            },

            transactions: [

                {
                    id: 1,
                    date: "05 AGO",
                    description: "Salário",
                    group: "Salário",
                    account: "nubank",
                    amount: 4500
                },

                {
                    id: 2,
                    date: "08 AGO",
                    description: "Mercado",
                    group: "Alimentação",
                    account: "nubank",
                    amount: -320.40
                },

                {
                    id: 3,
                    date: "10 AGO",
                    description: "Combustível",
                    group: "Transporte",
                    account: "itau",
                    amount: -180
                },

                {
                    id: 4,
                    date: "12 AGO",
                    description: "Compra online",
                    group: "Compras",
                    account: "itau",
                    amount: -450
                },

                {
                    id: 5,
                    date: "16 AGO",
                    description: "Freelance",
                    group: "Renda extra",
                    account: "mercado-pago",
                    amount: 850
                }

            ],

            credit: {
                month: "Setembro 2026",
                value: 1420
            }

        }

    }

};


export function getData() {

    const saved =
        localStorage.getItem(STORAGE_KEY);


    if (!saved) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(defaultData)
        );

        return structuredClone(defaultData);

    }


    return JSON.parse(saved);

}


export function saveData(data) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}


export function getCurrentMonth() {

    const data = getData();

    return data.months["2026-08"];

}


export function updateCurrentMonth(callback) {

    const data = getData();

    const month =
        data.months["2026-08"];


    callback(month);


    saveData(data);

    return month;

}