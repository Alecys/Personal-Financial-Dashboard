export function formatMoney(value) {

    return Number(
        value || 0
    ).toLocaleString(
        "en-US",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}

export function formatAmount(value) {

    return Number(
        value || 0
    ).toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}

export function formatMonth(value) {

    if (!value) {
        return "";
    }

    const id =
        typeof value === "string"
            ? value
            : value.id;

    if (!id) {
        return "";
    }

    const [year, number] =
        id.split("-");

    const date =
        new Date(
            Number(year),
            Number(number) - 1
        );

    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            year: "numeric"
        }
    );

}

export function formatShortDate(
    value
) {

    if (!value) {
        return "";
    }

    const match =
        String(value).match(
            /^(\d{4})-(\d{2})-(\d{2})$/
        );

    if (!match) {
        return value;
    }

    const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC"
    ];

    const month =
        months[
            Number(match[2]) - 1
        ];

    if (!month) {
        return value;
    }

    return `${match[3]} ${month}`;

}

export function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value ?? "";

    return div.innerHTML;

}