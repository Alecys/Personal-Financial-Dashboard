import {
    updateValue
}
from "../data/store.js";


export function bindEditableFields(
    container
) {

    const fields =
        container.querySelectorAll(
            "[data-path]"
        );


    fields.forEach(field => {

        field.addEventListener(
            "change",
            () => {

                const path =
                    JSON.parse(
                        field.dataset.path
                    );


                let value =
                    field.value;


                /*
                Se for input number,
                transforma em número.
                */

                if (
                    field.type === "number"
                ) {

                    value =
                        Number(value);

                }


                updateValue(
                    path,
                    value
                );

            }
        );

    });

}