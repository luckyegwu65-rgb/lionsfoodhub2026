
//  Cart State 
let cart = JSON.parse(localStorage.getItem('foodmanCart')) || [];

//  DOM Elements 
const cartIcon = document.getElementById('cart-icon');
const cartOverlay = document.getElementById('cart-overlay');
const cartPanel = document.getElementById('cart-panel');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total-amount');
const checkoutBtn = document.getElementById('checkout-btn');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

//  Initialize 
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Cart icon click
    cartIcon.addEventListener('click', openCart);
    
    // Close cart
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    
    // Add to cart buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.special__card');
            const itemId = parseInt(card.dataset.id);
            const itemName = card.dataset.name;
            const itemPrice = parseFloat(card.dataset.price);
            const itemImage = card.dataset.image;
            
            addToCart(itemId, itemName, itemPrice, itemImage);
        });
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', handleCheckout);
    
    // Escape key to close cart
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
        }
    });
}

// Cart Functions 

// Add item to cart
function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification(`${name} added to cart!`, 'success');
    
    // Open cart to show item
    openCart();
}

// Remove item from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
    showNotification('Item removed from cart', 'success');
}

// Update item quantity
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('foodmanCart', JSON.stringify(cart));
}

// ===== UI Functions =====

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Update cart total
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `\u20a6${totalAmount.toLocaleString()}`;
    
    // Render cart items
    renderCartItems();
    
    // Update checkout button state
    checkoutBtn.disabled = cart.length === 0;
    checkoutBtn.style.opacity = cart.length === 0 ? '0.5' : '1';
    checkoutBtn.style.cursor = cart.length === 0 ? 'not-allowed' : 'pointer';
}

// Render cart items
function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="ri-shopping-cart-line"></i>
                <p>Your cart is empty</p>
                <p style="font-size: 14px; margin-top: 10px;">Add some delicious items to get started!</p>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80?text=Food'">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-price">\u20a6${(item.price * item.quantity).toLocaleString()}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Open cart panel
function openCart() {
    cartOverlay.classList.add('active');
    cartPanel.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close cart panel
function closeCart() {
    cartOverlay.classList.remove('active');
    cartPanel.classList.remove('active');
    document.body.style.overflow = '';
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Calculate total
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order summary
    const orderSummary = cart.map(item => 
        `${item.name} x${item.quantity} - \u20a6${(item.price * item.quantity).toLocaleString()}`
    ).join('\
');
    
    // Show checkout confirmation
    const checkoutMessage = `
\ud83c\udf7d\ufe0f ORDER SUMMARY
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
${orderSummary}

\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
TOTAL: \u20a6${totalAmount.toLocaleString()}

Thank you for your order! 
Your delicious meal is being prepared.

Would you like to confirm this order?
    `;
    
    if (confirm(checkoutMessage)) {
        // Process order
        processOrder(totalAmount);
    }
}

// Process order
function processOrder(totalAmount) {
    // Simulate order processing
    showNotification('Processing your order...', 'success');
    
    setTimeout(() => {
        // Clear cart
        cart = [];
        saveCart();
        updateCartUI();
        closeCart();
        
        // Show success message
        showNotification('\ud83c\udf89 Order placed successfully! Thank you for choosing FoodMan!', 'success');
        
        // Optional: Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
}

// ===== Notification System =====
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <i class="ri-${type === 'success' ? 'check-line' : 'error-warning-line'}" style="margin-left: 10px;"></i>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== Utility Functions =====

// Format price with Nigerian Naira symbol
function formatPrice(price) {
    return `\u20a6${price.toLocaleString()}`;
}

// Get cart total
function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        updateCartUI();
        showNotification('Cart cleared', 'success');
    }
}

// ===== Keyboard Shortcuts =====
// Ctrl/Cmd + K to open cart
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openCart();
    }
});

// Make functions globally accessible for inline onclick handlers
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;

//  n8n webhook URL for chatbot

// Configuration
window.ChatWidgetConfig = {
    webhook: {
        url: 'https://luckyegwu65.app.n8n.cloud/webhook/34d38f6a-d87c-4568-9b09-e066c34c7332/chat', // Replace with your actual n8n URL
        route: 'general'
    }
};

// Select Elements
const widgetContainer = document.getElementById("chat-widget-container");
const widgetButton = document.getElementById("chat-widget-button");
const closeButton = document.getElementById("close-chat");
const sendButton = document.getElementById("chat-widget-send");
const chatInput = document.getElementById("chat-widget-input");
const chatBody = document.getElementById("chat-widget-body");

// Session Management
function getChatId() {
    let chatId = sessionStorage.getItem("chatId");
    if (!chatId) {
        chatId = "chat_" + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem("chatId", chatId);
    }
    return chatId;
}

// UI Toggles
widgetButton.addEventListener("click", () => {
    widgetContainer.style.display = "flex";
    widgetButton.style.display = "none";
});

closeButton.addEventListener("click", () => {
    widgetContainer.style.display = "none";
    widgetButton.style.display = "flex";
});

// Messaging Logic
sendButton.addEventListener("click", function() {
    let message = chatInput.value.trim();
    if (message === "") return;

    // Display User Message
    let newMessage = document.createElement("p");
    newMessage.textContent = message;
    newMessage.style.color = "#333";
    newMessage.style.background = "#f1f1f1";
    chatBody.appendChild(newMessage);

    let chatId = getChatId();

    // Send to Webhook
    fetch(window.ChatWidgetConfig.webhook.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chatId: chatId,
            message: message,
            route: window.ChatWidgetConfig.webhook.route
        })
    })
    .then(response => response.json())
    .then(data => {
        // Display Bot Response
        let botMessage = document.createElement("p");
        botMessage.innerHTML = data.output || "Sorry, I couldn't understand that.";
        botMessage.style.color = "#fff";
        botMessage.style.background = "#854fff";
        botMessage.style.marginTop = "10px";
        chatBody.appendChild(botMessage);
        
        // Auto-scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;
    })
    .catch(error => console.error("Error:", error));

    chatInput.value = "";
});