function getAllProducts() {

    return products;

}

// ==============================
// ADMIN ORDERS DATA
// ==============================

let adminOrders = [];

// ==============================
// DASHBOARD COUNTS
// ==============================

const productsCount =
    document.getElementById(
        "admin-products-count"
    );

const categoriesCount =
    document.getElementById(
        "admin-categories-count"
    );

const ordersCount =
    document.getElementById(
        "admin-orders-count"
    );


function updateDashboardCounts() {

    if (productsCount) {

        productsCount.textContent =
            getAllProducts().length;

    }


    if (categoriesCount) {

        categoriesCount.textContent =
            categories.length;

    }


    if (ordersCount) {

        ordersCount.textContent =
            getSavedOrders().length;

    }

}


updateDashboardCounts();


// ==============================
// ADMIN NAVIGATION
// ==============================

const adminNavItems =
    document.querySelectorAll(
        ".admin-nav-item"
    );


const adminSections =
    document.querySelectorAll(
        ".admin-section-view"
    );


function showAdminSection(
    sectionName,
    updateHash = true
) {

    const targetSection =
        document.getElementById(
            `admin-${sectionName}`
        );


    if (!targetSection) {

        sectionName =
            "dashboard";

    }


    adminNavItems.forEach(
        item => {

            item.classList.remove(
                "active"
            );


            if (
                item.dataset.section ===
                sectionName
            ) {

                item.classList.add(
                    "active"
                );

            }

        }
    );


    adminSections.forEach(
        section => {

            section.classList.remove(
                "active"
            );

        }
    );


    const finalTargetSection =
        document.getElementById(
            `admin-${sectionName}`
        );


    if (finalTargetSection) {

        finalTargetSection.classList.add(
            "active"
        );

    }


    if (updateHash) {

        window.location.hash =
            sectionName;

    }

}


adminNavItems.forEach(
    navItem => {

        navItem.addEventListener(
            "click",
            function () {

                const sectionName =
                    navItem.dataset.section;


                showAdminSection(
                    sectionName
                );

            }
        );

    }
);


// ==============================
// RESTORE SECTION AFTER REFRESH
// ==============================

const initialAdminSection =
    window.location.hash
        .replace("#", "") ||
    "dashboard";


showAdminSection(
    initialAdminSection,
    false
);


// ==============================
// PRODUCTS LIST
// ==============================

const adminProductsList =
    document.getElementById(
        "admin-products-list"
    );


function displayAdminProducts() {

    if (!adminProductsList) {
        return;
    }

    adminProductsList.innerHTML =
        "";


    const allProducts =
        getAllProducts();


    allProducts.forEach(product => {

        const productRow =
            document.createElement(
                "div"
            );


        productRow.className =
            "admin-product-row";


        const stockStatus =
            product.stock > 0
                ? `${product.stock} in stock`
                : "Sold Out";

        const safeProductName =
            escapeHTML(
                product.name
            );


        const safeProductCategory =
            escapeHTML(
                product.category
            );

        let imageSource =
            product.images &&
                product.images.length > 0
                ? product.images[0]
                : "";


        if (
            imageSource &&
            !imageSource.startsWith("data:") &&
            !imageSource.startsWith("http://") &&
            !imageSource.startsWith("https://")
        ) {

            imageSource =
                `../${imageSource}`;

        }

        productRow.innerHTML = `

            <div class="admin-product-main">

                <img
                    class="admin-product-image"
                    src="${imageSource}"
                    alt="${safeProductName}"
                >

                <div class="admin-product-info">

                    <strong>
                        ${safeProductName}
                    </strong>

                    <span>
                        ${safeProductCategory}
                    </span>

                </div>

            </div>


            <div class="admin-product-price">

                ${product.oldPrice
                ? `
                            <span class="admin-old-price">
                                ${product.oldPrice} JOD
                            </span>
                        `
                : ""
            }

                <strong>
                    ${product.price} JOD
                </strong>

            </div>


            <div class="admin-product-stock">

                <span
                    class="${product.stock > 0
                ? "stock-available"
                : "stock-sold-out"
            }"
                >
                    ${stockStatus}
                </span>

            </div>


            <div class="admin-product-actions">

              <button
    type="button"
    class="admin-action-button"
    data-edit-product-id="${product.id}"
>
    Edit
</button>

              <button
    type="button"
    class="admin-action-button danger"
    data-delete-product-id="${product.id}"
>
    Delete
</button>

            </div>

        `;


        adminProductsList.appendChild(
            productRow
        );

    });

}


// ==============================
// LOAD PRODUCTS FROM SUPABASE
// ==============================

async function loadProductsFromSupabase() {

    const {
        data,
        error
    } =
        await obyaSupabase
            .from(
                "products"
            )
            .select(
                "id, name, description, category, subcategories, price, old_price, stock, colors, sizes, details, images"
            )
            .order(
                "id",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Could not load products from Supabase:",
            error
        );

        displayAdminProducts();
        return;

    }


    products.splice(
        0,
        products.length,
        ...(data || []).map(
            product => ({

                id:
                    Number(product.id),

                name:
                    product.name,

                description:
                    product.description || "",

                category:
                    product.category || "",

                subcategories:
                    Array.isArray(
                        product.subcategories
                    )
                        ? product.subcategories
                        : [],

                price:
                    Number(product.price),

                oldPrice:
                    product.old_price === null
                        ? null
                        : Number(product.old_price),

                stock:
                    Number(product.stock || 0),

                colors:
                    Array.isArray(product.colors)
                        ? product.colors
                        : [],

                sizes:
                    Array.isArray(product.sizes)
                        ? product.sizes
                        : [],

                details:
                    product.details || {},

                images:
                    Array.isArray(product.images)
                        ? product.images
                        : []

            })
        )
    );


    displayAdminProducts();
    updateDashboardCounts();

}


window.obyaAdminReady.then(
    function (isAuthorized) {

        if (isAuthorized) {
            loadProductsFromSupabase();
        }

    }
);



// ==============================
// ADD PRODUCT FORM
// ==============================

const addProductButton =
    document.getElementById(
        "add-product-button"
    );

const productFormWrapper =
    document.getElementById(
        "admin-product-form-wrapper"
    );

const closeProductForm =
    document.getElementById(
        "close-product-form"
    );

const cancelProductButton =
    document.getElementById(
        "cancel-product-button"
    );

const adminProductForm =
    document.getElementById(
        "admin-product-form"
    );


function openProductForm() {

    if (!productFormWrapper) {
        return;
    }


    productFormWrapper.classList.add(
        "open"
    );


    productFormWrapper.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


function closeProductFormPanel() {

    if (!productFormWrapper) {
        return;
    }


    productFormWrapper.classList.remove(
        "open"
    );

}


if (addProductButton) {

    addProductButton.addEventListener(
        "click",
        openProductForm
    );

}


if (closeProductForm) {

    closeProductForm.addEventListener(
        "click",
        closeProductFormPanel
    );

}


if (cancelProductButton) {

    cancelProductButton.addEventListener(
        "click",
        closeProductFormPanel
    );

}



// ==============================
// PRODUCT CATEGORY + SUBCATEGORIES
// ==============================

const adminProductCategory =
    document.getElementById(
        "admin-product-category"
    );

const adminSubcategoryOptions =
    document.getElementById(
        "admin-subcategory-options"
    );


function loadProductCategories() {

    if (!adminProductCategory) {
        return;
    }


    adminProductCategory.innerHTML = `
        <option value="">
            Select category
        </option>
    `;


    categories.forEach(category => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            category.name;


        option.textContent =
            category.name;


        adminProductCategory.appendChild(
            option
        );

    });

}


function displayProductSubcategories() {

    if (
        !adminProductCategory ||
        !adminSubcategoryOptions
    ) {
        return;
    }


    const selectedCategoryName =
        adminProductCategory.value;


    if (!selectedCategoryName) {

        adminSubcategoryOptions.textContent =
            "Select a category first.";

        return;

    }


    const selectedCategory =
        categories.find(
            category =>
                category.name ===
                selectedCategoryName
        );


    if (
        !selectedCategory ||
        !selectedCategory.subcategories ||
        selectedCategory.subcategories.length === 0
    ) {

        adminSubcategoryOptions.textContent =
            "No subcategories available.";

        return;

    }


    adminSubcategoryOptions.textContent =
        "";


    selectedCategory.subcategories.forEach(
        subcategory => {

            const label =
                document.createElement(
                    "label"
                );


            label.className =
                "admin-subcategory-choice";


            const checkbox =
                document.createElement(
                    "input"
                );


            checkbox.type =
                "checkbox";

            checkbox.name =
                "product-subcategory";

            checkbox.value =
                subcategory;


            const text =
                document.createElement(
                    "span"
                );


            text.textContent =
                subcategory;


            label.appendChild(
                checkbox
            );

            label.appendChild(
                text
            );


            adminSubcategoryOptions.appendChild(
                label
            );

        }
    );

}


if (adminProductCategory) {

    adminProductCategory.addEventListener(
        "change",
        displayProductSubcategories
    );

}


loadProductCategories();


// ==============================
// PRODUCT IMAGE PREVIEWS
// ==============================

const mainImageInput =
    document.getElementById(
        "admin-main-image"
    );

const mainImagePreview =
    document.getElementById(
        "admin-main-image-preview"
    );

const additionalImagesInput =
    document.getElementById(
        "admin-additional-images"
    );

const additionalImagesPreview =
    document.getElementById(
        "admin-additional-images-preview"
    );


let selectedAdditionalImages =
    [];
let existingEditImages =
    [];



// ==============================
// MAIN IMAGE PREVIEW
// ==============================

if (
    mainImageInput &&
    mainImagePreview
) {

    mainImageInput.addEventListener(
        "change",
        function () {

            mainImagePreview.innerHTML =
                "";


            const file =
                mainImageInput.files[0];


            if (!file) {
                return;
            }


            const imageURL =
                URL.createObjectURL(
                    file
                );


            const preview =
                document.createElement(
                    "div"
                );


            preview.className =
                "admin-image-preview-item main";


            preview.innerHTML = `

                <img
                    src="${imageURL}"
                    alt="Main product image"
                >

                <span class="admin-main-badge">
                    MAIN
                </span>

                <button
                    type="button"
                    class="admin-remove-image"
                >
                    ✕
                </button>

            `;


            const removeButton =
                preview.querySelector(
                    ".admin-remove-image"
                );


            removeButton.addEventListener(
                "click",
                function () {

                    mainImageInput.value =
                        "";


                    mainImagePreview.innerHTML =
                        "";


                    URL.revokeObjectURL(
                        imageURL
                    );

                }
            );


            mainImagePreview.appendChild(
                preview
            );

        }
    );

}



// ==============================
// ADDITIONAL IMAGE PREVIEWS
// ==============================

if (
    additionalImagesInput &&
    additionalImagesPreview
) {

    additionalImagesInput.addEventListener(
        "change",
        function () {

            selectedAdditionalImages =
                Array.from(
                    additionalImagesInput.files
                );


            renderAdditionalImages();

        }
    );

}


function renderAdditionalImages() {

    if (!additionalImagesPreview) {
        return;
    }


    additionalImagesPreview.innerHTML =
        "";


    selectedAdditionalImages.forEach(
        (file, index) => {

            const imageURL =
                URL.createObjectURL(
                    file
                );


            const preview =
                document.createElement(
                    "div"
                );


            preview.className =
                "admin-image-preview-item";


            preview.innerHTML = `

                <img
                    src="${imageURL}"
                    alt="Product gallery image"
                >

                <button
                    type="button"
                    class="admin-remove-image"
                >
                    ✕
                </button>

            `;


            const removeButton =
                preview.querySelector(
                    ".admin-remove-image"
                );


            removeButton.addEventListener(
                "click",
                function () {

                    selectedAdditionalImages.splice(
                        index,
                        1
                    );


                    URL.revokeObjectURL(
                        imageURL
                    );


                    renderAdditionalImages();

                }
            );


            additionalImagesPreview.appendChild(
                preview
            );

        }
    );

}



// ==============================
// PRODUCT DETAILS BUILDER
// ==============================

const adminDetailRows =
    document.getElementById(
        "admin-detail-rows"
    );

const adminAddDetailButton =
    document.getElementById(
        "admin-add-detail-button"
    );


function addProductDetailRow(
    label = "",
    value = ""
) {

    if (!adminDetailRows) {
        return;
    }


    const row =
        document.createElement(
            "div"
        );


    row.className =
        "admin-detail-row";


    const labelInput =
        document.createElement(
            "input"
        );

    labelInput.type =
        "text";

    labelInput.className =
        "admin-detail-label";

    labelInput.placeholder =
        "Detail name";

    labelInput.value =
        label;


    const valueInput =
        document.createElement(
            "input"
        );

    valueInput.type =
        "text";

    valueInput.className =
        "admin-detail-value";

    valueInput.placeholder =
        "Value";

    valueInput.value =
        value;


    const removeButton =
        document.createElement(
            "button"
        );

    removeButton.type =
        "button";

    removeButton.className =
        "admin-remove-detail";

    removeButton.title =
        "Remove detail";

    removeButton.textContent =
        "✕";


    removeButton.addEventListener(
        "click",
        function () {

            row.remove();

        }
    );


    row.appendChild(
        labelInput
    );

    row.appendChild(
        valueInput
    );

    row.appendChild(
        removeButton
    );


    adminDetailRows.appendChild(
        row
    );

}

if (adminAddDetailButton) {

    adminAddDetailButton.addEventListener(
        "click",
        function () {

            addProductDetailRow();

        }
    );

}


addProductDetailRow();

// ==============================
// UPLOAD IMAGE TO SUPABASE
// ==============================

async function fileToDataURL(file) {

    if (!file) {
        return null;
    }


    const fileExtension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const safeFileName =
        file.name
            .replace(
                /[^a-zA-Z0-9._-]/g,
                "-"
            );


    const uniqueFileName =
        `${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;


    const filePath =
        `uploads/${uniqueFileName}`;


    const {
        error: uploadError
    } =
        await obyaSupabase.storage
            .from(
                "obya-images"
            )
            .upload(
                filePath,
                file,
                {
                    cacheControl: "3600",
                    upsert: false
                }
            );


    if (uploadError) {

        console.error(
            "Image upload failed:",
            uploadError
        );

        throw new Error(
            "Could not upload image."
        );

    }


    const {
        data
    } =
        obyaSupabase.storage
            .from(
                "obya-images"
            )
            .getPublicUrl(
                filePath
            );


    return data.publicUrl;

}

// ==============================
// DELETE IMAGE FROM SUPABASE
// ==============================

async function deleteSupabaseImage(
    imageURL
) {

    if (
        !imageURL ||
        !imageURL.startsWith("https://")
    ) {
        return;
    }


    const storageMarker =
        "/storage/v1/object/public/obya-images/";


    const markerIndex =
        imageURL.indexOf(
            storageMarker
        );


    if (markerIndex === -1) {
        return;
    }


    const filePath =
        decodeURIComponent(
            imageURL.substring(
                markerIndex +
                storageMarker.length
            )
        );


    const {
        error
    } =
        await obyaSupabase.storage
            .from(
                "obya-images"
            )
            .remove([
                filePath
            ]);


    if (error) {

        console.error(
            "Could not delete image from Supabase Storage:",
            error
        );

    }

}


// ==============================
// GENERATE PRODUCT ID
// ==============================

function generateProductId() {

    const allProducts =
        getAllProducts();


    const ids =
        allProducts
            .map(
                product =>
                    Number(
                        product.id
                    )
            )
            .filter(
                id =>
                    !Number.isNaN(
                        id
                    )
            );


    if (ids.length === 0) {
        return 1;
    }


    return Math.max(
        ...ids
    ) + 1;

}



// ==============================
// RESET PRODUCT FORM
// ==============================

function resetProductForm() {

    if (!adminProductForm) {
        return;
    }


    adminProductForm.reset();

    const productIdInput =
        document.getElementById(
            "admin-product-id"
        );


    if (productIdInput) {

        productIdInput.readOnly =
            false;

    }

    delete adminProductForm.dataset.editProductId;



    selectedAdditionalImages =
        [];


    if (mainImagePreview) {

        mainImagePreview.innerHTML =
            "";

    }


    if (additionalImagesPreview) {

        additionalImagesPreview.innerHTML =
            "";

    }


    if (adminSubcategoryOptions) {

        adminSubcategoryOptions.innerHTML =
            "Select a category first.";

    }


    if (adminDetailRows) {

        adminDetailRows.innerHTML =
            "";

        addProductDetailRow();

    }

}



// ==============================
// SAVE PRODUCT
// ==============================

if (adminProductForm) {

    adminProductForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const editingProductId =
                adminProductForm.dataset.editProductId
                    ? Number(
                        adminProductForm.dataset.editProductId
                    )
                    : null;


            event.preventDefault();


            // ==============================
            // PRODUCT ID
            // ==============================

            const productId =
                Number(
                    document
                        .getElementById(
                            "admin-product-id"
                        )
                        .value
                );


            // ==============================
            // PRODUCT NAME
            // ==============================

            const productName =
                document
                    .getElementById(
                        "admin-product-name"
                    )
                    .value
                    .trim();


            const category =
                adminProductCategory.value;


            const stock =
                Number(
                    document
                        .getElementById(
                            "admin-product-stock"
                        )
                        .value
                );


            const price =
                Number(
                    document
                        .getElementById(
                            "admin-product-price"
                        )
                        .value
                );


            const oldPriceValue =
                document
                    .getElementById(
                        "admin-product-old-price"
                    )
                    .value;


            const oldPrice =
                oldPriceValue
                    ? Number(
                        oldPriceValue
                    )
                    : null;


            const description =
                document
                    .getElementById(
                        "admin-product-description"
                    )
                    .value
                    .trim();


            const colorsValue =
                document
                    .getElementById(
                        "admin-product-colors"
                    )
                    .value;


            const sizesValue =
                document
                    .getElementById(
                        "admin-product-sizes"
                    )
                    .value;


            const colors =
                colorsValue
                    .split(",")
                    .map(
                        item =>
                            item.trim()
                    )
                    .filter(Boolean);


            const sizes =
                sizesValue
                    .split(",")
                    .map(
                        item =>
                            item.trim()
                    )
                    .filter(Boolean);


            const selectedSubcategories =
                Array.from(
                    document.querySelectorAll(
                        'input[name="product-subcategory"]:checked'
                    )
                ).map(
                    checkbox =>
                        checkbox.value
                );


            // ==============================
            // // VALIDATION
            // // ==============================


            // PRODUCT ID

            if (
                !Number.isInteger(productId) ||
                productId <= 0
            ) {

                alert(
                    "Please enter a valid Product ID."
                );

                return;

            }


            const duplicateProduct =
                products.find(
                    product =>
                        Number(product.id) ===
                        Number(productId) &&
                        Number(product.id) !==
                        Number(editingProductId)
                );


            if (duplicateProduct) {

                alert(
                    "This Product ID is already being used."
                );

                return;

            }


            // PRODUCT NAME

            if (!productName) {

                alert(
                    "Please enter the product name."
                );

                return;

            }


            if (!category) {

                alert(
                    "Please select a category."
                );

                return;

            }


            if (
                !Number.isInteger(stock) ||
                stock < 0
            ) {

                alert(
                    "Please enter a whole-number stock quantity."
                );

                return;

            }


            if (
                Number.isNaN(price) ||
                price < 0
            ) {

                alert(
                    "Please enter a valid product price."
                );

                return;

            }


            if (!description) {

                alert(
                    "Please enter a product description."
                );

                return;

            }




            const hasNewMainImage =
                mainImageInput &&
                mainImageInput.files[0];


            const hasExistingMainImage =
                editingProductId &&
                existingEditImages[0];


            if (
                !hasNewMainImage &&
                !hasExistingMainImage
            ) {

                alert(
                    "Please upload a main product image."
                );

                return;

            }


            // ==============================
            // PRODUCT DETAILS
            // ==============================

            const details =
                {};


            const detailRows =
                document.querySelectorAll(
                    ".admin-detail-row"
                );


            detailRows.forEach(
                row => {

                    const detailName =
                        row
                            .querySelector(
                                ".admin-detail-label"
                            )
                            .value
                            .trim();


                    const detailValue =
                        row
                            .querySelector(
                                ".admin-detail-value"
                            )
                            .value
                            .trim();


                    if (
                        detailName &&
                        detailValue
                    ) {

                        details[
                            detailName
                        ] =
                            detailValue;

                    }

                }
            );


            try {

                // ==============================
                // IMAGES
                // ==============================

                const existingProduct =
                    editingProductId
                        ? products.find(
                            product =>
                                Number(product.id) ===
                                editingProductId
                        )
                        : null;


                let mainImage = null;


                if (
                    mainImageInput &&
                    mainImageInput.files[0]
                ) {

                    mainImage =
                        await fileToDataURL(
                            mainImageInput.files[0]
                        );

                } else if (
                    editingProductId &&
                    existingEditImages[0]
                ) {

                    mainImage =
                        existingEditImages[0];

                }


                const newAdditionalImages =
                    await Promise.all(
                        selectedAdditionalImages.map(
                            file =>
                                fileToDataURL(
                                    file
                                )
                        )
                    );


                const existingAdditionalImages =
                    editingProductId
                        ? existingEditImages.slice(1)
                        : [];


                const productImages =
                    [
                        mainImage,
                        ...existingAdditionalImages,
                        ...newAdditionalImages
                    ].filter(Boolean);

                // ==============================
                // CREATE PRODUCT
                // ==============================


                const newProduct = {

                    id:
                        productId,

                    name:
                        productName,

                    category:
                        category,

                    subcategories:
                        selectedSubcategories,

                    price:
                        price,

                    oldPrice:
                        oldPrice,

                    description:
                        description,

                    sizes:
                        sizes,

                    colors:
                        colors,

                    stock:
                        stock,

                    images:
                        productImages,

                    details:
                        details,

                    adminCreated:
                        true

                };


                // ==============================
                // PREPARE PRODUCT ID
                // ==============================

                if (editingProductId) {

                    newProduct.id =
                        editingProductId;

                }


                // ==============================
                // SAVE PRODUCT TO SUPABASE
                // ==============================

                const {
                    error: productSaveError
                } =
                    await obyaSupabase
                        .from(
                            "products"
                        )
                        .upsert(
                            {
                                id:
                                    Number(newProduct.id),

                                name:
                                    newProduct.name,

                                description:
                                    newProduct.description || null,

                                category:
                                    newProduct.category || null,

                                subcategories:
                                    Array.isArray(
                                        newProduct.subcategories
                                    )
                                        ? newProduct.subcategories
                                        : [],

                                price:
                                    Number(newProduct.price),

                                old_price:
                                    newProduct.oldPrice
                                        ? Number(newProduct.oldPrice)
                                        : null,

                                stock:
                                    Number(newProduct.stock || 0),

                                colors:
                                    Array.isArray(
                                        newProduct.colors
                                    )
                                        ? newProduct.colors
                                        : [],

                                sizes:
                                    Array.isArray(
                                        newProduct.sizes
                                    )
                                        ? newProduct.sizes
                                        : [],

                                details:
                                    newProduct.details || {},

                                images:
                                    Array.isArray(
                                        newProduct.images
                                    )
                                        ? newProduct.images
                                        : [],

                                updated_at:
                                    new Date()
                                        .toISOString()
                            },
                            {
                                onConflict:
                                    "id"
                            }
                        );


                if (productSaveError) {

                    console.error(
                        "Could not save product to Supabase:",
                        productSaveError
                    );

                    throw productSaveError;
                }

                // ==============================
                // UPDATE CURRENT PRODUCT LIST
                // ==============================

                const productIndex =
                    products.findIndex(
                        product =>
                            Number(product.id) ===
                            Number(newProduct.id)
                    );


                if (productIndex !== -1) {

                    products[
                        productIndex
                    ] =
                        newProduct;

                } else {

                    products.push(
                        newProduct
                    );

                }

                // ==============================
                // REFRESH ADMIN
                // ==============================

                displayAdminProducts();

                updateDashboardCounts();

                resetProductForm();

                closeProductFormPanel();


                alert(
                    "Product saved successfully."
                );


            } catch (error) {

                console.error(
                    error
                );


                alert(
                    "The product could not be saved. Try using smaller images."
                );

            }

        }
    );

}
// ==============================
// DELETE PRODUCT
// ==============================

document.addEventListener(
    "click",
    async function (event) {

        const deleteButton =
            event.target.closest(
                "[data-delete-product-id]"
            );


        if (!deleteButton) {
            return;
        }


        const productId =
            Number(
                deleteButton.dataset
                    .deleteProductId
            );


        const productToDelete =
            products.find(
                product =>
                    Number(product.id) ===
                    productId
            );


        if (!productToDelete) {
            return;
        }


        const confirmed =
            confirm(
                `Delete "${productToDelete.name}"?`
            );


        if (!confirmed) {
            return;
        }

        // ==============================
        // DELETE PRODUCT FROM SUPABASE
        // ==============================

        const {
            error: productDeleteError
        } =
            await obyaSupabase
                .from(
                    "products"
                )
                .delete()
                .eq(
                    "id",
                    productId
                );


        if (productDeleteError) {

            console.error(
                "Could not delete product from Supabase:",
                productDeleteError
            );

            alert(
                "The product could not be deleted."
            );

            return;
        }




        const productIndex =
            products.findIndex(
                product =>
                    Number(product.id) ===
                    productId
            );


        if (productIndex !== -1) {

            products.splice(
                productIndex,
                1
            );

        }


        displayAdminProducts();

        updateDashboardCounts();

    }
);

// ==============================
// EDIT PRODUCT
// ==============================

document.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.matches(
                "[data-edit-product-id]"
            )
        ) {
            return;
        }


        event.preventDefault();

        event.stopPropagation();


        const editButton =
            event.target;



        const productId =
            Number(
                editButton.dataset
                    .editProductId
            );


        const productToEdit =
            products.find(
                product =>
                    Number(product.id) ===
                    productId
            );


        if (!productToEdit) {
            return;
        }

        // ==============================
        // PRODUCT ID
        // ==============================

        const productIdInput =
            document.getElementById(
                "admin-product-id"
            );


        if (productIdInput) {

            productIdInput.value =
                productToEdit.id;

            productIdInput.readOnly =
                true;

        }

        existingEditImages =
            Array.isArray(
                productToEdit.images
            )
                ? [...productToEdit.images]
                : [];

        // ==============================
        // SHOW EXISTING IMAGES IN EDIT
        // ==============================

        function renderExistingEditImages() {

            // MAIN IMAGE
            if (mainImagePreview) {

                mainImagePreview.innerHTML =
                    "";


                if (
                    existingEditImages.length > 0 &&
                    existingEditImages[0]
                ) {

                    const mainImage =
                        existingEditImages[0];


                    const mainImageSource =
                        (
                            mainImage.startsWith("data:") ||
                            mainImage.startsWith("http://") ||
                            mainImage.startsWith("https://")
                        )
                            ? mainImage
                            : `../${mainImage}`;


                    const mainPreview =
                        document.createElement(
                            "div"
                        );


                    mainPreview.className =
                        "admin-image-preview-item main";


                    mainPreview.innerHTML = `

                <img
                    src="${mainImageSource}"
                    alt="Main product image"
                >

                <span class="admin-main-badge">
                    MAIN
                </span>

                <button
                    type="button"
                    class="admin-remove-image"
                >
                    ✕
                </button>

            `;


                    const removeMainButton =
                        mainPreview.querySelector(
                            ".admin-remove-image"
                        );


                    removeMainButton.addEventListener(
                        "click",
                        function () {

                            existingEditImages[0] =
                                null;


                            renderExistingEditImages();

                        }
                    );


                    mainImagePreview.appendChild(
                        mainPreview
                    );

                }

            }


            // ADDITIONAL IMAGES
            if (additionalImagesPreview) {

                additionalImagesPreview.innerHTML =
                    "";


                existingEditImages
                    .slice(1)
                    .forEach(
                        (image, index) => {

                            const imageSource =
                                (
                                    image.startsWith("data:") ||
                                    image.startsWith("http://") ||
                                    image.startsWith("https://")
                                )
                                    ? image
                                    : `../${image}`;


                            const preview =
                                document.createElement(
                                    "div"
                                );


                            preview.className =
                                "admin-image-preview-item";


                            preview.innerHTML = `

                        <img
                            src="${imageSource}"
                            alt="Product gallery image"
                        >

                        <button
                            type="button"
                            class="admin-remove-image"
                        >
                            ✕
                        </button>

                    `;


                            const removeButton =
                                preview.querySelector(
                                    ".admin-remove-image"
                                );


                            removeButton.addEventListener(
                                "click",
                                function () {

                                    existingEditImages.splice(
                                        index + 1,
                                        1
                                    );


                                    renderExistingEditImages();

                                }
                            );


                            additionalImagesPreview.appendChild(
                                preview
                            );

                        }
                    );

            }

        }


        renderExistingEditImages();

        openProductForm();


        document.getElementById(
            "admin-product-name"
        ).value =
            productToEdit.name || "";


        adminProductCategory.value =
            productToEdit.category || "";


        displayProductSubcategories();


        document.getElementById(
            "admin-product-stock"
        ).value =
            productToEdit.stock ?? "";


        document.getElementById(
            "admin-product-price"
        ).value =
            productToEdit.price ?? "";


        document.getElementById(
            "admin-product-old-price"
        ).value =
            productToEdit.oldPrice ?? "";


        document.getElementById(
            "admin-product-description"
        ).value =
            productToEdit.description || "";


        document.getElementById(
            "admin-product-colors"
        ).value =
            Array.isArray(
                productToEdit.colors
            )
                ? productToEdit.colors.join(", ")
                : "";


        document.getElementById(
            "admin-product-sizes"
        ).value =
            Array.isArray(
                productToEdit.sizes
            )
                ? productToEdit.sizes.join(", ")
                : "";



        const subcategoryCheckboxes =
            document.querySelectorAll(
                'input[name="product-subcategory"]'
            );


        subcategoryCheckboxes.forEach(
            checkbox => {

                checkbox.checked =
                    Array.isArray(
                        productToEdit.subcategories
                    ) &&
                    productToEdit.subcategories.includes(
                        checkbox.value
                    );

            }
        );


        if (adminDetailRows) {

            adminDetailRows.innerHTML =
                "";


            const productDetails =
                productToEdit.details ||
                productToEdit.Details ||
                {};


            const detailEntries =
                Object.entries(
                    productDetails
                );


            if (detailEntries.length > 0) {

                detailEntries.forEach(
                    ([label, value]) => {

                        addProductDetailRow(
                            label,
                            value
                        );

                    }
                );

            } else {

                addProductDetailRow();

            }

        }


        adminProductForm.dataset.editProductId =
            productId;

    }
);

// ==============================
// DISPLAY ADMIN CATEGORIES
// ==============================

const adminCategoriesList =
    document.getElementById(
        "admin-categories-list"
    );


function displayAdminCategories() {

    if (!adminCategoriesList) {
        return;
    }


    adminCategoriesList.innerHTML = "";


    categories.forEach(category => {

        const categoryCard =
            document.createElement(
                "article"
            );


        categoryCard.className =
            "admin-category-card";


        // ==============================
        // CATEGORY IMAGE
        // ==============================

        let imageSource =
            category.image || "";


        if (
            imageSource &&
            !imageSource.startsWith("data:") &&
            !imageSource.startsWith("http://") &&
            !imageSource.startsWith("https://")
        ) {

            imageSource =
                `../${imageSource}`;

        }


        // ==============================
        // SUBCATEGORIES
        // ==============================

        const subcategories =
            Array.isArray(
                category.subcategories
            )
                ? category.subcategories
                : [];


        const subcategoryCount =
            subcategories.length;

        const safeCategoryName =
            escapeHTML(
                category.name
            );


        const subcategoriesHTML =
            subcategoryCount > 0
                ? subcategories
                    .map(
                        subcategory => `
        <span class="admin-category-subcategory">
            ${escapeHTML(
                            subcategory
                        )}
        </span>
    `
                    )
                    .join("")
                : `
                    <span class="admin-category-no-subcategories">
                        No subcategories
                    </span>
                `;


        // ==============================
        // CARD
        // ==============================

        categoryCard.innerHTML = `

            <div class="admin-category-image-wrapper">

                ${imageSource
                ? `
                            <img
                                class="admin-category-image"
                                src="${imageSource}"
                                alt="${safeCategoryName}"
                            >
                        `
                : `
                            <div class="admin-category-image-placeholder">
                                No image
                            </div>
                        `
            }

            </div>


            <div class="admin-category-content">

                <div class="admin-category-heading">

                    <div>

                        <span class="admin-category-label">
                            CATEGORY
                        </span>

                        <h3>
                            ${safeCategoryName}
                        </h3>

                    </div>


                    <span class="admin-category-count">

                        ${subcategoryCount}
                        ${subcategoryCount === 1
                ? "subcategory"
                : "subcategories"
            }

                    </span>

                </div>


                <div class="admin-category-subcategories">

                    ${subcategoriesHTML}

                </div>

            </div>


            <div class="admin-category-actions">

                <button
                    type="button"
                    class="admin-action-button"
                    data-edit-category-slug="${category.slug}"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="admin-action-button danger"
                    data-delete-category-slug="${category.slug}"
                >
                    Delete
                </button>

            </div>

        `;


        adminCategoriesList.appendChild(
            categoryCard
        );

    });

}

// ==============================
// LOAD CATEGORIES FROM SUPABASE
// ==============================

async function loadCategoriesFromSupabase() {

    const {
        data,
        error
    } =
        await obyaSupabase
            .from(
                "categories"
            )
            .select(
                "slug, name, image, subcategories"
            );


    if (error) {

        console.error(
            "Could not load categories from Supabase:",
            error
        );

        displayAdminCategories();
        return;

    }


    categories.splice(
        0,
        categories.length,
        ...(data || []).map(
            category => ({
                slug:
                    category.slug,

                name:
                    category.name,

                image:
                    category.image,

                subcategories:
                    Array.isArray(
                        category.subcategories
                    )
                        ? category.subcategories
                        : []
            })
        )
    );


    displayAdminCategories();
    loadProductCategories();
    updateDashboardCounts();

}


window.obyaAdminReady.then(
    function (isAuthorized) {

        if (isAuthorized) {
            loadCategoriesFromSupabase();
        }

    }
);

// ==============================
// CATEGORY FORM OPEN / CLOSE
// ==============================

const addCategoryButton =
    document.getElementById(
        "add-category-button"
    );

const categoryFormWrapper =
    document.getElementById(
        "admin-category-form-wrapper"
    );

const closeCategoryFormButton =
    document.getElementById(
        "close-category-form"
    );

const cancelCategoryButton =
    document.getElementById(
        "cancel-category-button"
    );


function openCategoryForm() {

    if (!categoryFormWrapper) {
        return;
    }

    categoryFormWrapper.classList.add(
        "open"
    );

    categoryFormWrapper.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


function closeCategoryForm() {

    if (!categoryFormWrapper) {
        return;
    }

    categoryFormWrapper.classList.remove(
        "open"
    );

}


if (addCategoryButton) {

    addCategoryButton.addEventListener(
        "click",
        function () {

            adminCategoryForm.reset();

            delete adminCategoryForm.dataset
                .editCategorySlug;

            existingEditCategoryImage =
                null;

            categoryImagePreview.innerHTML =
                "";

            const categoryFormTitle =
                document.getElementById(
                    "admin-category-form-title"
                );

            if (categoryFormTitle) {

                categoryFormTitle.textContent =
                    "Add Category";

            }

            openCategoryForm();

        }
    );

}


if (closeCategoryFormButton) {

    closeCategoryFormButton.addEventListener(
        "click",
        closeCategoryForm
    );

}


if (cancelCategoryButton) {

    cancelCategoryButton.addEventListener(
        "click",
        closeCategoryForm
    );

}

// ==============================
// CATEGORY IMAGE PREVIEW
// ==============================

const categoryImageInput =
    document.getElementById(
        "admin-category-image"
    );

const categoryImagePreview =
    document.getElementById(
        "admin-category-image-preview"
    );


if (
    categoryImageInput &&
    categoryImagePreview
) {

    categoryImageInput.addEventListener(
        "change",
        function () {

            categoryImagePreview.innerHTML =
                "";


            const file =
                categoryImageInput.files[0];


            if (!file) {
                return;
            }


            const imageURL =
                URL.createObjectURL(
                    file
                );


            const preview =
                document.createElement(
                    "div"
                );


            preview.className =
                "admin-image-preview-item";


            preview.innerHTML = `

                <img
                    src="${imageURL}"
                    alt="Category image"
                >

                <button
                    type="button"
                    class="admin-remove-image"
                >
                    ✕
                </button>

            `;


            const removeButton =
                preview.querySelector(
                    ".admin-remove-image"
                );


            removeButton.addEventListener(
                "click",
                function () {

                    categoryImageInput.value =
                        "";

                    categoryImagePreview.innerHTML =
                        "";

                    URL.revokeObjectURL(
                        imageURL
                    );

                }
            );


            categoryImagePreview.appendChild(
                preview
            );

        }
    );

}

// ==============================
// SAVE CATEGORY
// ==============================

const adminCategoryForm =
    document.getElementById(
        "admin-category-form"
    );


if (adminCategoryForm) {

    adminCategoryForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ==============================
            // CATEGORY NAME
            // ==============================

            const categoryName =
                document
                    .getElementById(
                        "admin-category-name"
                    )
                    .value
                    .trim();


            // ==============================
            // SUBCATEGORIES
            // ==============================

            const subcategoriesValue =
                document
                    .getElementById(
                        "admin-category-subcategories"
                    )
                    .value;


            const subcategories =
                subcategoriesValue
                    .split(",")
                    .map(
                        item =>
                            item.trim()
                    )
                    .filter(Boolean);


            // ==============================
            // VALIDATION
            // ==============================

            if (!categoryName) {

                alert(
                    "Please enter a category name."
                );

                return;

            }


            const editingCategorySlug =
                adminCategoryForm.dataset
                    .editCategorySlug || null;


            const duplicateCategory =
                categories.find(
                    category =>
                        category.name
                            .toLowerCase() ===
                        categoryName
                            .toLowerCase() &&
                        category.slug !==
                        editingCategorySlug
                );


            if (duplicateCategory) {

                alert(
                    "This category already exists."
                );

                return;

            }


            if (
                (
                    !categoryImageInput ||
                    !categoryImageInput.files[0]
                ) &&
                !existingEditCategoryImage
            ) {

                alert(
                    "Please upload a category image."
                );

                return;

            }


            try {

                // ==============================
                // CATEGORY IMAGE
                // ==============================

                let categoryImage =
                    existingEditCategoryImage;


                if (
                    categoryImageInput &&
                    categoryImageInput.files[0]
                ) {

                    categoryImage =
                        await fileToDataURL(
                            categoryImageInput.files[0]
                        );

                }


                // ==============================
                // CREATE / UPDATE CATEGORY
                // ==============================

                const categoryBeingEdited =
                    editingCategorySlug
                        ? categories.find(
                            category =>
                                category.slug ===
                                editingCategorySlug
                        )
                        : null;


                // Keep the original slug while editing.
                // The slug acts like the category's stable ID.

                let categorySlug;


                if (categoryBeingEdited) {

                    categorySlug =
                        categoryBeingEdited.slug;

                } else {

                    const generatedSlug =
                        categoryName
                            .toLowerCase()
                            .trim()
                            .replace(
                                /[^a-z0-9]+/g,
                                "-"
                            )
                            .replace(
                                /^-+|-+$/g,
                                ""
                            );


                    categorySlug =
                        generatedSlug ||
                        `category-${crypto.randomUUID()}`;


                    const slugAlreadyExists =
                        categories.some(
                            category =>
                                category.slug ===
                                categorySlug
                        );


                    if (slugAlreadyExists) {

                        const slugBase =
                            generatedSlug ||
                            "category";


                        categorySlug =
                            `${slugBase}-${crypto.randomUUID().slice(0, 8)}`;

                    }

                }


                const categoryData = {

                    name:
                        categoryName,

                    slug:
                        categorySlug,

                    image:
                        categoryImage,

                    subcategories:
                        subcategories,

                    adminCreated:
                        categoryBeingEdited
                            ? (
                                categoryBeingEdited
                                    .adminCreated || false
                            )
                            : true

                };

                // ==============================
                // SAVE CATEGORY TO SUPABASE
                // ==============================

                const {
                    error: categorySaveError
                } =
                    await obyaSupabase
                        .from(
                            "categories"
                        )
                        .upsert(
                            {
                                slug:
                                    categorySlug,

                                name:
                                    categoryName,

                                image:
                                    categoryImage,

                                subcategories:
                                    subcategories,

                                updated_at:
                                    new Date()
                                        .toISOString()
                            },
                            {
                                onConflict:
                                    "slug"
                            }
                        );


                if (categorySaveError) {

                    console.error(
                        "Could not save category to Supabase:",
                        categorySaveError
                    );

                    throw categorySaveError;

                }

                // ==============================
                // DELETE REPLACED CATEGORY IMAGE
                // ==============================

                if (
                    editingCategorySlug &&
                    categoryImageInput &&
                    categoryImageInput.files[0] &&
                    existingEditCategoryImage &&
                    existingEditCategoryImage !== categoryImage
                ) {

                    await deleteSupabaseImage(
                        existingEditCategoryImage
                    );

                }

                // ==============================
                // UPDATE CURRENT CATEGORY LIST
                // ==============================

                if (editingCategorySlug) {

                    const categoryIndex =
                        categories.findIndex(
                            category =>
                                category.slug ===
                                editingCategorySlug
                        );


                    if (categoryIndex !== -1) {

                        const oldCategoryName =
                            categories[
                                categoryIndex
                            ].name;


                        categories[
                            categoryIndex
                        ] =
                            categoryData;


                        // Supabase updates the related
                        // product category through the
                        // database relationship.
                        // Keep the current Admin screen
                        // in sync as well.

                        if (
                            oldCategoryName !==
                            categoryName
                        ) {

                            products.forEach(
                                product => {

                                    if (
                                        product.category ===
                                        oldCategoryName
                                    ) {

                                        product.category =
                                            categoryName;

                                    }

                                }
                            );

                        }

                    }

                } else {

                    categories.push(
                        categoryData
                    );

                }

                // ==============================
                // REFRESH ADMIN
                // ==============================

                displayAdminCategories();

                await loadProductsFromSupabase();

                loadProductCategories();

                updateDashboardCounts();

                // ==============================
                // RESET FORM
                // ==============================

                adminCategoryForm.reset();

                delete adminCategoryForm.dataset
                    .editCategorySlug;

                existingEditCategoryImage =
                    null;

                categoryImagePreview.innerHTML =
                    "";

                const categoryFormTitle =
                    document.getElementById(
                        "admin-category-form-title"
                    );

                if (categoryFormTitle) {

                    categoryFormTitle.textContent =
                        "Add Category";

                }

                closeCategoryForm();


                alert(
                    "Category saved successfully."
                );

            } catch (error) {

                console.error(
                    error
                );

                alert(
                    "The category could not be saved. Try using a smaller image."
                );

            }

        }
    );

}

// ==============================
// EDIT CATEGORY
// ==============================

let existingEditCategoryImage =
    null;


document.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.matches(
                "[data-edit-category-slug]"
            )
        ) {
            return;
        }


        event.preventDefault();
        event.stopPropagation();


        const categorySlug =
            event.target.dataset
                .editCategorySlug;


        const categoryToEdit =
            categories.find(
                category =>
                    category.slug ===
                    categorySlug
            );


        if (!categoryToEdit) {
            return;
        }


        // REMEMBER WHICH CATEGORY
        // IS BEING EDITED

        adminCategoryForm.dataset
            .editCategorySlug =
            categoryToEdit.slug;


        // CATEGORY NAME

        document
            .getElementById(
                "admin-category-name"
            )
            .value =
            categoryToEdit.name;


        // SUBCATEGORIES

        document
            .getElementById(
                "admin-category-subcategories"
            )
            .value =
            (
                categoryToEdit
                    .subcategories ||
                []
            ).join(", ");


        // FORM TITLE

        const categoryFormTitle =
            document.getElementById(
                "admin-category-form-title"
            );


        if (categoryFormTitle) {

            categoryFormTitle.textContent =
                "Edit Category";

        }


        // EXISTING IMAGE

        existingEditCategoryImage =
            categoryToEdit.image || null;


        categoryImageInput.value =
            "";


        categoryImagePreview.innerHTML =
            "";


        if (existingEditCategoryImage) {

            const imageSource =
                (
                    existingEditCategoryImage.startsWith("data:") ||
                    existingEditCategoryImage.startsWith("http://") ||
                    existingEditCategoryImage.startsWith("https://")
                )
                    ? existingEditCategoryImage
                    : `../${existingEditCategoryImage}`;


            categoryImagePreview.innerHTML = `

                <div class="admin-image-preview-item">

                    <img
                        src="${imageSource}"
                        alt="${categoryToEdit.name}"
                    >

                </div>

            `;

        }


        openCategoryForm();

    }
);
// ==============================
// DELETE CATEGORY
// ==============================

document.addEventListener(
    "click",
    async function (event) {

        if (
            !event.target.matches(
                "[data-delete-category-slug]"
            )
        ) {
            return;
        }


        event.preventDefault();
        event.stopPropagation();


        const categorySlug =
            event.target.dataset
                .deleteCategorySlug;


        const categoryToDelete =
            categories.find(
                category =>
                    category.slug ===
                    categorySlug
            );


        if (!categoryToDelete) {
            return;
        }


        // ==============================
        // CHECK PRODUCTS USING CATEGORY
        // ==============================

        const productsUsingCategory =
            products.filter(
                product =>
                    product.category ===
                    categoryToDelete.name
            );


        if (
            productsUsingCategory.length > 0
        ) {

            alert(
                `This category cannot be deleted because ${productsUsingCategory.length} product(s) are using it. Move or delete those products first.`
            );

            return;

        }


        // ==============================
        // CONFIRM DELETE
        // ==============================

        const confirmed =
            confirm(
                `Delete "${categoryToDelete.name}"?`
            );


        if (!confirmed) {
            return;
        }

        // ==============================
        // DELETE FROM SUPABASE
        // ==============================

        const {
            error: categoryDeleteError
        } =
            await obyaSupabase
                .from(
                    "categories"
                )
                .delete()
                .eq(
                    "slug",
                    categorySlug
                );


        if (categoryDeleteError) {

            console.error(
                "Could not delete category from Supabase:",
                categoryDeleteError
            );

            alert(
                "The category could not be deleted."
            );

            return;
        }

        // ==============================
        // DELETE CATEGORY IMAGE
        // ==============================

        await deleteSupabaseImage(
            categoryToDelete.image
        );


        // ==============================
        // REMOVE FROM CURRENT PAGE
        // ==============================

        const categoryIndex =
            categories.findIndex(
                category =>
                    category.slug ===
                    categorySlug
            );


        if (categoryIndex !== -1) {

            categories.splice(
                categoryIndex,
                1
            );

        }


        // ==============================
        // REFRESH ADMIN
        // ==============================

        displayAdminCategories();

        loadProductCategories();

        updateDashboardCounts();


        alert(
            "Category deleted successfully."
        );

    }
);

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
// DISPLAY ADMIN ORDERS
// ==============================

const adminOrdersList =
    document.getElementById(
        "admin-orders-list"
    );

function getSavedOrders() {

    return adminOrders;

}


// ==============================
// LOAD ORDERS FROM SUPABASE
// ==============================

async function loadOrdersFromSupabase() {

    const [
        ordersResult,
        orderItemsResult
    ] =
        await Promise.all([

            obyaSupabase
                .from(
                    "orders"
                )
                .select(
                    "order_number, customer_name, phone, governorate, address, notes, subtotal, delivery_fee, total, status, purchase_date, created_at"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                ),

            obyaSupabase
                .from(
                    "order_items"
                )
                .select(
                    "id, order_number, product_id, product_name, product_image, price, quantity, color, size"
                )
                .order(
                    "id",
                    {
                        ascending: true
                    }
                )

        ]);


    if (ordersResult.error) {

        console.error(
            "Could not load orders from Supabase:",
            ordersResult.error
        );

        return;

    }


    if (orderItemsResult.error) {

        console.error(
            "Could not load order items from Supabase:",
            orderItemsResult.error
        );

        return;

    }


    // ==============================
    // GROUP ITEMS BY ORDER
    // ==============================

    const itemsByOrder =
        new Map();


    (
        orderItemsResult.data || []
    ).forEach(
        item => {

            if (
                !itemsByOrder.has(
                    item.order_number
                )
            ) {

                itemsByOrder.set(
                    item.order_number,
                    []
                );

            }


            itemsByOrder
                .get(
                    item.order_number
                )
                .push({

                    id:
                        item.product_id,

                    name:
                        item.product_name,

                    image:
                        item.product_image || "",

                    price:
                        Number(
                            item.price || 0
                        ),

                    quantity:
                        Number(
                            item.quantity || 1
                        ),

                    color:
                        item.color || "",

                    size:
                        item.size || ""

                });

        }
    );


    // ==============================
    // MAP DATABASE ORDERS
    // ==============================

    adminOrders =
        (
            ordersResult.data || []
        ).map(
            order => ({

                orderNumber:
                    order.order_number,

                customer: {

                    name:
                        order.customer_name,

                    phone:
                        order.phone,

                    area:
                        order.governorate,

                    address:
                        order.address

                },

                items:
                    itemsByOrder.get(
                        order.order_number
                    ) || [],

                subtotal:
                    Number(
                        order.subtotal || 0
                    ),

                deliveryFee:
                    Number(
                        order.delivery_fee || 0
                    ),

                total:
                    Number(
                        order.total || 0
                    ),

                status:
                    order.status || "New",

                purchaseDate:
                    order.purchase_date ||
                    order.created_at,

                createdAt:
                    order.created_at,

                notes:
                    order.notes || ""

            })
        );


    displayAdminOrders();

    updateDashboardCounts();

}


function displayAdminOrders() {

    if (!adminOrdersList) {
        return;
    }


    adminOrdersList.innerHTML =
        "";


    const orders =
        getSavedOrders();


    if (orders.length === 0) {

        adminOrdersList.innerHTML = `

            <div class="admin-empty-state">

                <h3>
                    No orders yet
                </h3>

                <p>
                    Customer orders will appear here.
                </p>

            </div>

        `;

        return;

    }

    orders.forEach(order => {

        const orderNumber =
            order.orderNumber ||
            order.id ||
            "Order";


        const customerName =
            order.customer?.name ||
            order.fullName ||
            order.name ||
            "Customer";


        const customerPhone =
            order.customer?.phone ||
            order.phone ||
            "";


        const deliveryArea =
            order.customer?.area ||
            order.deliveryArea ||
            order.area ||
            "";

        const deliveryAddress =
            order.customer?.address ||
            order.deliveryAddress ||
            order.address ||
            "";

        const safeCustomerName =
            escapeHTML(
                customerName
            );


        const safeCustomerPhone =
            escapeHTML(
                customerPhone
            );


        const safeDeliveryArea =
            escapeHTML(
                deliveryArea
            );


        const safeDeliveryAddress =
            escapeHTML(
                deliveryAddress
            );

        const orderTotal =
            order.total ??
            order.grandTotal ??
            0;


        const orderItems =
            Array.isArray(order.items)
                ? order.items
                : [];


        // ==============================
        // PURCHASE DATE
        // ==============================

        let purchaseDateText =
            "Date not available";


        if (order.purchaseDate) {

            const purchaseDate =
                new Date(
                    order.purchaseDate
                );


            if (
                !Number.isNaN(
                    purchaseDate.getTime()
                )
            ) {

                purchaseDateText =
                    purchaseDate.toLocaleString(
                        "en-GB",
                        {
                            timeZone: "Asia/Amman",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                        }
                    );

            }

        }


        // ==============================
        // PURCHASED ITEMS
        // ==============================

        const itemsHTML =
            orderItems.length > 0
                ? orderItems
                    .map(item => {

                        const product =
                            products.find(
                                product =>
                                    Number(product.id) ===
                                    Number(item.id)
                            );


                        const itemName =
                            item.name ||
                            item.productName ||
                            product?.name ||
                            `Product #${item.id}`;


                        const quantity =
                            Number(
                                item.quantity || 1
                            );


                        const color =
                            item.color || "";


                        const size =
                            item.size || "";

                        const safeItemName =
                            escapeHTML(
                                itemName
                            );


                        const safeColor =
                            escapeHTML(
                                color
                            );


                        const safeSize =
                            escapeHTML(
                                size
                            );


                        const itemPrice =
                            item.price ??
                            product?.price ??
                            null;


                        const itemImage =
                            item.image ||
                            product?.images?.[0] ||
                            "";


                        let imageSource =
                            "";


                        if (itemImage) {

                            if (
                                itemImage.startsWith(
                                    "data:"
                                ) ||
                                itemImage.startsWith(
                                    "http://"
                                ) ||
                                itemImage.startsWith(
                                    "https://"
                                )
                            ) {

                                imageSource =
                                    itemImage;

                            } else {

                                imageSource =
                                    `../${itemImage}`;

                            }

                        }


                        return `

                        <div class="admin-order-item">

                            ${imageSource
                                ? `
                                        <img
                                            class="admin-order-item-image"
                                            src="${imageSource}"
                                            alt="${safeItemName}"
                                        >
                                    `
                                : `
                                        <div
                                            class="admin-order-item-image-placeholder"
                                        >
                                            No image
                                        </div>
                                    `
                            }


                            <div class="admin-order-item-info">

                                <strong>
                                    ${safeItemName}
                                </strong>

                                <span>
                                    Quantity: ${quantity}
                                </span>

                                ${color
                                ? `
                                            <span>
                                                Color: ${safeColor}
                                            </span>
                                        `
                                : ""
                            }

                                ${size
                                ? `
                                            <span>
                                                Size: ${safeSize}
                                            </span>
                                        `
                                : ""
                            }

                            </div>


                            ${itemPrice !== null
                                ? `
                                        <div class="admin-order-item-price">

                                            ${itemPrice * quantity} JOD

                                        </div>
                                    `
                                : ""
                            }

                        </div>

                    `;

                    })
                    .join("")
                : `

                <div class="admin-order-no-items">
                    No purchased-item details available.
                </div>

            `;


        // ==============================
        // ORDER CARD
        // ==============================

        const orderCard =
            document.createElement(
                "article"
            );


        orderCard.className =
            "admin-order-card";

        orderCard.innerHTML = `

    <div class="admin-order-summary-row">


        <!-- ORDER NUMBER -->

        <div class="admin-order-summary-number">

            <span>
                ORDER
            </span>

            <strong>
                ${orderNumber}
            </strong>

        </div>


        <!-- PURCHASE DATE -->

        <div class="admin-order-summary-date">

            <span>
                PURCHASED
            </span>

            <strong>
                ${purchaseDateText}
            </strong>

        </div>


        <!-- TOTAL -->

        <div class="admin-order-summary-total">

            <span>
                TOTAL
            </span>

            <strong>
                ${orderTotal} JOD
            </strong>

        </div>


        <!-- STATUS -->

        <div class="admin-order-summary-status">

            <span>
                STATUS
            </span>

            <select
                class="admin-order-status-select"
                data-order-number="${orderNumber}"
                data-status="${order.status || "New"}"
            >

                <option
                    value="New"
                    ${(!order.status || order.status === "New") ? "selected" : ""}
                >
                    New
                </option>

                <option
                    value="Confirmed"
                    ${order.status === "Confirmed" ? "selected" : ""}
                >
                    Confirmed
                </option>

                <option
                    value="Preparing"
                    ${order.status === "Preparing" ? "selected" : ""}
                >
                    Preparing
                </option>

                <option
                    value="Out for Delivery"
                    ${order.status === "Out for Delivery" ? "selected" : ""}
                >
                    Out for Delivery
                </option>

                <option
                    value="Delivered"
                    ${order.status === "Delivered" ? "selected" : ""}
                >
                    Delivered
                </option>

                <option
                    value="Cancelled"
                    ${order.status === "Cancelled" ? "selected" : ""}
                >
                    Cancelled
                </option>

            </select>

        </div>


        <!-- DETAILS BUTTON -->

        <button
    type="button"
    class="admin-order-details-toggle"
    aria-expanded="false"
>
    View Details
</button>
    </div>


    <!-- ==============================
         EXPANDED ORDER DETAILS
    ============================== -->

    <div
        class="admin-order-expanded-details"
        hidden
    >


        <!-- CUSTOMER + DELIVERY -->

        <div class="admin-order-details-grid">


            <div class="admin-order-detail-section">

                <span class="admin-order-detail-title">
                    Customer
                </span>

                <strong>
                    ${safeCustomerName}
                </strong>

                <span>
                    ${safeCustomerPhone || "No phone number"}
                </span>

            </div>


            <div class="admin-order-detail-section">

                <span class="admin-order-detail-title">
                    Delivery
                </span>

                <strong>
                    ${safeDeliveryArea || "No delivery area"}
                </strong>

                <span>
                    ${safeDeliveryAddress || "No delivery address"}
                </span>

            </div>


        </div>


        <!-- PURCHASED ITEMS -->

        <div class="admin-order-products-section">

            <div class="admin-order-products-heading">

                <span>
                    PURCHASED ITEMS
                </span>

                <strong>
                    ${orderItems.reduce(
            (total, item) =>
                total +
                Number(
                    item.quantity || 1
                ),
            0
        )
            }
                    item(s)
                </strong>

            </div>


            <div class="admin-order-items">

                ${itemsHTML}

            </div>

        </div>


    </div>

`;


        adminOrdersList.appendChild(
            orderCard
        );

    });

}


window.obyaAdminReady.then(
    function (isAuthorized) {

        if (isAuthorized) {
            loadOrdersFromSupabase();
        }

    }
);

// ==============================
// UPDATE ORDER STATUS
// ==============================

document.addEventListener(
    "change",
    async function (event) {

        if (
            !event.target.matches(
                ".admin-order-status-select"
            )
        ) {
            return;
        }


        const statusSelect =
            event.target;


        const orderNumber =
            statusSelect.dataset
                .orderNumber;


        const newStatus =
            statusSelect.value;


        const previousStatus =
            statusSelect.dataset.status ||
            "New";


        statusSelect.disabled =
            true;


        const {
            error
        } =
            await obyaSupabase
                .from(
                    "orders"
                )
                .update({

                    status:
                        newStatus,

                    updated_at:
                        new Date()
                            .toISOString()

                })
                .eq(
                    "order_number",
                    orderNumber
                );


        if (error) {

            console.error(
                "Could not update order status:",
                error
            );


            statusSelect.value =
                previousStatus;


            statusSelect.disabled =
                false;


            alert(
                "The order status could not be updated."
            );


            return;

        }


        statusSelect.dataset.status =
            newStatus;


        const order =
            adminOrders.find(
                order =>
                    String(
                        order.orderNumber
                    ) ===
                    String(
                        orderNumber
                    )
            );


        if (order) {

            order.status =
                newStatus;

        }


        statusSelect.disabled =
            false;

    }
);


// ==============================
// EXPAND / COLLAPSE ORDER DETAILS
// ==============================

document.addEventListener(
    "click",
    function (event) {

        const toggleButton =
            event.target.closest(
                ".admin-order-details-toggle"
            );


        if (!toggleButton) {
            return;
        }


        const orderCard =
            toggleButton.closest(
                ".admin-order-card"
            );


        if (!orderCard) {
            return;
        }


        const details =
            orderCard.querySelector(
                ".admin-order-expanded-details"
            );


        if (!details) {
            return;
        }


        const isOpen =
            !details.hidden;


        details.hidden =
            isOpen;


        toggleButton.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );


        toggleButton.textContent =
            isOpen
                ? "View Details"
                : "Hide Details";

    }
);
