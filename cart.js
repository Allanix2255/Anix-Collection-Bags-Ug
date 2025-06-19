// Shopping Cart functionality for ANIX website
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('anixCart') || '[]');
        this.isCartOpen = false;
        
        this.initializeCart();
        this.updateCartDisplay();
    }

    initializeCart() {
        // Close cart on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isCartOpen) {
                this.toggleCart();
            }
        });

        // Update cart count on page load
        this.updateCartCount();
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        this.isCartOpen = !this.isCartOpen;
        
        if (this.isCartOpen) {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.updateCartDisplay();
        } else {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: product.quantity || 1
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartCount();
        this.showAddToCartNotification(product);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartCount();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartDisplay();
                this.updateCartCount();
            }
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartCount();
    }

    saveCart() {
        localStorage.setItem('anixCart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartSubtotal = document.getElementById('cartSubtotal');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Your cart is empty</p>
                    <p class="empty-cart-subtitle">Add some luxury handbags to get started</p>
                </div>
            `;
            if (cartSubtotal) cartSubtotal.textContent = 'UGX 0';
            if (cartTotal) cartTotal.textContent = 'UGX 0';
            return;
        }

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">UGX ${item.price.toLocaleString()}</p>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="cart-item-total">
                    UGX ${(item.price * item.quantity).toLocaleString()}
                </div>
            </div>
        `).join('');

        if (cartSubtotal) cartSubtotal.textContent = `UGX ${subtotal.toLocaleString()}`;
        if (cartTotal) cartTotal.textContent = `UGX ${subtotal.toLocaleString()}`;
    }

    showAddToCartNotification(product) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="cart-notification-content">
                <i class="fas fa-check-circle"></i>
                <div class="notification-text">
                    <strong>${product.name}</strong>
                    <p>Added to cart • UGX ${product.price.toLocaleString()}</p>
                </div>
                <button class="view-cart-btn" onclick="toggleCart()">View Cart</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Add success sound effect (visual feedback)
        this.animateCartIcon();

        // Remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    animateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.style.transform = 'scale(1.2)';
            cartIcon.style.color = '#d4af37';

            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
                cartIcon.style.color = '';
            }, 300);
        }
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty. Please add some items before checkout.');
            return;
        }

        // Create checkout modal
        const checkoutModal = document.createElement('div');
        checkoutModal.className = 'checkout-modal';
        checkoutModal.innerHTML = `
            <div class="checkout-modal-content">
                <div class="checkout-header">
                    <h2>Secure Checkout</h2>
                    <span class="checkout-close" onclick="this.closest('.checkout-modal').remove()">&times;</span>
                </div>
                <div class="checkout-body">
                    <div class="checkout-summary">
                        <h3>Order Summary</h3>
                        ${this.cart.map(item => `
                            <div class="checkout-item">
                                <span>${item.name} × ${item.quantity}</span>
                                <span>UGX ${(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        `).join('')}
                        <div class="checkout-total">
                            <strong>Total: UGX ${this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</strong>
                        </div>
                    </div>
                    <div class="checkout-payment">
                        <h3>Payment Methods</h3>
                        <p>Choose your preferred payment method:</p>
                        <div class="payment-methods">
                            <div class="payment-method" onclick="selectPaymentMethod('cash')">
                                <div class="payment-icon">
                                    <i class="fas fa-money-bill-wave"></i>
                                </div>
                                <div class="payment-info">
                                    <h4>Cash Payment</h4>
                                    <p>Pay in cash upon delivery or at our store</p>
                                </div>
                                <div class="payment-radio">
                                    <input type="radio" name="payment" value="cash" id="cash">
                                </div>
                            </div>

                            <div class="payment-method" onclick="selectPaymentMethod('bank')">
                                <div class="payment-icon">
                                    <i class="fas fa-university"></i>
                                </div>
                                <div class="payment-info">
                                    <h4>Bank Transfer</h4>
                                    <p>Direct transfer to our bank account</p>
                                </div>
                                <div class="payment-radio">
                                    <input type="radio" name="payment" value="bank" id="bank">
                                </div>
                            </div>

                            <div class="payment-method" onclick="selectPaymentMethod('card')">
                                <div class="payment-icon">
                                    <i class="fas fa-credit-card"></i>
                                </div>
                                <div class="payment-info">
                                    <h4>Debit/Credit Card</h4>
                                    <p>Visa, Mastercard, and local cards accepted</p>
                                </div>
                                <div class="payment-radio">
                                    <input type="radio" name="payment" value="card" id="card">
                                </div>
                            </div>

                            <div class="payment-method" onclick="selectPaymentMethod('paypal')">
                                <div class="payment-icon">
                                    <i class="fab fa-paypal"></i>
                                </div>
                                <div class="payment-info">
                                    <h4>PayPal</h4>
                                    <p>Secure payment via PayPal</p>
                                </div>
                                <div class="payment-radio">
                                    <input type="radio" name="payment" value="paypal" id="paypal">
                                </div>
                            </div>

                            <div class="payment-method" onclick="selectPaymentMethod('wallet')">
                                <div class="payment-icon">
                                    <i class="fas fa-mobile-alt"></i>
                                </div>
                                <div class="payment-info">
                                    <h4>Digital Wallet</h4>
                                    <p>Mobile Money, Apple Pay, Google Pay</p>
                                </div>
                                <div class="payment-radio">
                                    <input type="radio" name="payment" value="wallet" id="wallet">
                                </div>
                            </div>

                            <div class="payment-method" onclick="selectPaymentMethod('gift')">
                                <div class="payment-icon">
                                    <i class="fas fa-gift"></i>
                                </div>
                                <div class="payment-info">
                                    <h4>Gift Card</h4>
                                    <p>Use ANIX gift card or voucher</p>
                                </div>
                                <div class="payment-radio">
                                    <input type="radio" name="payment" value="gift" id="gift">
                                </div>
                            </div>
                        </div>

                        <div class="payment-details" id="paymentDetails" style="display: none;">
                            <div id="paymentInstructions"></div>
                        </div>

                        <button class="proceed-payment-btn" onclick="proceedWithPayment()" disabled>
                            <i class="fas fa-lock"></i> Proceed with Payment
                        </button>
                    </div>

                    <div class="checkout-contact">
                        <h3>Need Help?</h3>
                        <p>Contact us for assistance with your order:</p>
                        <div class="contact-options">
                            <a href="https://wa.me/256752811231?text=Hello%20ANIX,%20I%20need%20help%20with%20my%20order" target="_blank" class="contact-option whatsapp">
                                <i class="fab fa-whatsapp"></i>
                                <span>WhatsApp: +256 752 811 231</span>
                            </a>
                            <a href="tel:+256752811231" class="contact-option phone">
                                <i class="fas fa-phone"></i>
                                <span>Call: +256 752 811 231</span>
                            </a>
                            <a href="mailto:anixcollection88@gmail.com?subject=Order%20Assistance&body=Hello%20ANIX,%20I%20need%20assistance%20with%20my%20order." class="contact-option email">
                                <i class="fas fa-envelope"></i>
                                <span>Email: anixcollection88@gmail.com</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="checkout-overlay" onclick="this.parentElement.remove()"></div>
        `;

        document.body.appendChild(checkoutModal);
        setTimeout(() => checkoutModal.classList.add('show'), 100);
    }

    // Get cart data for external use
    getCartData() {
        return {
            items: this.cart,
            totalItems: this.cart.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
    }
}

// Global functions for cart operations
function toggleCart() {
    if (window.cartManager) {
        window.cartManager.toggleCart();
    }
}

function addToCart(product) {
    if (window.cartManager) {
        window.cartManager.addToCart(product);
    }
}

function removeFromCart(productId) {
    if (window.cartManager) {
        window.cartManager.removeFromCart(productId);
    }
}

function updateCartQuantity(productId, newQuantity) {
    if (window.cartManager) {
        window.cartManager.updateQuantity(productId, newQuantity);
    }
}

function clearCart() {
    if (window.cartManager && confirm('Are you sure you want to clear your cart?')) {
        window.cartManager.clearCart();
    }
}

function proceedToCheckout() {
    if (window.cartManager) {
        window.cartManager.proceedToCheckout();
    }
}

// Payment method selection
let selectedPaymentMethod = null;

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;

    // Update radio buttons
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.checked = radio.value === method;
    });

    // Update visual selection
    document.querySelectorAll('.payment-method').forEach(pm => {
        pm.classList.remove('selected');
    });
    document.querySelector(`#${method}`).closest('.payment-method').classList.add('selected');

    // Show payment details
    showPaymentDetails(method);

    // Enable proceed button
    const proceedBtn = document.querySelector('.proceed-payment-btn');
    if (proceedBtn) {
        proceedBtn.disabled = false;
    }
}

function showPaymentDetails(method) {
    const detailsContainer = document.getElementById('paymentDetails');
    const instructionsContainer = document.getElementById('paymentInstructions');

    if (!detailsContainer || !instructionsContainer) return;

    let instructions = '';

    switch (method) {
        case 'cash':
            instructions = `
                <div class="payment-instruction">
                    <h4><i class="fas fa-money-bill-wave"></i> Cash Payment Instructions</h4>
                    <ul>
                        <li>Pay in cash when your order is delivered</li>
                        <li>Exact amount preferred (change will be provided if needed)</li>
                        <li>Available for delivery within Kampala and surrounding areas</li>
                        <li>Store pickup also available at Muyenga Hill 22</li>
                    </ul>
                    <p class="payment-note">Cash on delivery available for orders within Kampala metropolitan area.</p>
                </div>
            `;
            break;

        case 'bank':
            instructions = `
                <div class="payment-instruction">
                    <h4><i class="fas fa-university"></i> Bank Transfer Details</h4>
                    <div class="bank-details">
                        <p><strong>Bank:</strong> Stanbic Bank Uganda</p>
                        <p><strong>Account Name:</strong> ANIX Collection Ltd</p>
                        <p><strong>Account Number:</strong> 9030012345678</p>
                        <p><strong>Swift Code:</strong> SBICUGKX</p>
                        <p><strong>Branch:</strong> Kampala Main Branch</p>
                    </div>
                    <p class="payment-note">Please include your order number in the transfer reference and send proof of payment to our WhatsApp.</p>
                </div>
            `;
            break;

        case 'card':
            instructions = `
                <div class="payment-instruction">
                    <h4><i class="fas fa-credit-card"></i> Card Payment</h4>
                    <div class="card-options">
                        <div class="card-logos">
                            <i class="fab fa-cc-visa"></i>
                            <i class="fab fa-cc-mastercard"></i>
                            <i class="fas fa-credit-card"></i>
                        </div>
                        <ul>
                            <li>Visa and Mastercard accepted</li>
                            <li>Local Ugandan bank cards supported</li>
                            <li>Secure 3D authentication</li>
                            <li>SSL encrypted transactions</li>
                        </ul>
                    </div>
                    <p class="payment-note">You will be redirected to our secure payment gateway to complete your transaction.</p>
                </div>
            `;
            break;

        case 'paypal':
            instructions = `
                <div class="payment-instruction">
                    <h4><i class="fab fa-paypal"></i> PayPal Payment</h4>
                    <ul>
                        <li>Pay securely with your PayPal account</li>
                        <li>Buyer protection included</li>
                        <li>No need to share card details</li>
                        <li>Instant payment confirmation</li>
                    </ul>
                    <p class="payment-note">You will be redirected to PayPal to complete your payment securely.</p>
                </div>
            `;
            break;

        case 'wallet':
            instructions = `
                <div class="payment-instruction">
                    <h4><i class="fas fa-mobile-alt"></i> Digital Wallet Options</h4>
                    <div class="wallet-options">
                        <div class="wallet-item">
                            <strong>Mobile Money:</strong>
                            <p>MTN Mobile Money: 0752811231</p>
                            <p>Airtel Money: 0776811231</p>
                        </div>
                        <div class="wallet-item">
                            <strong>International:</strong>
                            <p>Apple Pay, Google Pay, Samsung Pay</p>
                        </div>
                    </div>
                    <p class="payment-note">For mobile money, send payment and share transaction ID via WhatsApp.</p>
                </div>
            `;
            break;

        case 'gift':
            instructions = `
                <div class="payment-instruction">
                    <h4><i class="fas fa-gift"></i> Gift Card Payment</h4>
                    <div class="gift-card-form">
                        <label for="giftCardNumber">Gift Card Number:</label>
                        <input type="text" id="giftCardNumber" placeholder="Enter 16-digit gift card number" maxlength="19">
                        <label for="giftCardPin">Security PIN:</label>
                        <input type="password" id="giftCardPin" placeholder="Enter 4-digit PIN" maxlength="4">
                        <button type="button" onclick="validateGiftCard()">Validate Gift Card</button>
                    </div>
                    <p class="payment-note">Gift cards can be purchased at our store or online. Contact us for gift card purchases.</p>
                </div>
            `;
            break;
    }

    instructionsContainer.innerHTML = instructions;
    detailsContainer.style.display = 'block';
}

function validateGiftCard() {
    const cardNumber = document.getElementById('giftCardNumber').value;
    const pin = document.getElementById('giftCardPin').value;

    if (cardNumber.length !== 19 || pin.length !== 4) {
        alert('Please enter a valid 16-digit gift card number and 4-digit PIN.');
        return;
    }

    // Simulate gift card validation
    alert('Gift card validated successfully! You can proceed with your order.');
}

function proceedWithPayment() {
    if (!selectedPaymentMethod) {
        alert('Please select a payment method to continue.');
        return;
    }

    const cartData = window.cartManager ? window.cartManager.getCartData() : null;
    if (!cartData || cartData.totalItems === 0) {
        alert('Your cart is empty. Please add items before checkout.');
        return;
    }

    // Create order summary for WhatsApp
    const orderSummary = cartData.items.map(item =>
        `${item.name} x${item.quantity} - UGX ${(item.price * item.quantity).toLocaleString()}`
    ).join('%0A');

    const total = `Total: UGX ${cartData.totalPrice.toLocaleString()}`;
    const paymentMethod = `Payment Method: ${getPaymentMethodName(selectedPaymentMethod)}`;

    let whatsappMessage = `Hello ANIX, I would like to complete my order:%0A%0A${orderSummary}%0A%0A${total}%0A${paymentMethod}%0A%0APlease assist me with the next steps.`;

    // Handle different payment methods
    switch (selectedPaymentMethod) {
        case 'cash':
            whatsappMessage += '%0A%0AI prefer cash on delivery.';
            break;
        case 'bank':
            whatsappMessage += '%0A%0APlease confirm bank transfer details.';
            break;
        case 'card':
            whatsappMessage += '%0A%0APlease send me the secure payment link.';
            break;
        case 'paypal':
            whatsappMessage += '%0A%0APlease send me the PayPal payment request.';
            break;
        case 'wallet':
            whatsappMessage += '%0A%0AI will pay via mobile money/digital wallet.';
            break;
        case 'gift':
            const giftCardNumber = document.getElementById('giftCardNumber')?.value || '';
            whatsappMessage += `%0A%0AGift Card Number: ${giftCardNumber}`;
            break;
    }

    // Open WhatsApp with order details
    window.open(`https://wa.me/256752811231?text=${whatsappMessage}`, '_blank');

    // Show success message
    setTimeout(() => {
        alert('Order details sent via WhatsApp! Our team will contact you shortly to complete your purchase.');
        // Close checkout modal
        document.querySelector('.checkout-modal')?.remove();
    }, 1000);
}

function getPaymentMethodName(method) {
    const names = {
        'cash': 'Cash on Delivery',
        'bank': 'Bank Transfer',
        'card': 'Debit/Credit Card',
        'paypal': 'PayPal',
        'wallet': 'Digital Wallet',
        'gift': 'Gift Card'
    };
    return names[method] || method;
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cartManager = new CartManager();
});
