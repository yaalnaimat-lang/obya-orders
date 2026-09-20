const categories = [

    {
        name: "Bags",
        slug: "bags",
        image: "images/categories/bags.jpg",

        subcategories: [
            "Men Bags",
            "Crossbody Bags",
            "Handbags",
            "Shoulder Bags"
        ]
    },

    {
        name: "Wallets",
        slug: "wallets",
        image: "images/categories/wallets.jpg",

        subcategories: [
            "Men",
            "Women"
        ]
    },

    {
        name: "Watches",
        slug: "watches",
        image: "images/categories/watches.jpg",

        subcategories: [
            "Men",
            "Women"
        ]
    },

    {
        name: "Accessories",
        slug: "accessories",
        image: "images/categories/accessories.jpg",

        subcategories: [
            "Men",
            "Women"
        ]
    },

    {
        name: "Slippers",
        slug: "slippers",
        image: "images/categories/slippers.jpg",

        subcategories: [
            "Men",
            "Women"
        ]
    },

    {
        name: "Babies",
        slug: "babies",
        image: "images/categories/babies.jpg",

        subcategories: [
            "0-3",
            "3-6",
            "6-9",
            "9-12",
            "12-18",
            "18-24"
        ]
    },

    {
        name: "Kids",
        slug: "kids",
        image: "images/categories/kids.jpg",

        subcategories: [
            "3 Yrs",
            "4 Yrs",
            "5 Yrs",
            "6 Yrs"
        ]
    }

];

// ==============================
// LOAD ADMIN CATEGORIES
// ==============================

const savedAdminCategoriesRaw =
    localStorage.getItem(
        "obyaAdminCategories"
    );


if (savedAdminCategoriesRaw) {

    try {

        const savedAdminCategories =
            JSON.parse(
                savedAdminCategoriesRaw
            );


        if (
            Array.isArray(
                savedAdminCategories
            )
        ) {

            savedAdminCategories.forEach(
                savedCategory => {

                    const existingCategoryIndex =
                        categories.findIndex(
                            category =>
                                category.slug ===
                                savedCategory.slug
                        );


                    if (
                        existingCategoryIndex !== -1
                    ) {

                        categories[
                            existingCategoryIndex
                        ] =
                            savedCategory;

                    } else {

                        categories.push(
                            savedCategory
                        );

                    }

                }
            );

        }

    } catch (error) {

        console.error(
            "Could not load Admin categories.",
            error
        );

    }

}

// ==============================
// REMOVE DELETED CATEGORIES
// ==============================

const deletedCategoriesRaw =
    localStorage.getItem(
        "obyaDeletedCategories"
    );


if (deletedCategoriesRaw) {

    try {

        const deletedCategorySlugs =
            JSON.parse(
                deletedCategoriesRaw
            );


        if (
            Array.isArray(
                deletedCategorySlugs
            )
        ) {

            for (
                let index =
                    categories.length - 1;
                index >= 0;
                index--
            ) {

                const isDeleted =
                    deletedCategorySlugs.some(
                        deletedSlug =>
                            deletedSlug ===
                            categories[index].slug
                    );


                if (isDeleted) {

                    categories.splice(
                        index,
                        1
                    );

                }

            }

        }

    } catch (error) {

        console.error(
            "Could not load deleted categories.",
            error
        );

    }

}