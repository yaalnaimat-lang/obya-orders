const urlParams =
    new URLSearchParams(
        window.location.search
    );


const productId =
    parseInt(
        urlParams.get("id"),
        10
    );


const product =
    products.find(
        item =>
            Number(item.id) ===
            Number(productId)
    );


const cart =
    JSON.parse(
        localStorage.getItem(
            "obyaCart"
        )
    ) || [];


const cartCount =
    document.getElementById(
        "cart-count"
    );


if (cartCount) {

    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    cartCount.textContent =
        totalQuantity;

}



if (!product) {

    document.body.innerHTML = `

        <h1>
            Product not found
        </h1>

        <p>
            Product ID received:
            ${productId}
        </p>

        <a href="index.html">
            Back to shop
        </a>

    `;

} else {


    document.title =
        `${product.name} | Obya Orders`;



    // ==============================
    // PRODUCT INFORMATION
    // ==============================

    const productName =
        document.getElementById(
            "product-name"
        );


    const productCategory =
        document.getElementById(
            "product-category"
        );


    const productDescription =
        document.getElementById(
            "product-description"
        );


    if (productName) {

        productName.textContent =
            product.name || "";

    }


    if (productCategory) {

        productCategory.textContent =
            product.category || "";

    }


    if (productDescription) {

        productDescription.textContent =
            product.description || "";

    }



    // ==============================
    // PRODUCT DETAILS
    // ==============================

    const productDetailsSection =
        document.getElementById(
            "product-details-section"
        );


    const productDetailsList =
        document.getElementById(
            "product-details-list"
        );


    const productDetails =
        product.details ||
        product.Details ||
        {};


    if (
        productDetailsSection &&
        productDetailsList
    ) {

        productDetailsList.innerHTML =
            "";


        if (
            Object.keys(
                productDetails
            ).length > 0
        ) {

            productDetailsSection.style.display =
                "";


            Object.entries(
                productDetails
            ).forEach(
                ([label, value]) => {

                    const detailRow =
                        document.createElement(
                            "div"
                        );


                    detailRow.className =
                        "product-detail-row";

                    const detailLabel =
                        document.createElement(
                            "span"
                        );

                    detailLabel.className =
                        "product-detail-label";

                    detailLabel.textContent =
                        label;


                    const detailValue =
                        document.createElement(
                            "span"
                        );

                    detailValue.className =
                        "product-detail-value";

                    detailValue.textContent =
                        value;


                    detailRow.appendChild(
                        detailLabel
                    );

                    detailRow.appendChild(
                        detailValue
                    );


                    productDetailsList.appendChild(
                        detailRow
                    );

                }
            );

        } else {

            productDetailsSection.style.display =
                "none";

        }

    }



    // ==============================
    // PRICE
    // ==============================

    const priceContainer =
        document.getElementById(
            "product-price"
        );


    if (priceContainer) {

        if (product.oldPrice) {

            priceContainer.innerHTML = `

                <span class="old-price">
                    ${product.oldPrice} JOD
                </span>

                <strong>
                    ${product.price} JOD
                </strong>

            `;

        } else {

            priceContainer.innerHTML = `

                <strong>
                    ${product.price} JOD
                </strong>

            `;

        }

    }



    // ==============================
    // IMAGES
    // ==============================

    const mainImage =
        document.getElementById(
            "main-product-image"
        );


    const thumbnails =
        document.getElementById(
            "thumbnails"
        );


    if (
        product.images &&
        product.images.length > 0
    ) {

        if (mainImage) {

            mainImage.src =
                product.images[0];

            mainImage.alt =
                product.name;

        }


        if (thumbnails) {

            thumbnails.innerHTML =
                "";


            product.images.forEach(
                (image, index) => {

                    const thumbnail =
                        document.createElement(
                            "img"
                        );


                    thumbnail.src =
                        image;


                    thumbnail.alt =
                        product.name;


                    if (index === 0) {

                        thumbnail.classList.add(
                            "selected"
                        );

                    }


                    thumbnail.addEventListener(
                        "click",
                        () => {

                            if (mainImage) {

                                mainImage.src =
                                    image;

                            }


                            thumbnails
                                .querySelectorAll(
                                    "img"
                                )
                                .forEach(
                                    img => {

                                        img.classList.remove(
                                            "selected"
                                        );

                                    }
                                );


                            thumbnail.classList.add(
                                "selected"
                            );

                        }
                    );


                    thumbnails.appendChild(
                        thumbnail
                    );

                }
            );

        }

    }



    // ==============================
    // COLOR OPTIONS
    // ==============================
    // ==============================
    // COLOR + SIZE AVAILABILITY
    // ==============================

    const colorSection =
        document.getElementById(
            "color-section"
        );


    const colorOptions =
        document.getElementById(
            "color-options"
        );


    const colorHelper =
        document.getElementById(
            "color-helper"
        );


    const sizeSection =
        document.getElementById(
            "size-section"
        );


    const sizeOptions =
        document.getElementById(
            "size-options"
        );


    const sizeHelper =
        document.getElementById(
            "size-helper"
        );


    let selectedColor =
        null;


    let selectedSize =
        null;




    // ==============================
    // DISPLAY COLORS
    // ==============================

    function displayAvailableColors() {

        const colors =
            Array.isArray(
                product.colors
            )
                ? product.colors
                : [];


        if (colors.length === 0) {

            if (colorSection) {

                colorSection.style.display =
                    "none";

            }

            return;

        }


        if (colorSection) {

            colorSection.style.display =
                "";

        }


        if (!colorOptions) {
            return;
        }


        colorOptions.innerHTML =
            "";


        colors.forEach(
            color => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.textContent =
                    color;


                button.className =
                    "option-button";


                button.addEventListener(
                    "click",
                    () => {

                        colorOptions
                            .querySelectorAll(
                                ".option-button"
                            )
                            .forEach(
                                btn => {

                                    btn.classList.remove(
                                        "selected"
                                    );

                                }
                            );


                        button.classList.add(
                            "selected"
                        );


                        selectedColor =
                            color;


                        // Reset size whenever
                        // customer changes color.

                        selectedSize =
                            null;


                        if (colorHelper) {

                            colorHelper.style.display =
                                "none";

                        }


                        displayAvailableSizes();


                        updateAddButtonState();

                    }
                );


                colorOptions.appendChild(
                    button
                );

            }
        );

    }


    // ==============================
    // DISPLAY SIZES
    // ==============================

    function displayAvailableSizes() {

        const sizes =
            Array.isArray(
                product.sizes
            )
                ? product.sizes
                : [];


        if (sizes.length === 0) {

            if (sizeSection) {

                sizeSection.style.display =
                    "none";

            }

            return;

        }


        if (sizeSection) {

            sizeSection.style.display =
                "";

        }


        if (!sizeOptions) {
            return;
        }


        sizeOptions.innerHTML =
            "";


        if (sizeHelper) {

            sizeHelper.style.display =
                "none";

        }

        sizes.forEach(
            size => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.textContent =
                    size;


                button.className =
                    "option-button";


                button.addEventListener(
                    "click",
                    () => {

                        sizeOptions
                            .querySelectorAll(
                                ".option-button"
                            )
                            .forEach(
                                btn => {

                                    btn.classList.remove(
                                        "selected"
                                    );

                                }
                            );


                        button.classList.add(
                            "selected"
                        );


                        selectedSize =
                            size;


                        if (sizeHelper) {

                            sizeHelper.style.display =
                                "none";

                        }


                        updateAddButtonState();

                    }
                );


                sizeOptions.appendChild(
                    button
                );

            }
        );

    }


    // ==============================
    // INITIAL OPTIONS
    // ==============================

    displayAvailableColors();

    displayAvailableSizes();

    // ==============================
    // QUANTITY
    // ==============================

    let quantity =
        product.stock > 0
            ? 1
            : 0;


    const quantityDisplay =
        document.getElementById(
            "quantity"
        );


    if (quantityDisplay) {

        quantityDisplay.textContent =
            quantity;

    }


    const increaseButton =
        document.getElementById(
            "increase"
        );


    const decreaseButton =
        document.getElementById(
            "decrease"
        );


    if (increaseButton) {

        increaseButton.addEventListener(
            "click",
            () => {

                if (
                    quantity <
                    product.stock
                ) {

                    quantity++;


                    if (quantityDisplay) {

                        quantityDisplay.textContent =
                            quantity;

                    }

                }

            }
        );

    }


    if (decreaseButton) {

        decreaseButton.addEventListener(
            "click",
            () => {

                if (quantity > 1) {

                    quantity--;


                    if (quantityDisplay) {

                        quantityDisplay.textContent =
                            quantity;

                    }

                }

            }
        );

    }



    // ==============================
    // ADD TO CART
    // ==============================

    const addButton =
        document.querySelector(
            ".product-add-button"
        );


    function updateAddButtonState() {

        if (!addButton) {
            return;
        }


        if (product.stock <= 0) {

            addButton.textContent =
                "Sold Out";


            addButton.disabled =
                true;


            return;

        }


        const colorRequired =
            product.colors &&
            product.colors.length > 0;


        const sizeRequired =
            product.sizes &&
            product.sizes.length > 0;


        const colorReady =
            !colorRequired ||
            selectedColor !== null;


        const sizeReady =
            !sizeRequired ||
            selectedSize !== null;


        addButton.disabled =
            !(
                colorReady &&
                sizeReady
            );

    }


    updateAddButtonState();



    if (addButton) {

        addButton.addEventListener(
            "click",
            () => {

                if (
                    addButton.disabled ||
                    product.stock <= 0
                ) {

                    return;

                }


                const cart =
                    JSON.parse(
                        localStorage.getItem(
                            "obyaCart"
                        )
                    ) || [];


                const productQuantityInCart =
                    cart
                        .filter(
                            item =>
                                Number(item.id) ===
                                Number(product.id)
                        )
                        .reduce(
                            (total, item) =>
                                total +
                                Number(
                                    item.quantity || 0
                                ),
                            0
                        );


                const remainingStock =
                    Math.max(
                        Number(product.stock) -
                        productQuantityInCart,
                        0
                    );


                if (remainingStock <= 0) {

                    alert(
                        "You already have the maximum available quantity in your cart."
                    );

                    return;

                }


                const quantityToAdd =
                    Math.min(
                        quantity,
                        remainingStock
                    );


                const existingItem =
                    cart.find(
                        item =>
                            Number(item.id) ===
                            Number(product.id) &&
                            item.color ===
                            selectedColor &&
                            item.size ===
                            selectedSize
                    );


                if (existingItem) {

                    existingItem.quantity +=
                        quantityToAdd;

                } else {

                    cart.push({

                        id:
                            product.id,

                        quantity:
                            quantityToAdd,

                        color:
                            selectedColor,

                        size:
                            selectedSize

                    });

                }


                localStorage.setItem(
                    "obyaCart",
                    JSON.stringify(
                        cart
                    )
                );


                const cartCount =
                    document.getElementById(
                        "cart-count"
                    );


                if (cartCount) {

                    const totalQuantity =
                        cart.reduce(
                            (total, item) =>
                                total +
                                Number(
                                    item.quantity || 0
                                ),
                            0
                        );


                    cartCount.textContent =
                        totalQuantity;

                }


                // ==============================
                // CONFIRMATION
                // ==============================

                const originalText =
                    addButton.textContent;


                addButton.textContent =
                    "Added to Cart ✓";


                addButton.disabled =
                    true;


                setTimeout(
                    () => {

                        addButton.textContent =
                            originalText;


                        updateAddButtonState();

                    },
                    1200
                );

            }
        );

    }

}