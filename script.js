// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
    });

    // Add animation to product cards on scroll
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

    // Observe all product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Function to scroll to collection section
function scrollToCollection() {
    const collectionSection = document.querySelector('#collection');
    collectionSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Product details data
const productDetails = {
    1: {
        name: "ANIX Elegance",
        price: "UGX 10,450,000",
        description: "Classic leather handbag with gold hardware",
        details: "Crafted from premium Italian leather with hand-stitched details. Features adjustable shoulder strap, multiple interior compartments, and signature ANIX gold-plated hardware. Dimensions: 12\" x 8\" x 4\"",
        materials: "100% Italian Leather, Gold-plated hardware",
        care: "Clean with soft, dry cloth. Store in dust bag when not in use."
    },
    2: {
        name: "ANIX Sophistique",
        price: "UGX 11,750,000",
        description: "Premium crocodile leather with silver accents",
        details: "Luxurious crocodile leather handbag with sterling silver hardware. Features magnetic closure, silk-lined interior, and detachable chain strap. Limited production ensures exclusivity.",
        materials: "Genuine Crocodile Leather, Sterling Silver hardware",
        care: "Professional cleaning recommended. Avoid exposure to moisture."
    },
    3: {
        name: "ANIX Luxuria",
        price: "UGX 15,050,000",
        description: "Limited edition with diamond clasp",
        details: "The pinnacle of luxury featuring genuine diamond-encrusted clasp. Hand-crafted by master artisans with the finest materials. Only 50 pieces produced worldwide.",
        materials: "Premium Leather, 18k Gold, Genuine Diamonds",
        care: "Handle with care. Professional maintenance recommended."
    },
    4: {
        name: "ANIX Moderne",
        price: "UGX 9,720,000",
        description: "Contemporary design with minimalist appeal",
        details: "Clean lines and modern aesthetics define this contemporary piece. Features innovative magnetic closure system and modular interior organization.",
        materials: "Sustainable Leather, Brushed Steel hardware",
        care: "Wipe clean with damp cloth. Eco-friendly materials."
    },
    5: {
        name: "ANIX Royale",
        price: "UGX 20,200,000",
        description: "Exclusive python leather with 24k gold details",
        details: "The ultimate luxury statement piece featuring exotic python leather and 24k gold accents. Each bag is unique due to the natural patterns of the python skin.",
        materials: "Ethically-sourced Python Leather, 24k Gold",
        care: "Specialist care required. Certificate of authenticity included."
    },
    6: {
        name: "ANIX Classique",
        price: "UGX 10,830,000",
        description: "Timeless design in premium Italian leather",
        details: "A timeless design that transcends fashion trends. Features classic proportions, hand-painted edges, and traditional craftsmanship techniques passed down through generations.",
        materials: "Premium Italian Leather, Antique Brass hardware",
        care: "Ages beautifully with use. Regular conditioning recommended."
    }
};

// Function to show product details in modal
function showProductDetails(productId) {
    const product = productDetails[productId];
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <h2 style="font-family: 'Playfair Display', serif; color: #2c2c2c; margin-bottom: 1rem;">${product.name}</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
            <div>
                <img src="images/handbag${productId}.jpg" alt="${product.name}" style="width: 100%; max-width: 300px; height: 200px; object-fit: cover; border-radius: 10px; margin: 0 auto 1rem; display: block;">
                <p style="font-size: 1.5rem; font-weight: 600; color: #d4af37; text-align: center;">${product.price}</p>
            </div>
            <div>
                <h3 style="color: #2c2c2c; margin-bottom: 0.5rem;">Description</h3>
                <p style="color: #666; margin-bottom: 1rem; line-height: 1.6;">${product.details}</p>
                
                <h3 style="color: #2c2c2c; margin-bottom: 0.5rem;">Materials</h3>
                <p style="color: #666; margin-bottom: 1rem;">${product.materials}</p>
                
                <h3 style="color: #2c2c2c; margin-bottom: 0.5rem;">Care Instructions</h3>
                <p style="color: #666; margin-bottom: 1.5rem;">${product.care}</p>
                
                <button style="background: #2c2c2c; color: white; border: none; padding: 1rem 2rem; font-size: 1rem; cursor: pointer; width: 100%; transition: background 0.3s ease;" 
                        onmouseover="this.style.background='#d4af37'" 
                        onmouseout="this.style.background='#2c2c2c'"
                        onclick="addToCart(${productId})">
                    Add to Collection
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Add click outside to close
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    };
}

// Function to close modal
function closeModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
}

// Function to add to cart
function addToCart(productId) {
    const product = productDetails[productId];

    if (window.cartManager) {
        window.cartManager.addToCart({
            id: productId,
            name: product.name,
            price: parseInt(product.price.replace('UGX ', '').replace(/,/g, '')),
            image: `images/handbag${productId}.jpg`,
            quantity: 1
        });
    } else {
        alert(`${product.name} has been added to your collection!\n\nThank you for choosing ANIX luxury handbags.`);
    }

    closeModal();
}

// Function to add to cart from home page
function addToCartFromHome(productId) {
    const product = productDetails[productId];

    if (window.cartManager) {
        window.cartManager.addToCart({
            id: productId,
            name: product.name,
            price: parseInt(product.price.replace('UGX ', '').replace(/,/g, '')),
            image: `images/handbag${productId}.jpg`,
            quantity: 1
        });
    } else {
        // Fallback notification if cart manager isn't loaded
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
                <div style="font-size: 3rem; margin-bottom: 1rem; color: #d4af37;"><i class="fas fa-shopping-bag"></i></div>
                <h3 style="margin-bottom: 1rem; color: #2c2c2c;">${product.name}</h3>
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

        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 4000);
    }
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to navigation icons
    const navIcons = document.querySelectorAll('.nav-icons span');
    navIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Search and cart icons are now handled by their respective managers
    // The onclick handlers are set directly in the HTML

    // Mobile menu functionality
    window.toggleMobileMenu = function() {
        const mobileMenu = document.getElementById('mobileNavMenu');
        const menuToggle = document.querySelector('.mobile-menu-toggle');

        if (mobileMenu && menuToggle) {
            mobileMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        }
    };

    // Close mobile menu when clicking on a link
    document.addEventListener('click', function(e) {
        if (e.target.matches('.mobile-nav-menu a')) {
            const mobileMenu = document.getElementById('mobileNavMenu');
            const menuToggle = document.querySelector('.mobile-menu-toggle');

            if (mobileMenu && menuToggle) {
                mobileMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileMenu = document.getElementById('mobileNavMenu');
        const menuToggle = document.querySelector('.mobile-menu-toggle');

        if (mobileMenu && menuToggle &&
            !mobileMenu.contains(e.target) &&
            !menuToggle.contains(e.target) &&
            mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });

    // Test cart functionality on page load
    setTimeout(() => {
        if (window.cartManager) {
            console.log('✅ Cart Manager loaded successfully');
            console.log('🛒 Cart is ready to accept products');
        } else {
            console.log('⚠️ Cart Manager not found, using fallback notifications');
        }
    }, 1000);

    // Global test function for cart functionality
    window.testCartFunctionality = function() {
        console.log('🧪 Testing cart functionality...');

        // Test adding a product to cart
        const testProduct = {
            id: 999,
            name: "Test Product",
            price: 1000000,
            image: "images/handbag1.jpg",
            quantity: 1
        };

        if (window.cartManager) {
            window.cartManager.addToCart(testProduct);
            console.log('✅ Test product added to cart successfully');
        } else {
            console.log('❌ Cart manager not available');
            alert('Cart functionality test: Cart manager not loaded');
        }
    };

    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-bag-container');
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
});

// Add keyboard navigation for modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Enhanced loading animation for mobile
window.addEventListener('load', function() {
    // Check if mobile device
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // Mobile-specific loading animation
        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(20px)';
        document.body.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

        // Animate elements in sequence
        setTimeout(() => {
            document.body.style.opacity = '1';
            document.body.style.transform = 'translateY(0)';
        }, 200);

        // Animate product cards with stagger effect
        setTimeout(() => {
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 500);

        // Add mobile-specific touch interactions
        addMobileTouchInteractions();
    } else {
        // Desktop loading animation
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';

        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }
});

// Mobile touch interactions
function addMobileTouchInteractions() {
    // Add touch feedback to interactive elements
    const interactiveElements = document.querySelectorAll('.product-card, .filter-btn, .cta-button, .nav-icons span');

    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
            this.style.transition = 'transform 0.1s ease';
        });

        element.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
            this.style.transition = 'transform 0.2s ease';
        });

        element.addEventListener('touchcancel', function() {
            this.style.transform = 'scale(1)';
            this.style.transition = 'transform 0.2s ease';
        });
    });

    // Add swipe gesture for mobile menu
    let startY = 0;
    let currentY = 0;
    const mobileMenu = document.getElementById('mobileNavMenu');

    if (mobileMenu) {
        mobileMenu.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
        });

        mobileMenu.addEventListener('touchmove', function(e) {
            currentY = e.touches[0].clientY;
            const diff = startY - currentY;

            if (diff > 50) { // Swipe up to close
                toggleMobileMenu();
            }
        });
    }

    // Add pull-to-refresh hint
    let pullStartY = 0;
    let isPulling = false;

    document.addEventListener('touchstart', function(e) {
        if (window.scrollY === 0) {
            pullStartY = e.touches[0].clientY;
            isPulling = true;
        }
    });

    document.addEventListener('touchmove', function(e) {
        if (isPulling && window.scrollY === 0) {
            const currentY = e.touches[0].clientY;
            const pullDistance = currentY - pullStartY;

            if (pullDistance > 100) {
                // Show subtle refresh hint
                document.body.style.transform = `translateY(${Math.min(pullDistance * 0.3, 30)}px)`;
                document.body.style.transition = 'transform 0.1s ease';
            }
        }
    });

    document.addEventListener('touchend', function() {
        if (isPulling) {
            document.body.style.transform = 'translateY(0)';
            document.body.style.transition = 'transform 0.3s ease';
            isPulling = false;
        }
    });
}
