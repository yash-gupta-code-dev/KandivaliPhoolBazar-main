// Wait for both DOM and jQuery to be ready
document.addEventListener('DOMContentLoaded', function () {
    // Check if jQuery is available
    if (typeof jQuery === 'undefined') {
        console.error('jQuery is not loaded. Please check your internet connection or try refreshing the page.');
        return;
    }

    let allProducts = []; // Store all products for filtering and paging
    let currentIndex = 0;
    const itemsPerPage = 10;

    // Get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Render products (append if needed)
    function renderProducts(products, append = false) {
        const productList = $("#product-list");
        if (!productList.length) {
            console.error('Product list container not found');
            return;
        }

        if (!append) productList.empty();

        if (products.length === 0 && !append) {
            productList.html("<p class='text-gray-500 text-center py-4'>No products found matching your search.</p>");
            return;
        }

        products.forEach(product => {
            const productCard = $(`
                <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition h-full flex flex-col">
                    <a href="/products/${product.product_id}/" class="no-underline text-inherit flex flex-col h-full">
                        <div class="h-48 overflow-hidden flex-shrink-0">
                            <img src="${product.image || 'https://via.placeholder.com/300x200'}" alt="${product.name}" class="w-full h-full object-contain">
                        </div>
                        <div class="p-4 flex-grow flex flex-col">
                            <h3 class="font-semibold text-lg mb-2">${product.name}</h3>
                            <p class="text-gray-600 text-sm truncate" title="${product.description || 'No description available.'}">
                                ${product.description ? product.description.substring(0, 60) + (product.description.length > 60 ? '...' : '') : 'No description available.'}
                            </p>
                            <p class="text-gray-600 text-sm mb-2 truncate">
                                <strong>Category: </strong>${product.category}</p>
                            <div class="mt-auto relative right-0">
                                <button onclick="openWhatsApp()" class="bg-gray-900 text-white px-3 py-2 rounded text-sm hover:bg-gray-800 transition flex items-center justify-center gap-2">
                                    <i class="ri-whatsapp-line ri-lg"></i>
                                    Get a Quote
                                </button>
                            </div>
                        </div>
                    </a>
                </div>
            `);

            productList.append(productCard);
        });
    }

    // Show next batch of products
    function showMoreProducts() {
        const nextBatch = allProducts.slice(currentIndex, currentIndex + itemsPerPage);
        renderProducts(nextBatch, true);
        currentIndex += itemsPerPage;

        if (currentIndex >= allProducts.length) {
            $('#show-more-btn').hide();
        }
    }

    // Filter products by keyword
    function filterProducts(searchTerm) {
        if (!searchTerm) {
            currentIndex = 0;
            $('#show-more-btn').show();
            showMoreProducts();
            return;
        }

        const filtered = allProducts.filter(product => {
            const s = searchTerm.toLowerCase();
            return product.name.toLowerCase().includes(s) ||
                (product.description && product.description.toLowerCase().includes(s)) ||
                product.category.toLowerCase().includes(s);
        });

        renderProducts(filtered, false);
        $('#show-more-btn').hide(); // hide button when searching
    }

    // Load products initially
    $.ajax({
        url: "/all/products/",
        type: "GET",
        dataType: "json",
        success: function (data) {
            allProducts = data;
            const searchTerm = getUrlParameter('search');

            if (searchTerm) {
                $('input[type="text"][placeholder="Search products..."]').val(searchTerm);
                filterProducts(searchTerm);
            } else {
                currentIndex = 0;
                $('#show-more-btn').show();
                showMoreProducts();
            }

            // Search input binding
            const searchInput = $('input[type="text"][placeholder="Search products..."]');

            if (searchInput.length) {
                searchInput.on('input', function () {
                    const searchTerm = $(this).val().trim();
                    filterProducts(searchTerm);
                });

                searchInput.closest('form').on('submit', function (e) {
                    e.preventDefault();
                    const searchTerm = searchInput.val().trim();
                    filterProducts(searchTerm);
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX error:", status, error);
            $("#product-list").html("<p class='text-red-500'>Failed to load products. Please try again later.</p>");
        }
    });

    // Bind show more button click
    $('#show-more-btn').on('click', function () {
        showMoreProducts();
    });
});
