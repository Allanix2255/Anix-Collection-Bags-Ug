// Collection page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const sortSelect = document.querySelector('.sort-select');

    // Filter products by category
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');
            
            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    // Animate in
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-20px)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Sort functionality
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const container = document.querySelector('.collection-grid-full');
        const cards = Array.from(productCards);

        cards.sort((a, b) => {
            switch (sortValue) {
                case 'name':
                    const nameA = a.querySelector('h3').textContent;
                    const nameB = b.querySelector('h3').textContent;
                    return nameA.localeCompare(nameB);
                
                case 'price-low':
                    const priceA = parseInt(a.getAttribute('data-price'));
                    const priceB = parseInt(b.getAttribute('data-price'));
                    return priceA - priceB;
                
                case 'price-high':
                    const priceA2 = parseInt(a.getAttribute('data-price'));
                    const priceB2 = parseInt(b.getAttribute('data-price'));
                    return priceB2 - priceA2;
                
                case 'newest':
                    // For demo purposes, reverse the order
                    return b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent);
                
                default:
                    return 0;
            }
        });

        // Clear container and re-append sorted cards
        container.innerHTML = '';
        cards.forEach(card => {
            container.appendChild(card);
        });

        // Re-animate cards
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    });

    // Quick view functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quick-view-btn')) {
            e.stopPropagation();
            const productCard = e.target.closest('.product-card');
            const productId = getProductIdFromCard(productCard);
            showProductDetails(productId);
        }
        
        if (e.target.classList.contains('add-to-cart-btn')) {
            e.stopPropagation();
            const productCard = e.target.closest('.product-card');
            const productId = getProductIdFromCard(productCard);
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;

            if (window.cartManager) {
                window.cartManager.addToCart({
                    id: productId,
                    name: productName,
                    price: parseInt(productPrice.replace('UGX ', '').replace(/,/g, '')),
                    image: `images/handbag${productId}.jpg`,
                    quantity: 1
                });
            } else {
                addToCartFromCollection(productName);
            }
        }
    });

    // Color selection functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('color-dot')) {
            e.stopPropagation();
            
            // Remove active class from siblings
            const siblings = e.target.parentElement.querySelectorAll('.color-dot');
            siblings.forEach(dot => dot.classList.remove('active-color'));
            
            // Add active class to clicked dot
            e.target.classList.add('active-color');
            
            // Visual feedback
            e.target.style.transform = 'scale(1.3)';
            setTimeout(() => {
                e.target.style.transform = 'scale(1)';
            }, 200);
        }
    });

    // Helper function to get product ID from card
    function getProductIdFromCard(card) {
        const img = card.querySelector('img');
        const src = img.getAttribute('src');
        const match = src.match(/handbag(\d+)\.jpg/);
        return match ? parseInt(match[1]) : 1;
    }

    // Add to cart from collection page
    function addToCartFromCollection(productName) {
        // Create a more elaborate animation
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 2rem;
                border-radius: 10px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                z-index: 3000;
                text-align: center;
                min-width: 300px;
            ">
                <div style="font-size: 3rem; margin-bottom: 1rem;"><i class="fas fa-shopping-bag" style="color: #d4af37;"></i></div>
                <h3 style="margin-bottom: 1rem; color: #2c2c2c;">${productName}</h3>
                <p style="color: #666; margin-bottom: 1.5rem;">Added to your collection!</p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #d4af37;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 500;
                ">Continue Shopping</button>
            </div>
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 2999;
            " onclick="this.parentElement.remove()"></div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature items
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // Add loading animation for the page
    window.addEventListener('load', function() {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    });
});

// Add CSS for active color selection
const style = document.createElement('style');
style.textContent = `
    .color-dot {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .color-dot.active-color {
        box-shadow: 0 0 0 3px #d4af37;
    }
    
    .product-card {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
`;
document.head.appendChild(style);
