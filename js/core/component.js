const loadedStyles = new Set();


export async function loadTemplate(
    path
) {

    const response =
        await fetch(path);


    if (!response.ok) {

        throw new Error(
            `Could not load:: ${path}`
        );

    }


    return response.text();

}


export function loadStyle(
    path
) {

    if (
        loadedStyles.has(path)
    ) {

        return;

    }


    const link =
        document.createElement("link");


    link.rel = "stylesheet";

    link.href = path;


    document.head.appendChild(link);


    loadedStyles.add(path);

}


export function createElement(
    html
) {

    const template =
        document.createElement(
            "template"
        );


    template.innerHTML =
        html.trim();


    return template.content
        .firstElementChild;

}