const products = [
    {
        id: 1,
        name: "Classic Wallet",
        category: "Wallets",
        subcategories: [
            "Women"],
        price: 25,
        oldPrice: null,
        description: "A stylish everyday wallet.",
        sizes: [],
        colors: ["Black", "Brown"],
        stock: 0,

        Details: {
            Material: "PU Leather",
            Style: "Classic",
            Dimensions: "19 × 10 × 3 cm",
            Closure: "Zipper"
        },


        images: [
            "images/products/wallet-1.jpg",
            "images/products/wallet-1-2.jpg"
        ]
    },

    {
        id: 2,
        name: "Elegant Watch",
        category: "Watches",
        subcategories: [
            "Women"
        ],
        price: 35,
        oldPrice: 45,
        description: "Elegant watch suitable for everyday wear.",
        sizes: [],
        colors: ["Gold"],
        stock: 5,
        images: [
            "images/products/watch-1.jpg",
            "images/products/watch-1-2.jpg"
        ]
    },

    {
        id: 3,
        name: "Kids Set",
        category: "Kids",
        subcategories: [
            "3 Yrs",
            "4 Yrs",
            "5 Yrs"
        ],
        price: 20,
        oldPrice: null,
        description: "Comfortable and stylish kids clothing set.",
        sizes: ["2Y", "3Y", "4Y"],
        colors: ["Blue", "Pink"],
        stock: 8,

        details: {
            Material: "Cotton",
            Style: "2-piece set",
            Fit: "Regular",
            Season: "Summer"
        },
        images: [
            "images/products/kids-set-1.jpg",
            "images/products/kids-set-1-2.jpg"
        ]
    }
];
// ==============================
// LOAD PRODUCTS ADDED FROM ADMIN
// ==============================

const savedAdminProductsRaw =
    localStorage.getItem(
        "obyaAdminProducts"
    );


if (savedAdminProductsRaw) {

    try {

        const savedAdminProducts =
            JSON.parse(
                savedAdminProductsRaw
            );


        if (
            Array.isArray(
                savedAdminProducts
            )
        ) {

            savedAdminProducts.forEach(
                savedProduct => {

                    const existingProductIndex =
                        products.findIndex(
                            product =>
                                Number(product.id) ===
                                Number(savedProduct.id)
                        );


                    if (existingProductIndex !== -1) {

                        products[
                            existingProductIndex
                        ] =
                            savedProduct;

                    } else {

                        products.push(
                            savedProduct
                        );

                    }

                }
            );

        }

    } catch (error) {

        console.error(
            "Could not load Admin products.",
            error
        );

    }

}
// ==============================
// REMOVE PRODUCTS DELETED IN ADMIN
// ==============================

const deletedProductsRaw =
    localStorage.getItem(
        "obyaDeletedProducts"
    );


if (deletedProductsRaw) {

    try {

        const deletedProductIds =
            JSON.parse(
                deletedProductsRaw
            );


        if (
            Array.isArray(
                deletedProductIds
            )
        ) {

            for (
                let index =
                    products.length - 1;
                index >= 0;
                index--
            ) {

                const isDeleted =
                    deletedProductIds.some(
                        deletedId =>
                            Number(deletedId) ===
                            Number(
                                products[index].id
                            )
                    );


                if (isDeleted) {

                    products.splice(
                        index,
                        1
                    );

                }

            }

        }

    } catch (error) {

        console.error(
            "Could not load deleted products.",
            error
        );

    }

}