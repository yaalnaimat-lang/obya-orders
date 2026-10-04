// ==============================
// SHOP PAGE
// ==============================

const shopCategoryOptions =
    document.getElementById(
        "shop-category-options"
    );

const shopSubcategoryOptions =
    document.getElementById(
        "shop-subcategory-options"
    );

const shopProductGrid =
    document.getElementById(
        "shop-product-grid"
    );


let selectedShopCategory =
    null;

let selectedShopSubcategory =
    null;


// ==============================
// SAFE HTML
// ==============================

function escapeShopHTML(value) {

    return String(
        value ?? ""
    )
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ==============================
// DISPLAY CATEGORIES
// ==============================

function displayShopCategories() {

    if (!shopCategoryOptions) {
        return;
    }

    shopCategoryOptions.innerHTML =
        "";


    // ALL PRODUCTS

    const allProductsButton =
        document.createElement(
            "button"
        );

    allProductsButton.type =
        "button";

    allProductsButton.className =
        "subcategory-button active";

    allProductsButton.textContent =
        "All Products";


    allProductsButton.addEventListener(
        "click",
        function () {

            selectedShopCategory =
                null;

            selectedShopSubcategory =
                null;

            updateCategoryButtons(
                allProductsButton
            );

            hideShopSubcategories();

            displayShopProducts();

        }
    );


    shopCategoryOptions.appendChild(
        allProductsButton
    );


    // AVAILABLE CATEGORIES

    categories.forEach(
        category => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "subcategory-button";

            button.textContent =
                category.name;


            button.addEventListener(
                "click",
                function () {

                    selectedShopCategory =
                        category.name;

                    selectedShopSubcategory =
                        null;

                    updateCategoryButtons(
                        button
                    );

                    displayShopSubcategories(
                        category
                    );

                    displayShopProducts();

                }
            );


            shopCategoryOptions.appendChild(
                button
            );

        }
    );

}


// ==============================
// CATEGORY ACTIVE STATE
// ==============================

function updateCategoryButtons(
    selectedButton
) {

    if (!shopCategoryOptions) {
        return;
    }

    shopCategoryOptions
        .querySelectorAll(
            ".subcategory-button"
        )
        .forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );


    selectedButton.classList.add(
        "active"
    );

}


// ==============================
// DISPLAY SUBCATEGORIES
// ==============================

function displayShopSubcategories(
    category
) {

    if (!shopSubcategoryOptions) {
        return;
    }

    shopSubcategoryOptions.innerHTML =
        "";


    const subcategories =
        Array.isArray(
            category.subcategories
        )
            ? category.subcategories
            : [];


    if (subcategories.length === 0) {

        hideShopSubcategories();
        return;

    }


    shopSubcategoryOptions.hidden =
        false;


    // ALL CATEGORY PRODUCTS

    const allButton =
        document.createElement(
            "button"
        );

    allButton.type =
        "button";

    allButton.className =
        "subcategory-button active";

    allButton.textContent =
        "All";


    allButton.addEventListener(
        "click",
        function () {

            selectedShopSubcategory =
                null;

            updateSubcategoryButtons(
                allButton
            );

            displayShopProducts();

        }
    );


    shopSubcategoryOptions.appendChild(
        allButton
    );


    // SUBCATEGORY BUTTONS

    subcategories.forEach(
        subcategory => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "subcategory-button";

            button.textContent =
                subcategory;


            button.addEventListener(
                "click",
                function () {

                    selectedShopSubcategory =
                        subcategory;

                    updateSubcategoryButtons(
                        button
                    );

                    displayShopProducts();

                }
            );


            shopSubcategoryOptions.appendChild(
                button
            );

        }
    );

}


// ==============================
// SUBCATEGORY ACTIVE STATE
// ==============================

function updateSubcategoryButtons(
    selectedButton
) {

    if (!shopSubcategoryOptions) {
        return;
    }

    shopSubcategoryOptions
        .querySelectorAll(
            ".subcategory-button"
        )
        .forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );


    selectedButton.classList.add(
        "active"
    );

}


// ==============================
// HIDE SUBCATEGORIES
// ==============================

function hideShopSubcategories() {

    if (!shopSubcategoryOptions) {
        return;
    }

    shopSubcategoryOptions.hidden =
        true;

    shopSubcategoryOptions.innerHTML =
        "";

}


// ==============================
// DISPLAY PRODUCTS
// ==============================

function displayShopProducts() {

    if (!shopProductGrid) {
        return;
    }

    shopProductGrid.innerHTML =
        "";


    let filteredProducts =
        [...products];


    // CATEGORY FILTER

    if (selectedShopCategory) {

        filteredProducts =
            filteredProducts.filter(
                product =>
                    product.category ===
                    selectedShopCategory
            );

    }


    // SUBCATEGORY FILTER

    if (selectedShopSubcategory) {

        filteredProducts =
            filteredProducts.filter(
                product =>
                    Array.isArray(
                        product.subcategories
                    ) &&
                    product.subcategories.includes(
                        selectedShopSubcategory
                    )
            );

    }


    filteredProducts.forEach(
        product => {

            const productCard =
                document.createElement(
                    "div"
                );

            productCard.className =
                "product-card";


            const safeProductName =
                escapeShopHTML(
                    product.name
                );


            let priceHTML = `

                <p class="product-price">
                    ${product.price} JOD
                </p>

            `;


            if (product.oldPrice) {

                priceHTML = `

                    <p class="product-price">

                        <span class="old-price">
                            ${product.oldPrice} JOD
                        </span>

                        ${product.price} JOD

                    </p>

                `;

            }


            let soldOutHTML =
                "";

            if (product.stock <= 0) {

                soldOutHTML = `

                    <div class="sold-out">
                        SOLD OUT
                    </div>

                `;

            }


            const productImage =
                Array.isArray(
                    product.images
                ) &&
                product.images.length > 0
                    ? product.images[0]
                    : "";


            productCard.innerHTML = `

                <div class="product-image">

                    ${soldOutHTML}

                    <img
                        src="${productImage}"
                        alt="${safeProductName}"
                    >

                </div>


                <div class="product-info">

                    <h3>
                        ${safeProductName}
                    </h3>

                    ${priceHTML}

                    <div class="view-details">

                        ${
                            product.stock <= 0
                                ? "Sold Out"
                                : "View Details →"
                        }

                    </div>

                </div>

            `;


            productCard.addEventListener(
                "click",
                function () {

                    window.location.href =
                        `product.html?id=${product.id}`;

                }
            );


            shopProductGrid.appendChild(
                productCard
            );

        }
    );

}


// ==============================
// START SHOP
// ==============================

displayShopCategories();

hideShopSubcategories();

displayShopProducts();