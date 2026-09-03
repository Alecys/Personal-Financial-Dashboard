import { loadTemplate, loadStyle, createElement } from "../../core/component.js";
import { getCurrentMonth, subscribe } from "../../core/store.js";
import { formatMoney, escapeHTML } from "../../core/formatters.js";

export async function Categories() {
    loadStyle(
        "./css/components/categories.css"
    );

    const html =
        await loadTemplate(
            "./js/components/categories/categories.html"
        );

    const element =
        createElement(html);

    const list =
        element.querySelector(
            '[data-field="list"]'
        );

    function refresh() {
        const month =
            getCurrentMonth();

        const categories =
            calculateCategories(
                month.transactions || []
            );

        list.innerHTML =
            categories
                .map(
                    category => `

                        <div class="category">

                            ${escapeHTML(
                                category.name
                            )}

                            ·

                            ${formatMoney(
                                category.value
                            )}

                        </div>

                    `
                )
                .join("");
    }

    refresh();

    subscribe(() => {
        refresh();
    });

    return element;
}

function calculateCategories(
    transactions
) {

    const groups = {};

    transactions
        .filter(
            transaction =>
                transaction.amount < 0
        )
        .forEach(
            transaction => {

                const name =
                    transaction.group ||
                    "Sem grupo";

                if (!groups[name]) {
                    groups[name] = 0;
                }

                groups[name] +=
                    Math.abs(
                        transaction.amount
                    );
            }
        );

    return Object.entries(groups)
        .map(
            ([name, value]) => ({
                name,
                value
            })
        );
}