const STORAGE_KEY = "finance-data";

let state = null;

const listeners = new Set();

export async function initializeStore() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
        state = JSON.parse(saved);
        return state;
    }

    const response = await fetch("./data/finance.json");

    if (!response.ok) {
        throw new Error("Não foi possível carregar finance.json");
    }

    state = await response.json();

    if (!state.currentMonth) {
        state.currentMonth = Object.keys(state.months)[0];
    }

    saveState();

    return state;
}

export function getState() {
    return state;
}

export function getCurrentMonth() {
    const id = state.currentMonth;
    const month = state.months[id];

    return {
        id,
        ...month
    };
}

export function subscribe(listener) {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

function notify() {
    listeners.forEach(listener => listener(state));
}

export function updateState(callback) {
    callback(state);

    saveState();
    notify();
}

export function updateCurrentMonth(callback) {
    updateState(state => {
        const month =
            state.months[state.currentMonth];

        callback(month);
    });
}

export function saveState() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );
}

export function resetStore() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
}