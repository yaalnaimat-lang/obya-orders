// ==============================
// LOAD STOREFRONT DATA
// ==============================

window.obyaStoreDataReady =
    (async function () {

        try {

            const [
                categoriesResult,
                productsResult
            ] =
                await Promise.all([

                    obyaSupabase
                        .from("categories")
                        .select(
                            "slug, name, image, subcategories"
                        ),

                    obyaSupabase
                        .from("products")
                        .select(
                            "id, name, description, category, subcategories, price, old_price, stock, colors, sizes, details, images"
                        )
                        .order(
                            "id",
                            {
                                ascending: true
                            }
                        )

                ]);


            if (categoriesResult.error) {
                throw categoriesResult.error;
            }


            if (productsResult.error) {
                throw productsResult.error;
            }


            // ==============================
            // CATEGORIES
            // ==============================

            if (
                typeof categories !==
                "undefined" &&
                Array.isArray(categories)
            ) {

                const originalCategoryOrder =
                    categories.map(
                        category =>
                            category.slug
                    );


                const databaseCategories =
                    (categoriesResult.data || [])
                        .map(
                            category => ({

                                slug:
                                    category.slug,

                                name:
                                    category.name,

                                image:
                                    category.image || "",

                                subcategories:
                                    Array.isArray(
                                        category.subcategories
                                    )
                                        ? category.subcategories
                                        : []

                            })
                        );


                const categoryMap =
                    new Map(
                        databaseCategories.map(
                            category => [
                                category.slug,
                                category
                            ]
                        )
                    );


                const orderedCategories =
                    [];


                originalCategoryOrder.forEach(
                    slug => {

                        if (
                            categoryMap.has(
                                slug
                            )
                        ) {

                            orderedCategories.push(
                                categoryMap.get(
                                    slug
                                )
                            );

                            categoryMap.delete(
                                slug
                            );

                        }

                    }
                );


                categoryMap.forEach(
                    category => {

                        orderedCategories.push(
                            category
                        );

                    }
                );


                categories.splice(
                    0,
                    categories.length,
                    ...orderedCategories
                );

            }


            // ==============================
            // PRODUCTS
            // ==============================

            if (
                typeof products !==
                "undefined" &&
                Array.isArray(products)
            ) {

                const databaseProducts =
                    (productsResult.data || [])
                        .map(
                            product => ({

                                id:
                                    Number(
                                        product.id
                                    ),

                                name:
                                    product.name,

                                description:
                                    product.description ||
                                    "",

                                category:
                                    product.category ||
                                    "",

                                subcategories:
                                    Array.isArray(
                                        product.subcategories
                                    )
                                        ? product.subcategories
                                        : [],

                                price:
                                    Number(
                                        product.price
                                    ),

                                oldPrice:
                                    product.old_price ===
                                        null
                                        ? null
                                        : Number(
                                            product.old_price
                                        ),

                                stock:
                                    Number(
                                        product.stock ||
                                        0
                                    ),

                                colors:
                                    Array.isArray(
                                        product.colors
                                    )
                                        ? product.colors
                                        : [],

                                sizes:
                                    Array.isArray(
                                        product.sizes
                                    )
                                        ? product.sizes
                                        : [],

                                details:
                                    product.details ||
                                    {},

                                images:
                                    Array.isArray(
                                        product.images
                                    )
                                        ? product.images
                                        : []

                            })
                        );


                products.splice(
                    0,
                    products.length,
                    ...databaseProducts
                );

            }


            return true;

        } catch (error) {

            console.error(
                "Could not load storefront data from Supabase:",
                error
            );


            if (
                typeof products !==
                "undefined" &&
                Array.isArray(products)
            ) {

                products.splice(
                    0,
                    products.length
                );

            }


            if (
                typeof categories !==
                "undefined" &&
                Array.isArray(categories)
            ) {

                categories.splice(
                    0,
                    categories.length
                );

            }


            return false;

        }

    })();