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

const cartCount = document.getElementById("cart-count");
const checkoutItems = document.getElementById("checkout-items");
const checkoutSubtotal = document.getElementById("checkout-subtotal");
const checkoutTotal = document.getElementById("checkout-total");

const deliveryArea = document.getElementById("delivery-area");


// ==============================
// DELIVERY FEES
// ==============================

const deliveryFees = {
    Amman: 2,
    Zarqa: 3,
    Irbid: 3,
    Balqa: 3,
    Madaba: 3,
    Jerash: 3,
    Ajloun: 3,
    Mafraq: 3,
    Karak: 4,
    Tafilah: 4,
    "Ma'an": 4,
    Aqaba: 4
};


// ==============================
// GET CART
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


// ==============================
// CART COUNT
// ==============================

function updateCartCount() {

    const cart = getCart();

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    if (cartCount) {
        cartCount.textContent = totalQuantity;
    }

}


// ==============================
// CALCULATE SUBTOTAL
// ==============================

function calculateSubtotal() {

    const cart = getCart();

    let subtotal = 0;

    cart.forEach(cartItem => {

        const product = products.find(
            product => product.id === cartItem.id
        );

        if (!product) {
            return;
        }

        subtotal +=
            product.price * cartItem.quantity;

    });

    return subtotal;

}


// ==============================
// DISPLAY ORDER ITEMS
// ==============================

function displayOrderItems() {

    const cart = getCart();

    if (checkoutItems) {
        checkoutItems.innerHTML = "";
    }

    let totalQuantity = 0;


    cart.forEach(cartItem => {

        const product = products.find(
            product => product.id === cartItem.id
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

        totalQuantity += cartItem.quantity;

        const itemTotal =
            product.price * cartItem.quantity;


        const item =
            document.createElement("div");

        item.className =
            "checkout-item";


        item.innerHTML = `

            <div>

                <strong>
                    ${safeProductName}
                </strong>

                ${cartItem.color
                ? `<small>Color: ${safeColor}</small>`
                : ""
            }

                ${cartItem.size
                ? `<small>Size: ${safeSize}</small>`
                : ""
            }

                <small>
                    Quantity: ${cartItem.quantity}
                </small>

            </div>

            <strong>
                ${itemTotal} JOD
            </strong>

        `;


        if (checkoutItems) {
            checkoutItems.appendChild(item);
        }

    });


    const itemsCount =
        document.getElementById(
            "checkout-items-count"
        );


    if (itemsCount) {

        itemsCount.textContent =
            `${totalQuantity} ${totalQuantity === 1
                ? "item"
                : "items"
            }`;

    }

}


// ==============================
// UPDATE PRICE
// ==============================

function updateCheckoutTotal() {

    const subtotal =
        calculateSubtotal();


    const selectedArea =
        deliveryArea.value;


    const deliveryFee =
        deliveryFees[selectedArea] || 0;

    const deliveryHelper =
        document.getElementById(
            "delivery-helper"
        );

    if (deliveryHelper) {

        if (selectedArea) {

            deliveryHelper.style.display =
                "none";

        } else {

            deliveryHelper.style.display =
                "block";

        }

    }


    const total =
        subtotal + deliveryFee;


    // SUBTOTAL

    if (checkoutSubtotal) {

        checkoutSubtotal.textContent =
            `${subtotal} JOD`;

    }


    // DELIVERY FEE

    const checkoutDelivery =
        document.getElementById(
            "checkout-delivery"
        );

    if (checkoutDelivery) {

        checkoutDelivery.textContent =
            deliveryFee > 0
                ? `${deliveryFee} JOD`
                : "—";

    }


    // TOTAL

    if (checkoutTotal) {

        checkoutTotal.textContent =
            `${total} JOD`;

    }

}


// ==============================
// DELIVERY AREA
// ==============================

if (deliveryArea) {

    deliveryArea.addEventListener(
        "change",
        function () {

            updateCheckoutTotal();

        }
    );

}


// ==============================
// CHECKOUT FORM
// ==============================

const checkoutForm =
    document.getElementById(
        "checkout-form"
    );

let isSubmittingOrder =
    false;

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            if (isSubmittingOrder) {
                return;
            }


            // ==============================
            // CUSTOMER DETAILS
            // ==============================

            const customerName =
                document.getElementById(
                    "customer-name"
                ).value.trim();


            const customerPhone =
                document.getElementById(
                    "customer-phone"
                ).value.trim();


            const customerAddress =
                document.getElementById(
                    "customer-address"
                ).value.trim();


            const selectedArea =
                deliveryArea.value;


            // ==============================
            // VALIDATE DELIVERY AREA
            // ==============================

            if (!selectedArea) {

                alert(
                    "Please select your delivery area."
                );

                return;

            }


            // ==============================
            // GET CART
            // ==============================

            const cart =
                getCart();


            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            // ==============================
            // PREPARE SECURE ORDER ITEMS
            // ==============================

            const orderItems =
                cart.map(
                    item => ({

                        id:
                            Number(item.id),

                        quantity:
                            Number(
                                item.quantity
                            ),

                        color:
                            item.color || null,

                        size:
                            item.size || null

                    })
                );

            isSubmittingOrder =
                true;


            const submitButton =
                checkoutForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Placing Order...";

            }


            try {

                // ==============================
                // CREATE ORDER IN SUPABASE
                // ==============================

                const {
                    data,
                    error
                } =
                    await obyaSupabase
                        .rpc(
                            "place_order",
                            {

                                p_customer_name:
                                    customerName,

                                p_phone:
                                    customerPhone,

                                p_governorate:
                                    selectedArea,

                                p_address:
                                    customerAddress,

                                p_notes:
                                    null,

                                p_items:
                                    orderItems

                            }
                        );


                if (error) {

                    throw error;

                }


                if (
                    !data ||
                    !data.order_number
                ) {

                    throw new Error(
                        "The order could not be created."
                    );

                }

                // ==============================
                // SERVER RESPONSE
                // ==============================

                const orderNumber =
                    data.order_number;

                // ==============================
                // CLEAR CART
                // ==============================

                localStorage.removeItem(
                    "obyaCart"
                );


                // ==============================
                // OPEN CONFIRMATION PAGE
                // ==============================

                window.location.href =
                    `order-confirmation.html?order=${encodeURIComponent(
                        orderNumber
                    )}`;


            } catch (error) {

                isSubmittingOrder =
                    false;


                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Place Order";

                }

                console.error(
                    "Order creation failed:",
                    error
                );


                alert(
                    error.message ||
                    "Your order could not be placed. Please try again."
                );

            }

        }
    );

}


// ==============================
// START
// ==============================

updateCartCount();

displayOrderItems();

updateCheckoutTotal();