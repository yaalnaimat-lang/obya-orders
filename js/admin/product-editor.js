// ==============================
// STANDALONE PRODUCT EDITOR
// ==============================

const productEditorParams =
    new URLSearchParams(
        window.location.search
    );

const editorProductIdValue =
    productEditorParams.get("id");

const editorProductId =
    editorProductIdValue
        ? Number(editorProductIdValue)
        : null;


const editorPageTitle =
    document.getElementById(
        "admin-product-editor-page-title"
    );

const editorFormTitle =
    document.getElementById(
        "admin-product-form-title"
    );

const editorFormEyebrow =
    document.getElementById(
        "admin-product-form-eyebrow"
    );

const editorBackButton =
    document.getElementById(
        "product-editor-back-button"
    );

const editorCloseButton =
    document.getElementById(
        "close-product-form"
    );

const editorCancelButton =
    document.getElementById(
        "cancel-product-button"
    );


function closeProductEditor() {

    if (
        window.opener &&
        !window.opener.closed
    ) {

        window.close();

        setTimeout(
            function () {

                window.location.href =
                    "index.html#products";

            },
            250
        );

        return;
    }

    window.location.href =
        "index.html#products";

}


function setEditorMode() {

    const isEditMode =
        Number.isInteger(
            editorProductId
        ) &&
        editorProductId > 0;


    if (editorPageTitle) {

        editorPageTitle.textContent =
            isEditMode
                ? "Edit Product"
                : "Add Product";

    }


    if (editorFormTitle) {

        editorFormTitle.textContent =
            isEditMode
                ? "Edit Product"
                : "Add Product";

    }


    if (editorFormEyebrow) {

        editorFormEyebrow.textContent =
            isEditMode
                ? "EDIT PRODUCT"
                : "NEW PRODUCT";

    }


    document.title =
        isEditMode
            ? "Edit Product | Obya Orders"
            : "Add Product | Obya Orders";

}


function bindEditorCloseActions() {

    [
        editorBackButton,
        editorCloseButton,
        editorCancelButton
    ]
        .filter(Boolean)
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopImmediatePropagation();

                        closeProductEditor();

                    },
                    true
                );

            }
        );

}


function findProductForEditor() {

    if (
        !Number.isInteger(
            editorProductId
        ) ||
        editorProductId <= 0
    ) {
        return null;
    }


    return products.find(
        product =>
            Number(product.id) ===
            editorProductId
    ) || null;

}


function waitForProductAndOpenEdit(
    attemptsRemaining = 80
) {

    if (
        !Number.isInteger(
            editorProductId
        ) ||
        editorProductId <= 0
    ) {
        return;
    }


    const productToEdit =
        findProductForEditor();


    if (productToEdit) {

        const productIdInput =
            document.getElementById(
                "admin-product-id"
            );

        if (productIdInput) {

            productIdInput.value =
                productToEdit.id;

            productIdInput.readOnly =
                true;

        }


        const nameInput =
            document.getElementById(
                "admin-product-name"
            );

        if (nameInput) {

            nameInput.value =
                productToEdit.name || "";

        }


        if (adminProductCategory) {

            adminProductCategory.value =
                productToEdit.category || "";

            displayProductSubcategories();

        }


        const stockInput =
            document.getElementById(
                "admin-product-stock"
            );

        if (stockInput) {

            stockInput.value =
                productToEdit.stock ?? "";

        }


        const sortInput =
            document.getElementById(
                "admin-product-sort-order"
            );

        if (sortInput) {

            sortInput.value =
                productToEdit.sortOrder ?? "";

        }


        const priceInput =
            document.getElementById(
                "admin-product-price"
            );

        if (priceInput) {

            priceInput.value =
                productToEdit.price ?? "";

        }


        const oldPriceInput =
            document.getElementById(
                "admin-product-old-price"
            );

        if (oldPriceInput) {

            oldPriceInput.value =
                productToEdit.oldPrice ?? "";

        }


        const descriptionInput =
            document.getElementById(
                "admin-product-description"
            );

        if (descriptionInput) {

            descriptionInput.value =
                productToEdit.description || "";

        }


        const colorsInput =
            document.getElementById(
                "admin-product-colors"
            );

        if (colorsInput) {

            colorsInput.value =
                Array.isArray(
                    productToEdit.colors
                )
                    ? productToEdit.colors.join(
                        ", "
                    )
                    : "";

        }


        const sizesInput =
            document.getElementById(
                "admin-product-sizes"
            );

        if (sizesInput) {

            sizesInput.value =
                Array.isArray(
                    productToEdit.sizes
                )
                    ? productToEdit.sizes.join(
                        ", "
                    )
                    : "";

        }


        document
            .querySelectorAll(
                'input[name="product-subcategory"]'
            )
            .forEach(
                checkbox => {

                    checkbox.checked =
                        Array.isArray(
                            productToEdit.subcategories
                        ) &&
                        productToEdit.subcategories.includes(
                            checkbox.value
                        );

                }
            );


        if (adminDetailRows) {

            adminDetailRows.innerHTML =
                "";

            const productDetails =
                productToEdit.details ||
                productToEdit.Details ||
                {};

            const detailEntries =
                Object.entries(
                    productDetails
                );


            if (
                detailEntries.length > 0
            ) {

                detailEntries.forEach(
                    ([label, value]) => {

                        addProductDetailRow(
                            label,
                            value
                        );

                    }
                );

            } else {

                addProductDetailRow();

            }

        }


        existingEditImages =
            Array.isArray(
                productToEdit.images
            )
                ? [...productToEdit.images]
                : [];


        renderStandaloneExistingImages();


        if (adminProductForm) {

            adminProductForm.dataset
                .editProductId =
                String(editorProductId);

        }


        return;
    }


    if (attemptsRemaining <= 0) {

        alert(
            "The product could not be loaded."
        );

        closeProductEditor();

        return;
    }


    setTimeout(
        function () {

            waitForProductAndOpenEdit(
                attemptsRemaining - 1
            );

        },
        100
    );

}


function renderStandaloneExistingImages() {

    if (mainImagePreview) {

        mainImagePreview.innerHTML =
            "";


        if (
            existingEditImages.length > 0 &&
            existingEditImages[0]
        ) {

            const mainImage =
                existingEditImages[0];


            const mainImageSource =
                (
                    mainImage.startsWith(
                        "data:"
                    ) ||
                    mainImage.startsWith(
                        "http://"
                    ) ||
                    mainImage.startsWith(
                        "https://"
                    )
                )
                    ? mainImage
                    : `../${mainImage}`;


            const mainPreview =
                document.createElement(
                    "div"
                );


            mainPreview.className =
                "admin-image-preview-item main";


            mainPreview.innerHTML = `
                <img
                    src="${mainImageSource}"
                    alt="Main product image"
                >

                <span class="admin-main-badge">
                    MAIN
                </span>

                <button
                    type="button"
                    class="admin-remove-image"
                >
                    ✕
                </button>
            `;


            const removeButton =
                mainPreview.querySelector(
                    ".admin-remove-image"
                );


            removeButton.addEventListener(
                "click",
                function () {

                    existingEditImages[0] =
                        null;

                    renderStandaloneExistingImages();

                }
            );


            mainImagePreview.appendChild(
                mainPreview
            );

        }

    }


    if (additionalImagesPreview) {

        additionalImagesPreview.innerHTML =
            "";


        existingEditImages
            .slice(1)
            .forEach(
                (image, index) => {

                    if (!image) {
                        return;
                    }


                    const imageSource =
                        (
                            image.startsWith(
                                "data:"
                            ) ||
                            image.startsWith(
                                "http://"
                            ) ||
                            image.startsWith(
                                "https://"
                            )
                        )
                            ? image
                            : `../${image}`;


                    const preview =
                        document.createElement(
                            "div"
                        );


                    preview.className =
                        "admin-image-preview-item";


                    preview.innerHTML = `
                        <img
                            src="${imageSource}"
                            alt="Product gallery image"
                        >

                        <button
                            type="button"
                            class="admin-remove-image"
                        >
                            ✕
                        </button>
                    `;


                    const removeButton =
                        preview.querySelector(
                            ".admin-remove-image"
                        );


                    removeButton.addEventListener(
                        "click",
                        function () {

                            existingEditImages.splice(
                                index + 1,
                                1
                            );

                            renderStandaloneExistingImages();

                        }
                    );


                    additionalImagesPreview.appendChild(
                        preview
                    );

                }
            );

    }

}


document.addEventListener(
    "obya:product-saved",
    function () {

        if (
            window.opener &&
            !window.opener.closed
        ) {

            window.opener.location.reload();

        }


        setTimeout(
            closeProductEditor,
            150
        );

    }
);


setEditorMode();

bindEditorCloseActions();


window.obyaAdminReady.then(
    function (isAuthorized) {

        if (!isAuthorized) {
            return;
        }


        waitForProductAndOpenEdit();

    }
);