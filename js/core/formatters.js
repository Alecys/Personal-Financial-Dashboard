export function formatMoney(value) {

    return Number(value || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


export function formatAmount(value) {

    return Number(value || 0).toLocaleString(
        "pt-BR",
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
        "pt-BR",
        {
            month: "long",
            year: "numeric"
        }
    );

}


export function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}