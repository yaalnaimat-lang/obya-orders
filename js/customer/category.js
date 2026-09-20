// ==============================
// SAFE HTML TEXT
// ==============================

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}

// ==============================
// GET CATEGORY FROM URL
// ==============================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const categorySlug =
    urlParams.get("category");


// ==============================
// FIND CATEGORY
// ==============================

const currentCategory =
    categories.find(
        category =>
            category.slug === categorySlug
    );


// ==============================
// PAGE ELEMENTS
// ==============================

const categoryTitle =
    document.getElementById(
        "category-title"
    );

const subcategoryList =
    document.getElementById(
        "subcategory-list"
    );

const categoryProductGrid =
    document.getElementById(
        "category-product-grid"
    );

const categoryEmpty =
    document.getElementById(
        "category-empty"
    );

const cartCount =
    document.getElementById(
        "cart-count"
    );


// ==============================
// DISPLAY CATEGORY NAME
// ==============================

if (currentCategory && categoryTitle) {

    categoryTitle.textContent =
        currentCategory.name;

    document.title =
        `${currentCategory.name} | Obya Orders`;

}


// ==============================
// CART COUNT
// ==============================

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem(
                "obyaCart"
            )
        ) || [];

    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    if (cartCount) {
        cartCount.textContent =
            totalQuantity;
    }

}


// ==============================
// RENDER PRODUCTS
// ==============================

function displayCategoryProducts(
    selectedSubcategory = "all"
) {

    if (
        !currentCategory ||
        !categoryProductGrid
    ) {
        return;
    }


    categoryProductGrid.innerHTML = "";


    let filteredProducts =
        products.filter(product =>

            product.category
                .toLowerCase() ===
            currentCategory.name
                .toLowerCase()

        );


    if (
        selectedSubcategory !== "all"
    ) {

        filteredProducts =
            filteredProducts.filter(
                product =>

                    product.subcategories &&
                    product.subcategories.some(
                        subcategory =>
                            subcategory.toLowerCase() ===
                            selectedSubcategory.toLowerCase()
                    )

            );

    }


    if (
        filteredProducts.length === 0
    ) {

        if (categoryEmpty) {
            categoryEmpty.style.display =
                "block";
        }

        return;
    }


    if (categoryEmpty) {
        categoryEmpty.style.display =
            "none";
    }


    filteredProducts.forEach(
        product => {

            const safeProductName =
                escapeHTML(
                    product.name
                );

            const productCard =
                document.createElement(
                    "div"
                );

            productCard.className =
                "product-card";


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


            let soldOutHTML = "";


            if (product.stock <= 0) {

                soldOutHTML = `
                    <div class="sold-out">
                        SOLD OUT
                    </div>
                `;

            }


            productCard.innerHTML = `

                <div class="product-image">

                    ${soldOutHTML}

                    <img
                        src="${product.images[0]}"
                        alt="${safeProductName}"
                    >

                </div>


                <div class="product-info">

                    <h3>
                        ${safeProductName}
                    </h3>

                    ${priceHTML}

                    <div class="view-details">

                        ${product.stock <= 0
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


            categoryProductGrid
                .appendChild(
                    productCard
                );

        }
    );

}


// ==============================
// CHANGE ACTIVE TAB
// ==============================

function setActiveButton(button) {

    document
        .querySelectorAll(
            ".subcategory-button"
        )
        .forEach(btn => {

            btn.classList.remove(
                "active"
            );

        });


    button.classList.add(
        "active"
    );

}


// ==============================
// DISPLAY SUBCATEGORIES
// ==============================

if (
    currentCategory &&
    subcategoryList
) {

    subcategoryList.innerHTML = "";


    // ALL BUTTON

    const allButton =
        document.createElement(
            "button"
        );

    allButton.className =
        "subcategory-button active";

    allButton.textContent =
        `All ${currentCategory.name}`;

    allButton.dataset.subcategory =
        "all";


    allButton.addEventListener(
        "click",
        function () {

            setActiveButton(
                allButton
            );

            displayCategoryProducts(
                "all"
            );

        }
    );


    subcategoryList.appendChild(
        allButton
    );


    // SUBCATEGORY BUTTONS

    currentCategory
        .subcategories
        .forEach(subcategory => {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "subcategory-button";

            button.textContent =
                subcategory;

            button.dataset.subcategory =
                subcategory;


            button.addEventListener(
                "click",
                function () {

                    setActiveButton(
                        button
                    );

                    displayCategoryProducts(
                        subcategory
                    );

                }
            );


            subcategoryList.appendChild(
                button
            );

        });

}


// ==============================
// HEADER CATEGORIES DROPDOWN
// ==============================

function displayCategoriesDropdown() {

    const dropdown =
        document.getElementById(
            "categories-dropdown"
        );

    const button =
        document.getElementById(
            "categories-menu-button"
        );


    if (!dropdown || !button) {
        return;
    }


    dropdown.innerHTML = "";


    categories.forEach(category => {

        const link =
            document.createElement("a");

        link.href =
            `category.html?category=${category.slug}`;

        link.textContent =
            category.name;

        dropdown.appendChild(
            link
        );

    });


    button.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            dropdown.classList.toggle(
                "open"
            );

        }
    );


    document.addEventListener(
        "click",
        function () {

            dropdown.classList.remove(
                "open"
            );

        }
    );

}


// ==============================
// START
// ==============================

displayCategoriesDropdown();
displayCategoryProducts();
updateCartCount();