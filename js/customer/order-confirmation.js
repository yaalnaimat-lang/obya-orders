const urlParams =
    new URLSearchParams(
        window.location.search
    );


const orderNumber =
    urlParams.get("order");


const orderNumberElement =
    document.getElementById(
        "confirmation-order-number"
    );


if (orderNumberElement) {

    orderNumberElement.textContent =
        orderNumber || "—";

}