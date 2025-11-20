// =========================================
// CAMBO NET - Shopping Cart System
// Version: 3.2.0 - Enhanced Size, Color & Quantity
// =========================================

// =========================================
// PRODUCT DATA WITH SIZES, COLORS AND PRICES
// =========================================

const productSizes = {
  "ម្ជុល 3 (ស្តើង)": [
    { size: "2m x 100m", price: 30 },
    { size: "4m x 100m", price: 45 },
    { size: "6m x 100m", price: 65 },
    { size: "8m x 100m", price: 80 },
    { size: "2m x 50m ", price: 10 },
    { size: "4m x 50m ", price: 15 },
    { size: "6m x 50m ", price: 25 },
    { size: "8m x 50m", price: 30 },
  ],
  "ម្ជុល 6 (កណ្ដាល)": [
    { size: "2m x 100m", price: 30 },
    { size: "4m x 100m", price: 45 },
    { size: "6m x 100m", price: 65 },
    { size: "8m x 100m", price: 80 },
    { size: "2m x 50m", price: 10 },
    { size: "4m x 50m", price: 15 },
    { size: "6m x 50m", price: 25 },
    { size: "8m x 50m", price: 30 },
  ],
  "ម្ជុល 8 (ក្រាស់)": [
    { size: "2m x 100m", price: 30 },
    { size: "4m x 100m", price: 45 },
    { size: "6m x 100m", price: 65 },
    { size: "8m x 100m", price: 80 },
    { size: "2m x 50m", price: 10 },
    { size: "4m x 50m", price: 15 },
    { size: "6m x 50m", price: 25 },
    { size: "8m x 50m", price: 30 },
  ],
};

// Available colors for all products
const availableColors = [
  { name: "ខៀវ", value: "blue", code: "#3b82f6" },
  { name: "ខ្មៅ", value: "black", code: "#000000" },
  { name: "បៃតង", value: "green", code: "#22c55e" },
];

// =========================================
// CART STATE MANAGEMENT
// =========================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentProduct = null;
let selectedSize = null;
let selectedColor = null;
let sizeQuantities = {}; // Track quantities for each size
let colorQuantities = {}; // Track quantities for each color combination

// =========================================
// PRODUCT DETAIL MODAL FUNCTIONS
// =========================================

/**
 * Show product detail modal with size and color options
 */
function showProductDetail(name, description, image) {
  currentProduct = { name, description, image };

  // Reset selections and quantities
  selectedColor = availableColors[0]; // Default to first color
  sizeQuantities = {};
  colorQuantities = {};

  // Update modal content
  document.getElementById("modalProductName").textContent = name;
  document.getElementById("modalProductDesc").textContent = description;
  document.getElementById("modalProductImage").src = image;

  // Render size options
  renderSizeOptions(name);

  // Render color options
  renderColorOptions();

  // Set default selections
  const defaultOption = productSizes[name][0];
  selectSize(name, defaultOption.size, defaultOption.price);
  selectColor(availableColors[0]);

  // Show modal
  document.getElementById("productModal").classList.add("show");
}

/**
 * Render size options
 */
function renderSizeOptions(productName) {
  const sizeOptions = document.getElementById("sizeOptions");
  sizeOptions.innerHTML = "";

  productSizes[productName].forEach((option, index) => {
    const sizeBtn = document.createElement("button");
    sizeBtn.type = "button";
    sizeBtn.className = "size-option" + (index === 0 ? " active" : "");
    sizeBtn.textContent = option.size;
    sizeBtn.onclick = () => selectSize(productName, option.size, option.price);
    sizeOptions.appendChild(sizeBtn);

    // Initialize quantity for this size (default 1)
    sizeQuantities[option.size] = 1;
  });
}

/**
 * Render color options
 */
function renderColorOptions() {
  const colorOptions = document.getElementById("colorOptions");
  colorOptions.innerHTML = "";

  availableColors.forEach((color, index) => {
    const colorBtn = document.createElement("button");
    colorBtn.type = "button";
    colorBtn.className = "color-option" + (index === 0 ? " active" : "");
    colorBtn.innerHTML = `
      <span class="color-swatch" style="background-color: ${color.code}"></span>
      <span class="color-name">${color.name}</span>
    `;
    colorBtn.onclick = () => selectColor(color);
    colorOptions.appendChild(colorBtn);
  });
}

/**
 * Handle size selection
 */
function selectSize(productName, size, price) {
  selectedSize = { size, price };

  // Update active state on size buttons
  document.querySelectorAll(".size-option").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.textContent === size) {
      btn.classList.add("active");
    }
  });

  // Update quantity display for selected size and color combination
  const comboKey = getComboKey(size, selectedColor.value);
  document.getElementById("productQty").value = colorQuantities[comboKey] || 1;

  // Update price display
  updatePriceDisplay();
}

/**
 * Handle color selection
 */
function selectColor(color) {
  selectedColor = color;

  // Update active state on color buttons
  document.querySelectorAll(".color-option").forEach((btn) => {
    btn.classList.remove("active");
    const colorName = btn.querySelector(".color-name").textContent;
    if (colorName === color.name) {
      btn.classList.add("active");
    }
  });

  // Update product image based on color (if you have different images)
  updateProductImageByColor();

  // Update quantity display for selected size and color combination
  if (selectedSize) {
    const comboKey = getComboKey(selectedSize.size, color.value);
    document.getElementById("productQty").value =
      colorQuantities[comboKey] || 1;
  }

  // Update price display
  updatePriceDisplay();
}

/**
 * Update product image based on selected color
 */
function updateProductImageByColor() {
  if (!currentProduct || !selectedColor) return;

  const productImage = document.getElementById("modalProductImage");
  const baseImage = currentProduct.image;

  // You can implement different images for different colors here
  // For now, we'll just add a color filter overlay
  productImage.style.filter = `drop-shadow(0 0 10px ${selectedColor.code}40)`;
}

/**
 * Generate unique key for size-color combination
 */
function getComboKey(size, color) {
  return `${size}-${color}`;
}

/**
 * Update price display based on quantity
 */
function updatePriceDisplay() {
  if (!selectedSize) return;

  const qty = parseInt(document.getElementById("productQty").value) || 1;
  const price = selectedSize.price;
  const total = price * qty;

  document.getElementById("selectedPrice").textContent = `$${price.toFixed(2)}`;
  document.getElementById("totalPrice").textContent = `$${total.toFixed(2)}`;
}

/**
 * Increase quantity for current size and color
 */
function increaseQty() {
  const input = document.getElementById("productQty");
  const currentValue = parseInt(input.value) || 1;
  input.value = currentValue + 1;

  // Update quantity for current size-color combination
  if (selectedSize && selectedColor) {
    const comboKey = getComboKey(selectedSize.size, selectedColor.value);
    colorQuantities[comboKey] = input.value;
  }

  updatePriceDisplay();
}

/**
 * Decrease quantity for current size and color
 */
function decreaseQty() {
  const input = document.getElementById("productQty");
  const currentValue = parseInt(input.value) || 1;
  if (currentValue > 1) {
    input.value = currentValue - 1;

    // Update quantity for current size-color combination
    if (selectedSize && selectedColor) {
      const comboKey = getComboKey(selectedSize.size, selectedColor.value);
      colorQuantities[comboKey] = input.value;
    }

    updatePriceDisplay();
  }
}

/**
 * Add current selection (size + color) to cart
 */
function addToCart() {
  if (!currentProduct || !selectedSize || !selectedColor) {
    showNotification("សូមជ្រើសរើសទំហំ និងពណ៌ផលិតផល!", "warning");
    return;
  }

  const qty = parseInt(document.getElementById("productQty").value) || 1;

  const cartItem = {
    id: Date.now() + Math.random(),
    name: currentProduct.name,
    size: selectedSize.size,
    color: selectedColor.name,
    colorValue: selectedColor.value,
    price: selectedSize.price,
    quantity: qty,
    image: currentProduct.image,
    addedAt: new Date().toISOString(),
  };

  cart.push(cartItem);
  saveCart();
  updateCartBadge();

  showNotification(
    `បានបញ្ចូល ${selectedColor.name} ${selectedSize.size} ទៅកន្ត្រក! 🛒`,
    "success"
  );
  document.getElementById("productModal").classList.remove("show");

  // Reset quantity for this combination
  const comboKey = getComboKey(selectedSize.size, selectedColor.value);
  colorQuantities[comboKey] = 1;
  document.getElementById("productQty").value = 1;
}

/**
 * Add all size-color combinations to cart
 */
function addAllSizesToCart() {
  if (!currentProduct) {
    showNotification("សូមជ្រើសរើសផលិតផលមុន!", "warning");
    return;
  }

  let addedCount = 0;

  // Add each size-color combination with its quantity to cart
  productSizes[currentProduct.name].forEach((sizeOption) => {
    availableColors.forEach((color) => {
      const comboKey = getComboKey(sizeOption.size, color.value);
      const qty = colorQuantities[comboKey] || 0;

      if (qty > 0) {
        const cartItem = {
          id: Date.now() + Math.random(),
          name: currentProduct.name,
          size: sizeOption.size,
          color: color.name,
          colorValue: color.value,
          price: sizeOption.price,
          quantity: parseInt(qty),
          image: currentProduct.image,
          addedAt: new Date().toISOString(),
        };

        cart.push(cartItem);
        addedCount++;
      }
    });
  });

  if (addedCount > 0) {
    saveCart();
    updateCartBadge();
    showNotification(
      `បានបញ្ចូល ${addedCount} ការរួមបញ្ចូលទៅកន្ត្រក! 🛒`,
      "success"
    );
    document.getElementById("productModal").classList.remove("show");

    // Reset all quantities
    Object.keys(colorQuantities).forEach((key) => {
      colorQuantities[key] = 1;
    });
  } else {
    showNotification(
      "សូមជ្រើសរើសចំនួនសម្រាប់យ៉ាងហោចណាស់មួយការរួមបញ្ចូល!",
      "warning"
    );
  }
}

/**
 * Add to cart and go directly to cart
 */
function buyNow() {
  addToCart();
  setTimeout(() => {
    showCart();
  }, 300);
}

// =========================================
// SHOPPING CART FUNCTIONS (Updated for colors)
// =========================================

/**
 * Show cart modal
 */
function showCart() {
  renderCartItems();
  document.getElementById("cartModal").classList.add("show");
}

/**
 * Render all cart items with color information
 */
function renderCartItems() {
  const cartItemsDiv = document.getElementById("cartItems");

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p class="empty-cart">កន្ត្រករបស់អ្នកទទេ</p>';
    document.querySelector(".cart-summary").style.display = "none";
    return;
  }

  document.querySelector(".cart-summary").style.display = "block";

  let html = '<div class="cart-items-list">';
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    html += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="item-details">
            <p>ទំហំ: ${item.size}</p>
            <p>ពណ៌: 
              <span class="color-indicator" style="background-color: ${getColorCode(
                item.color
              )}"></span>
              ${item.color}
            </p>
            <p class="item-price">$${item.price.toFixed(2)} x ${
      item.quantity
    }</p>
          </div>
        </div>
        <div class="cart-item-actions">
          <span class="item-total">$${itemTotal.toFixed(2)}</span>
          <button class="btn-remove" onclick="removeFromCart(${
            item.id
          })">🗑️</button>
        </div>
      </div>
    `;
  });

  html += "</div>";
  cartItemsDiv.innerHTML = html;
  document.getElementById("cartTotal").textContent = `$${total.toFixed(2)}`;
}

/**
 * Get color code from color name
 */
function getColorCode(colorName) {
  const color = availableColors.find((c) => c.name === colorName);
  return color ? color.code : "#ccc";
}

/**
 * Remove item from cart
 */
function removeFromCart(itemId) {
  if (confirm("តើអ្នកចង់លុបផលិតផលនេះមែនទេ?")) {
    cart = cart.filter((item) => item.id !== itemId);
    saveCart();
    updateCartBadge();
    renderCartItems();
    showNotification("បានដកចេញពីកន្ត្រក", "info");
  }
}

/**
 * Save cart to localStorage
 */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Update cart badge count
 */
function updateCartBadge() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cartCount");
  if (badge) {
    badge.textContent = count;

    // Add animation when count changes
    badge.style.transform = "scale(1.3)";
    setTimeout(() => {
      badge.style.transform = "scale(1)";
    }, 200);
  }
}

// =========================================
// CHECKOUT PROCESS (Updated for colors)
// =========================================

/**
 * Proceed to checkout
 */
function proceedToCheckout() {
  if (cart.length === 0) {
    showNotification("សូមបញ្ចូលផលិតផលទៅកន្ត្រក", "warning");
    return;
  }

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    showNotification("សូមចូលប្រើប្រាស់ជាមុនសិន!", "warning");
    document.getElementById("cartModal").classList.remove("show");
    document.getElementById("loginModal").classList.add("show");
    return;
  }

  // Pre-fill customer info if available
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser && currentUser.name) {
    document.getElementById("customerName").value = currentUser.name;
  }

  renderCheckoutItems();
  document.getElementById("cartModal").classList.remove("show");
  document.getElementById("checkoutModal").classList.add("show");
}

/**
 * Render checkout items summary with color information
 */
function renderCheckoutItems() {
  const checkoutItemsDiv = document.getElementById("checkoutItems");
  let html = "";
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    html += `
      <div class="summary-row">
        <span>
          ${item.name} (${item.size}, 
          <span class="color-text" style="color: ${getColorCode(item.color)}">${
      item.color
    }</span>) 
          x ${item.quantity}
        </span>
        <span>$${itemTotal.toFixed(2)}</span>
      </div>
    `;
  });

  checkoutItemsDiv.innerHTML = html;
  document.getElementById("checkoutTotal").textContent = `$${total.toFixed(2)}`;
}

// =========================================
// ORDER HISTORY (Updated for colors)
// =========================================

/**
 * Show order history modal
 */
function showOrderHistory() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    showNotification("សូមចូលប្រើប្រាស់ជាមុនសិន!", "warning");
    document.getElementById("loginModal").classList.add("show");
    return;
  }

  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const historyDiv = document.getElementById("historyItems");

  if (orders.length === 0) {
    historyDiv.innerHTML =
      '<p class="empty-cart">មិនមានប្រវត្តិការបញ្ជាទិញ</p>';
  } else {
    let html = '<div class="order-history-list">';

    // Show most recent orders first
    orders.reverse().forEach((order) => {
      const date = new Date(order.date).toLocaleDateString("km-KH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      html += `
        <div class="order-history-item">
          <div class="order-header">
            <h3>លេខបញ្ជាទិញ: ${order.id}</h3>
            <span class="order-status">${order.status}</span>
          </div>
          <p class="order-date">📅 កាលបរិច្ឆេទ: ${date}</p>
          <div class="order-items">
            ${order.items
              .map(
                (item) => `
              <div class="order-item-row">
                <span>
                  ${item.name} (${item.size}, 
                  <span style="color: ${getColorCode(item.color)}">${
                  item.color
                }</span>) 
                  x ${item.quantity}
                </span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `
              )
              .join("")}
          </div>
          <div class="order-footer">
            <span>💳 ${getPaymentMethodName(order.payment)}</span>
            <strong>សរុប: $${order.total.toFixed(2)}</strong>
          </div>
        </div>
      `;
    });

    html += "</div>";
    historyDiv.innerHTML = html;
  }

  document.getElementById("historyModal").classList.add("show");
}

// =========================================
// NOTIFICATION SYSTEM
// =========================================

/**
 * Show notification message
 */
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifs = document.querySelectorAll(".notification");
  existingNotifs.forEach((n) => n.remove());

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `<span>${message}</span>`;

  // Base styles
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "15px 25px",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    zIndex: "100000",
    animation: "slideInRight 0.3s",
    fontSize: "1rem",
    fontWeight: "500",
    maxWidth: "400px",
  });

  // Type-specific colors
  const colors = {
    success: { bg: "#dcfce7", color: "#166534", border: "#22c55e" },
    error: { bg: "#fee2e2", color: "#991b1b", border: "#ef4444" },
    warning: { bg: "#fef3c7", color: "#92400e", border: "#f59e0b" },
    info: { bg: "#dbeafe", color: "#1e40af", border: "#3b82f6" },
  };

  const colorSet = colors[type] || colors.info;
  notification.style.background = colorSet.bg;
  notification.style.color = colorSet.color;
  notification.style.borderLeft = `4px solid ${colorSet.border}`;

  document.body.appendChild(notification);

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "slideOutRight 0.3s";
      setTimeout(() => notification.remove(), 300);
    }
  }, 3000);
}

// =========================================
// MODAL CLOSE HANDLERS
// =========================================

document.addEventListener("DOMContentLoaded", () => {
  // Close button handlers
  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.target.closest(".modal").classList.remove("show");
    });
  });

  // Click outside to close
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
      }
    });
  });

  // ESC key to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.show").forEach((modal) => {
        modal.classList.remove("show");
      });
    }
  });

  // Quantity input listener
  const qtyInput = document.getElementById("productQty");
  if (qtyInput) {
    qtyInput.addEventListener("input", function () {
      if (selectedSize && selectedColor) {
        const comboKey = getComboKey(selectedSize.size, selectedColor.value);
        colorQuantities[comboKey] = parseInt(this.value) || 1;
      }
      updatePriceDisplay();
    });

    qtyInput.addEventListener("change", function () {
      if (selectedSize && selectedColor) {
        const comboKey = getComboKey(selectedSize.size, selectedColor.value);
        colorQuantities[comboKey] = parseInt(this.value) || 1;
      }
      updatePriceDisplay();
    });
  }
});

// =========================================
// INITIALIZATION
// =========================================

document.addEventListener("DOMContentLoaded", () => {
  // Update cart badge on page load
  updateCartBadge();

  console.log(
    "%c🛒 Enhanced Cart System with Colors Loaded",
    "color: #22c55e; font-size: 14px; font-weight: bold;"
  );
  console.log(`Cart items: ${cart.length}`);
});

// =========================================
// EXPORT FUNCTIONS TO GLOBAL SCOPE
// =========================================

window.showProductDetail = showProductDetail;
window.selectSize = selectSize;
window.selectColor = selectColor;
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;
window.addToCart = addToCart;
window.addAllSizesToCart = addAllSizesToCart;
window.buyNow = buyNow;
window.showCart = showCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.proceedToCheckout = proceedToCheckout;
window.showOrderHistory = showOrderHistory;
window.showNotification = showNotification;

// =========================================
// CHECKOUT FORM SUBMISSION HANDLER
// =========================================

/**
 * Handle checkout form submission
 */
document.addEventListener("DOMContentLoaded", function () {
  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (e) {
      e.preventDefault();
      confirmOrder();
    });
  }
});

/**
 * Confirm order and process payment
 */
function confirmOrder() {
  // Get form data
  const name = document.getElementById("customerName").value;
  const phone = document.getElementById("customerPhone").value;
  const address = document.getElementById("customerAddress").value;
  const paymentMethod = document.querySelector(
    'input[name="payment"]:checked'
  ).value;

  // Validate form
  if (!name || !phone || !address) {
    showNotification("សូមបំពេញព័ត៌មានទាំងអស់!", "error");
    return;
  }

  if (cart.length === 0) {
    showNotification("កន្ត្រករបស់អ្នកទទេ!", "warning");
    return;
  }

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Create order object
  const order = {
    id: "ORD-" + Date.now(),
    date: new Date().toISOString(),
    customer: { name, phone, address },
    items: [...cart],
    total: total,
    payment: paymentMethod,
    status: "pending",
  };

  // Save order to history
  saveOrderToHistory(order);

  // Clear cart
  clearCart();

  // Close modal
  document.getElementById("checkoutModal").classList.remove("show");

  // Show success message
  showNotification(`✅ ការបញ្ជាទិញជោគជ័យ! លេខបញ្ជាទិញ: ${order.id}`, "success");

  // Optional: Show order details
  setTimeout(() => {
    showOrderConfirmationDetails(order);
  }, 2000);
}

/**
 * Save order to order history
 */
function saveOrderToHistory(order) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
}

/**
 * Clear cart after successful order
 */
function clearCart() {
  cart = [];
  saveCart();
  updateCartBadge();
}

/**
 * Show detailed order confirmation
 */
function showOrderConfirmationDetails(order) {
  const orderDetails = `
ការបញ្ជាទិញជោគជ័យ! 🎉

លេខបញ្ជាទិញ: ${order.id}
ឈ្មោះអតិថិជន: ${order.customer.name}
លេខទូរស័ព្ទ: ${order.customer.phone}
អាសយដ្ឋាន: ${order.customer.address}
វិធីសាស្ត្របង់ប្រាក់: ${getPaymentMethodName(order.payment)}
សរុប: $${order.total.toFixed(2)}

សូមអរគុណសម្រាប់ការទិញផលិតផលរបស់យើង!
  `;

  // You can show this in a modal or alert
  alert(orderDetails);
}

/**
 * Get payment method display name
 */
function getPaymentMethodName(method) {
  const methods = {
    cod: "សាច់ប្រាក់ពេលទទួល",
    aba: "ABA Mobile Banking",
    wing: "Wing Money",
  };
  return methods[method] || method;
}
