// Search functionality for ANIX website
class SearchManager {
    constructor() {
        this.searchData = [
            {
                id: 1,
                name: "ANIX Elegance",
                price: 10450000,
                description: "Classic leather handbag with gold hardware",
                category: "classic",
                keywords: ["leather", "gold", "classic", "elegant", "red", "hardware"],
                image: "images/handbag1.jpg",
                page: "collection.html"
            },
            {
                id: 2,
                name: "ANIX Sophistique",
                price: 11750000,
                description: "Premium crocodile leather with silver accents",
                category: "luxury",
                keywords: ["crocodile", "premium", "silver", "luxury", "black", "sophisticated"],
                image: "images/handbag2.jpg",
                page: "collection.html"
            },
            {
                id: 3,
                name: "ANIX Luxuria",
                price: 15050000,
                description: "Limited edition with diamond clasp",
                category: "limited",
                keywords: ["limited", "diamond", "exclusive", "luxury", "red", "black", "clasp"],
                image: "images/handbag3.jpg",
                page: "collection.html"
            },
            {
                id: 4,
                name: "ANIX Moderne",
                price: 9720000,
                description: "Contemporary design with minimalist appeal",
                category: "modern",
                keywords: ["contemporary", "modern", "minimalist", "brown", "simple", "clean"],
                image: "images/handbag4.jpg",
                page: "collection.html"
            },
            {
                id: 5,
                name: "ANIX Royale",
                price: 20200000,
                description: "Exclusive python leather with 24k gold details",
                category: "luxury",
                keywords: ["python", "exclusive", "24k", "gold", "luxury", "premium", "exotic"],
                image: "images/handbag5.jpg",
                page: "collection.html"
            },
            {
                id: 6,
                name: "ANIX Classique",
                price: 10830000,
                description: "Timeless design in premium Italian leather",
                category: "classic",
                keywords: ["timeless", "italian", "leather", "classic", "white", "premium"],
                image: "images/handbag6.jpg",
                page: "collection.html"
            }
        ];
        
        this.isSearchOpen = false;
        this.currentFilter = 'all';
        this.searchHistory = JSON.parse(localStorage.getItem('anixSearchHistory') || '[]');
        
        this.initializeSearch();
    }

    initializeSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchFilters = document.querySelectorAll('.search-filter-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });
        }

        searchFilters.forEach(btn => {
            btn.addEventListener('click', (e) => {
                searchFilters.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.handleSearch(searchInput ? searchInput.value : '');
            });
        });

        // Close search on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isSearchOpen) {
                this.toggleSearch();
            }
        });
    }

    toggleSearch() {
        const searchOverlay = document.getElementById('searchOverlay');
        const searchInput = document.getElementById('searchInput');
        
        this.isSearchOpen = !this.isSearchOpen;
        
        if (this.isSearchOpen) {
            searchOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                searchOverlay.classList.add('active');
                if (searchInput) searchInput.focus();
            }, 10);
            this.showSearchSuggestions();
        } else {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                searchOverlay.style.display = 'none';
                if (searchInput) searchInput.value = '';
            }, 300);
        }
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.showSearchSuggestions();
            return;
        }

        const results = this.searchProducts(query);
        this.displaySearchResults(results, query);
    }

    searchProducts(query) {
        const searchTerm = query.toLowerCase().trim();
        
        return this.searchData.filter(product => {
            // Filter by category first
            if (this.currentFilter !== 'all' && product.category !== this.currentFilter) {
                return false;
            }

            // Search in name, description, and keywords
            const searchableText = [
                product.name,
                product.description,
                ...product.keywords
            ].join(' ').toLowerCase();

            return searchableText.includes(searchTerm);
        }).sort((a, b) => {
            // Sort by relevance (name matches first, then description, then keywords)
            const aNameMatch = a.name.toLowerCase().includes(searchTerm);
            const bNameMatch = b.name.toLowerCase().includes(searchTerm);
            
            if (aNameMatch && !bNameMatch) return -1;
            if (!aNameMatch && bNameMatch) return 1;
            
            return a.name.localeCompare(b.name);
        });
    }

    displaySearchResults(results, query) {
        const searchResults = document.getElementById('searchResults');
        
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No results found for "${query}"</h3>
                    <p>Try adjusting your search terms or browse our collection</p>
                    <button class="browse-collection-btn" onclick="window.location.href='collection.html'">
                        Browse Collection
                    </button>
                </div>
            `;
            return;
        }

        const resultsHTML = `
            <div class="search-results-header">
                <h3>${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"</h3>
            </div>
            <div class="search-results-grid">
                ${results.map(product => `
                    <div class="search-result-item" onclick="viewProduct(${product.id})">
                        <div class="search-result-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="search-result-info">
                            <h4>${product.name}</h4>
                            <p class="search-result-price">UGX ${product.price.toLocaleString()}</p>
                            <p class="search-result-description">${product.description}</p>
                            <button class="add-to-cart-search" onclick="event.stopPropagation(); addToCartFromSearch(${product.id})">
                                <i class="fas fa-shopping-bag"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        searchResults.innerHTML = resultsHTML;
    }

    showSearchSuggestions() {
        const searchResults = document.getElementById('searchResults');
        
        const recentSearches = this.searchHistory.slice(0, 5);
        const popularProducts = this.searchData.slice(0, 3);
        
        searchResults.innerHTML = `
            <div class="search-suggestions">
                <h3>Popular Searches</h3>
                <div class="suggestion-tags">
                    <span class="suggestion-tag" onclick="performSearch('leather handbag')">Leather Handbags</span>
                    <span class="suggestion-tag" onclick="performSearch('gold hardware')">Gold Hardware</span>
                    <span class="suggestion-tag" onclick="performSearch('limited edition')">Limited Edition</span>
                    <span class="suggestion-tag" onclick="performSearch('classic')">Classic Styles</span>
                    <span class="suggestion-tag" onclick="performSearch('luxury')">Luxury Collection</span>
                </div>
                
                ${recentSearches.length > 0 ? `
                    <h3>Recent Searches</h3>
                    <div class="recent-searches">
                        ${recentSearches.map(search => `
                            <span class="recent-search" onclick="performSearch('${search}')">
                                <i class="fas fa-history"></i> ${search}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
                
                <h3>Featured Products</h3>
                <div class="featured-products">
                    ${popularProducts.map(product => `
                        <div class="featured-product" onclick="viewProduct(${product.id})">
                            <img src="${product.image}" alt="${product.name}">
                            <div class="featured-product-info">
                                <h4>${product.name}</h4>
                                <p>UGX ${product.price.toLocaleString()}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    performSearch(query) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = query;
        }
        
        // Add to search history
        if (query && !this.searchHistory.includes(query)) {
            this.searchHistory.unshift(query);
            this.searchHistory = this.searchHistory.slice(0, 10); // Keep only last 10 searches
            localStorage.setItem('anixSearchHistory', JSON.stringify(this.searchHistory));
        }
        
        this.handleSearch(query);
    }
}

// Global functions
function toggleSearch() {
    if (window.searchManager) {
        window.searchManager.toggleSearch();
    }
}

function performSearch(query) {
    if (window.searchManager) {
        window.searchManager.performSearch(query);
    }
}

function viewProduct(productId) {
    // Close search and show product details
    if (window.searchManager) {
        window.searchManager.toggleSearch();
    }
    
    // Navigate to collection page if not already there
    if (!window.location.pathname.includes('collection.html')) {
        window.location.href = `collection.html#product-${productId}`;
    } else {
        // Show product modal if on collection page
        if (typeof showProductDetails === 'function') {
            showProductDetails(productId);
        }
    }
}

function addToCartFromSearch(productId) {
    if (window.cartManager) {
        const searchManager = window.searchManager;
        const product = searchManager.searchData.find(p => p.id === productId);
        if (product) {
            window.cartManager.addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.searchManager = new SearchManager();
});
