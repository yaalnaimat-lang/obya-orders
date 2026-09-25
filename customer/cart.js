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
const cartItemsContainer = document.getElementById("cart-items");
const emptyCart = document.getElementById("empty-cart");
const cartSummary = document.getElementById("cart-summary");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const cartTotalFinal = document.getElementById("cart-total-final");


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
                Number(product.stock) <= 0
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
                                cartItem.quantity || 0
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


function displayCart() {

    const cart = getCart();

    cartItemsContainer.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;


    if (cart.length === 0) {

        emptyCart.style.display = "block";
        cartSummary.style.display = "none";
        cartCount.textContent = "0";

        return;
    }


    emptyCart.style.display = "none";
    cartSummary.style.display = "block";


    cart.forEach((cartItem, index) => {

        const product = products.find(
            item => item.id === cartItem.id
        );

        if (!product) {
            return;
        }

        const safeProductName =
            escapeHTML(
                product.name
            );


        const safeColor =
            escapeHTML(
                cartItem.color || ""
            );


        const safeSize =
            escapeHTML(
                cartItem.size || ""
            );

        const totalProductQuantityInCart =
            cart
                .filter(
                    item =>
                        Number(item.id) ===
                        Number(product.id)
                )
                .reduce(
                    (total, item) =>
                        total + Number(item.quantity),
                    0
                );


        const increaseDisabled =
            totalProductQuantityInCart >=
            Number(product.stock);


        const itemTotal =
            product.price * cartItem.quantity;


        total += itemTotal;
        totalQuantity += cartItem.quantity;


        const cartItemElement =
            document.createElement("div");


        cartItemElement.className =
            "cart-item";


        cartItemElement.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${product.images[0]}"
                    alt="${safeProductName}"
                >

            </div>


            <div class="cart-item-details">

                <h3>
                    ${safeProductName}
                </h3>

                <p>
                    ${product.price} JOD
                </p>

                ${cartItem.color
                ? `<p>Color: ${safeColor}</p>`
                : ""
            }

                ${cartItem.size
                ? `<p>Size: ${safeSize}</p>`
                : ""
            }

                <div class="cart-quantity">
                
                <button
                class="decrease"
        data-index="${index}"
    >
        −
    </button>

    <span>
        ${cartItem.quantity}
    </span>

    <button
        class="increase"
        data-index="${index}"
        ${increaseDisabled ? "disabled" : ""}
    >
        +
    </button>

</div>






                    <button
                        class="remove-item"
                        data-index="${index}"
                    >
                        Remove
                    </button>

                </div>

            </div>


            <div class="cart-item-total">

                ${itemTotal} JOD

            </div>

        `;


        cartItemsContainer.appendChild(
            cartItemElement
        );

    });


    cartTotal.textContent =
        `${total} JOD`;


    cartTotalFinal.textContent =
        `${total} JOD`;


    cartCount.textContent =
        totalQuantity;


    const cartItemsLabel =
        document.getElementById("cart-items-label");


    if (cartItemsLabel) {

        cartItemsLabel.textContent =
            `${totalQuantity} ${totalQuantity === 1
                ? "item"
                : "items"
            }`;

    }


    addCartButtonEvents();

}


function addCartButtonEvents() {


    document
        .querySelectorAll(".increase")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        parseInt(
                            button.dataset.index,
                            10
                        );


                    const cart =
                        getCart();


                    const item =
                        cart[index];


                    const product =
                        products.find(
                            product =>
                                product.id === item.id
                        );


                    if (
                        item &&
                        product
                    ) {

                        const totalProductQuantityInCart =
                            cart
                                .filter(
                                    cartItem =>
                                        Number(cartItem.id) ===
                                        Number(item.id)
                                )
                                .reduce(
                                    (total, cartItem) =>
                                        total +
                                        Number(cartItem.quantity),
                                    0
                                );


                        if (
                            totalProductQuantityInCart <
                            Number(product.stock)
                        ) {

                            item.quantity++;

                            saveCart(cart);

                            displayCart();

                        }

                    }

                }
            );

        });


    document
        .querySelectorAll(".decrease")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        parseInt(
                            button.dataset.index,
                            10
                        );


                    const cart =
                        getCart();


                    const item =
                        cart[index];


                    if (!item) {
                        return;
                    }


                    if (item.quantity > 1) {

                        item.quantity--;

                    } else {

                        cart.splice(index, 1);

                    }


                    saveCart(cart);

                    displayCart();

                }
            );

        });


    document
        .querySelectorAll(".remove-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        parseInt(
                            button.dataset.index,
                            10
                        );


                    const cart =
                        getCart();


                    cart.splice(index, 1);


                    saveCart(cart);

                    displayCart();

                }
            );

        });

}


document
    .getElementById("checkout-button")
    .addEventListener(
        "click",
        () => {

            window.location.href =
                "checkout.html";

        }
    );


displayCart();

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


    dropdown.innerHTML =
        "";


    categories.forEach(
        category => {

            const link =
                document.createElement(
                    "a"
                );


            link.href =
                `category.html?category=${category.slug}`;


            link.textContent =
                category.name;


            dropdown.appendChild(
                link
            );

        }
    );


    button.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            const isOpen =
                dropdown.classList.toggle(
                    "open"
                );


            button.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    document.addEventListener(
        "click",
        function () {

            dropdown.classList.remove(
                "open"
            );


            button.setAttribute(
                "aria-expanded",
                "false"
            );

        }
    );

}


displayCategoriesDropdown();