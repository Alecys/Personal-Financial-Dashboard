const STORAGE_KEY = "finance-data";

let state = null;

const listeners = new Set();

export async function initializeStore() {

    const saved =
        localStorage.getItem(
            STORAGE_KEY
        );

    if (saved) {

        state =
            JSON.parse(saved);

        syncCurrentMonth();

        saveState();

        return state;

    }

    const response =
        await fetch(
            "./data/finance.json"
        );

    if (!response.ok) {

        throw new Error(
            "Could not load finance.json"
        );

    }

    state =
        await response.json();

    syncCurrentMonth();

    saveState();

    return state;

}

function syncCurrentMonth() {

    const now =
        new Date();

    const currentMonth =
        `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}`;

    if (
        state.months[currentMonth]
    ) {

        state.currentMonth =
            currentMonth;

        return true;

    }

    return false;

}

export function getState() {

    return state;

}

export function getCurrentMonth() {

    const id =
        state.currentMonth;

    const month =
        state.months[id];

    return {
        id,
        ...month
    };

}

export function setCurrentMonth(
    monthId
) {

    if (
        !state.months[monthId]
    ) {
        return;
    }

    state.currentMonth =
        monthId;

    saveState();
    notify();

}

export function subscribe(
    listener
) {

    listeners.add(listener);

    return () => {

        listeners.delete(
            listener
        );

    };

}

function notify() {

    listeners.forEach(
        listener => listener(state)
    );

}

export function updateState(
    callback
) {

    callback(state);

    saveState();
    notify();

}

export function updateCurrentMonth(
    callback
) {

    updateState(state => {

        const month =
            state.months[
                state.currentMonth
            ];

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

    localStorage.removeItem(
        STORAGE_KEY
    );

    window.location.reload();

}