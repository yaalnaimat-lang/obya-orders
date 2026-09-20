const productGrid = document.querySelector(".product-grid");

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
// CART
// ==============================

function getCart() {

    const savedCart =
        JSON.parse(
            localStorage.getItem(
                "obyaCart"
            )
        ) || [];


    const normalizedCart =
        [];


    savedCart.forEach(
        item => {

            const product =
                products.find(
                    product =>
                        Number(product.id) ===
                        Number(item.id)
                );


            if (
                !product ||
                product.stock <= 0
            ) {
                return;
            }


            const quantityAlreadyUsed =
                normalizedCart
                    .filter(
                        cartItem =>
                            Number(cartItem.id) ===
                            Number(item.id)
                    )
                    .reduce(
                        (total, cartItem) =>
                            total +
                            Number(
                                cartItem.quantity
                            ),
                        0
                    );


            const remainingStock =
                Math.max(
                    Number(product.stock) -
                    quantityAlreadyUsed,
                    0
                );


            if (remainingStock <= 0) {
                return;
            }


            const safeQuantity =
                Math.min(
                    Number(item.quantity) || 0,
                    remainingStock
                );


            if (safeQuantity <= 0) {
                return;
            }


            const existingItem =
                normalizedCart.find(
                    cartItem =>
                        Number(cartItem.id) ===
                        Number(item.id) &&
                        cartItem.color ===
                        item.color &&
                        cartItem.size ===
                        item.size
                );


            if (existingItem) {

                existingItem.quantity +=
                    safeQuantity;

            } else {

                normalizedCart.push({
                    ...item,
                    quantity:
                        safeQuantity
                });

            }

        }
    );


    localStorage.setItem(
        "obyaCart",
        JSON.stringify(
            normalizedCart
        )
    );


    return normalizedCart;

}

function saveCart(cart) {
    localStorage.setItem("obyaCart", JSON.stringify(cart));
}

function updateCartCount() {

    const cart = getCart();

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartCount =
        document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = totalQuantity;
    }
}


// ==============================
// DISPLAY PRODUCTS
// ==============================

function displayProducts() {

    if (!productGrid) {
        return;
    }

    productGrid.innerHTML = "";

    products.forEach(product => {

        const safeProductName =
            escapeHTML(
                product.name
            );

        const productCard =
            document.createElement("div");

        productCard.className =
            "product-card";


        // ==============================
        // PRICE
        // ==============================

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


        // ==============================
        // SOLD OUT
        // ==============================

        let soldOutHTML = "";

        if (product.stock <= 0) {

            soldOutHTML = `
                <div class="sold-out">
                    SOLD OUT
                </div>
            `;
        }


        // ==============================
        // PRODUCT CARD
        // ==============================

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


        // ==============================
        // OPEN PRODUCT DETAILS
        // ==============================

        productCard.addEventListener(
            "click",
            function () {

                window.location.href =
                    `product.html?id=${product.id}`;

            }
        );


        productGrid.appendChild(productCard);

    });
}


// ==============================
// START
// ==============================

displayProducts();

updateCartCount();

// ==============================
// DISPLAY CATEGORIES
// ==============================

function displayCategories() {

    const categoryGrid =
        document.getElementById(
            "category-grid"
        );


    if (!categoryGrid) {
        return;
    }


    categoryGrid.innerHTML = "";


    categories.forEach(category => {

        const safeCategoryName =
            escapeHTML(
                category.name
            );

        const categoryCard =
            document.createElement("div");


        categoryCard.className =
            "category-card";


        categoryCard.innerHTML = `

    <div class="category-image">

        <img
            src="${category.image}"
            alt="${safeCategoryName}"
        >

        <div class="category-image-overlay"></div>

        <span>
            ${safeCategoryName}
        </span>

    </div>

`;


        categoryCard.addEventListener(
            "click",
            function () {

                window.location.href =
                    `category.html?category=${category.slug}`;

            }
        );


        categoryGrid.appendChild(
            categoryCard
        );

    });

}


displayCategories();
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


        dropdown.appendChild(link);

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


displayCategoriesDropdown();