import { getValue, setValue } from "../data/store.js";


export function bindElement(
    element,
    context = ""
) {

    const path =
        element.dataset.path;


    const field =
        element.dataset.field;


    if (path) {

        writeElement(
            element,
            getValue(path)
        );


        element.dataset.boundPath =
            path;


        return path;

    }


    if (
        field &&
        context
    ) {

        const fullPath =
            `${context}.${field}`;


        writeElement(
            element,
            getValue(fullPath)
        );


        element.dataset.boundPath =
            fullPath;


        return fullPath;

    }


    return null;

}


export function bindContainer(
    container,
    context = ""
) {

    const elements =
        container.querySelectorAll(
            "[data-path], [data-field]"
        );


    elements.forEach(
        element =>
            bindElement(
                element,
                context
            )
    );

}


export function readElement(element) {

    if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement
    ) {

        return element.value;

    }


    return element.textContent.trim();

}


export function writeElement(
    element,
    value
) {

    if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement
    ) {

        element.value =
            value ?? "";


        return;

    }


    element.textContent =
        value ?? "";

}


export function saveBoundElement(
    element
) {

    const path =
        element.dataset.boundPath;


    if (!path) {

        return;

    }


    let value =
        readElement(element);


    if (
        element.type === "number"
    ) {

        value =
            Number(value);

    }


    setValue(
        path,
        value
    );

}