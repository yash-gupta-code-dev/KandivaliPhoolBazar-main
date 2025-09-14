// Wait for both DOM and jQuery to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if jQuery is available
    if (typeof jQuery === 'undefined') {
        console.error('jQuery is not loaded. Please check your internet connection or try refreshing the page.');
        return;
    }

    let allProducts = []; // Store all products for filtering

    // Function to get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Function to render products
    function renderProducts(products) {
        const productList = $("#product-list");
        if (!productList.length) {
            console.error('Product list container not found');
            return;
        }

        productList.empty(); // Clear existing cards

        if (products.length === 0) {
            productList.html("<p class='text-gray-500 text-center py-4'>No products found matching your search.</p>");
            return;
        }

        products.forEach(product => {
            const productCard = $(`
    <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition h-full flex flex-col">
        <a href="/products/${product.product_id}/" class="no-underline text-inherit flex flex-col h-full">
            <div class="h-48 overflow-hidden flex-shrink-0">
                <img  src="${product.image || 'https://via.placeholder.com/300x200'}" 
                     alt="${product.name}" 
                     class="w-full h-full object-contain">
            </div>
            <div class="p-4 flex-grow flex flex-col">
                <h3 class="font-semibold text-lg mb-2">${product.name}</h3>
                 <p class="text-gray-600 text-sm truncate" title="${product.description || 'No description available.'}">
                    ${product.description ? product.description.substring(0, 60 ) + (product.description.length > 60 ? '...' : '') : 'No description available.'}
                </p>
                <p class="text-gray-600 text-sm mb-4 truncate">
                <strong>Category: </strong>${product.category}</p>
                <div class="mt-auto">
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

    // Function to filter products based on search term
    function filterProducts(searchTerm) {
        console.log('Filtering products with search term:', searchTerm);
        console.log('Total products:', allProducts.length);

        if (!searchTerm) {
            renderProducts(allProducts);
            return;
        }

        const filteredProducts = allProducts.filter(product => {
            const searchLower = searchTerm.toLowerCase();
            const nameMatch = product.name.toLowerCase().includes(searchLower);
            const descMatch = product.description && product.description.toLowerCase().includes(searchLower);
            const catMatch = product.category.toLowerCase().includes(searchLower);

            console.log('Product:', product.name, 'Matches:', nameMatch || descMatch || catMatch);
            return nameMatch || descMatch || catMatch;
        });

        console.log('Filtered products count:', filteredProducts.length);
        renderProducts(filteredProducts);
    }

    // Initial load of all products
    $.ajax({
        url: "/all/products/",
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log('Products loaded:', data.length);
            console.log(data)
            allProducts = data;

            // Check for search parameter in URL
            const searchTerm = getUrlParameter('search');
            if (searchTerm) {
                // Set the search input value
                $('input[type="text"][placeholder="Search products..."]').val(searchTerm);
                // Filter products
                filterProducts(searchTerm);
            } else {
                renderProducts(data);
            }

            // Add search functionality
            const searchInput = $('input[type="text"][placeholder="Search products..."]');
            console.log('Search input found:', searchInput.length > 0);

            if (searchInput.length) {
                searchInput.on('input', function() {
                    const searchTerm = $(this).val().trim();
                    console.log('Search input changed:', searchTerm);
                    filterProducts(searchTerm);
                });

                // Also add search on form submit
                searchInput.closest('form').on('submit', function(e) {
                    e.preventDefault();
                    const searchTerm = searchInput.val().trim();
                    console.log('Search form submitted:', searchTerm);
                    filterProducts(searchTerm);
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX error:", status, error);
            $("#product-list").html("<p class='text-red-500'>Failed to load products. Please try again later.</p>");
        }
    });
});





