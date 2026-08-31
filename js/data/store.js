const STORAGE_KEY = "finance-data";

let state = null;


/*
========================================
INICIALIZAÇÃO
========================================
*/

export async function initializeStore() {

    const savedData =
        localStorage.getItem(STORAGE_KEY);


    /*
    Se já existem dados salvos,
    usa eles.
    */

    if (savedData) {

        state = JSON.parse(savedData);

        return state;

    }


    /*
    Se não existem dados,
    carrega o JSON-base.
    */

    const response =
        await fetch("./data/finance.json");


    if (!response.ok) {

        throw new Error(
            "Não foi possível carregar o finance.json"
        );

    }


    state =
        await response.json();


    saveState();


    return state;

}


/*
========================================
LEITURA
========================================
*/

export function getState() {

    return state;

}


/*
========================================
SALVAR
========================================
*/

export function saveState() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );

}


/*
========================================
RESET
========================================
*/

export async function resetState() {

    localStorage.removeItem(
        STORAGE_KEY
    );


    state = null;


    return await initializeStore();

}

/*
========================================
ATUALIZAÇÃO GENÉRICA
========================================
*/

export function updateValue(
    path,
    value
) {

    if (!Array.isArray(path)) {

        throw new Error(
            "O caminho precisa ser um array."
        );

    }


    let target = state;


    /*
    Percorre tudo até o
    penúltimo item.
    */

    for (
        let i = 0;
        i < path.length - 1;
        i++
    ) {

        target =
            target[path[i]];

    }


    /*
    Último item = propriedade
    que será alterada.
    */

    const lastKey =
        path[path.length - 1];


    target[lastKey] =
        value;


    /*
    Salva automaticamente
    no navegador.
    */

    saveState();


    return state;

}