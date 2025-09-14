document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function () {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.toggle('hidden');
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Handle desktop search form
    const homepageSearchForm = document.getElementById('homepage-search-form');
    if (homepageSearchForm) {
        homepageSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = this.querySelector('input[name="search"]').value.trim();
            if (searchTerm) {
                window.location.href = `/products/?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }

    // Handle mobile search form
    const mobileSearchForm = document.getElementById('mobile-search-form');
    if (mobileSearchForm) {
        mobileSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = this.querySelector('input[name="search"]').value.trim();
            if (searchTerm) {
                window.location.href = `/products/?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }
});

