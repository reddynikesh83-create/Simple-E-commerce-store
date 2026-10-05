/**
 * CodeAlpha Simple E-Commerce Store - Cart Management
 */

class CartManager {
  constructor() {
    this.items = this.loadCart();
    this.coupon = null;
    this.discountPercent = 0;
    this.discountAmount = 0;
  }

  loadCart() {
    try {
      const stored = localStorage.getItem('codealpha_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem('codealpha_cart', JSON.stringify(this.items));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
    this.updateCartBadge();
    this.renderCartDrawer();
  }

  addItem(product, quantity = 1) {
    const existingIndex = this.items.findIndex(item => item.id === product.id);
    const qty = parseInt(quantity, 10) || 1;

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += qty;
    } else {
      this.items.push({
        id: product.id,
        title: product.title,
        price: Number(product.price) || 0,
        image: product.image,
        category: product.category,
        quantity: qty
      });
    }

    this.saveCart();
    if (window.showToast) {
      window.showToast(`Added "${product.title}" to cart!`, 'success');
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
    if (window.showToast) {
      window.showToast('Item removed from cart', 'info');
    }
  }

  updateQuantity(productId, delta) {
    const item = this.items.find(item => item.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(productId);
    } else {
      this.saveCart();
    }
  }

  clearCart() {
    this.items = [];
    this.coupon = null;
    this.discountPercent = 0;
    this.discountAmount = 0;
    this.saveCart();
  }

  getCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + ((Number(item.price) || 0) * item.quantity), 0);
  }

  applyCoupon(code) {
    const cleanCode = code ? code.trim().toUpperCase() : '';
    if (cleanCode === 'ZOVIRA10' || cleanCode === 'ALPHA10') {
      this.coupon = cleanCode;
      this.discountPercent = 10;
      this.discountAmount = 0;
      return { success: true, message: '10% discount applied!' };
    } else if (cleanCode === 'CODEALPHA') {
      this.coupon = 'CODEALPHA';
      this.discountPercent = 0;
      this.discountAmount = 15;
      return { success: true, message: '$15 coupon applied!' };
    } else {
      return { success: false, message: 'Invalid promo code. Try "ZOVIRA10" or "CODEALPHA"' };
    }
  }

  getCalculations() {
    const subtotal = this.getSubtotal();
    let discount = 0;
    if (this.discountPercent > 0) {
      discount = (subtotal * this.discountPercent) / 100;
    } else if (this.discountAmount > 0) {
      discount = Math.min(subtotal, this.discountAmount);
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const shipping = discountedSubtotal > 100 || discountedSubtotal === 0 ? 0 : 9.99;
    const taxRate = 0.08;
    const tax = discountedSubtotal * taxRate;
    const total = discountedSubtotal + shipping + tax;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      discountedSubtotal: Number(discountedSubtotal.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
      isFreeShipping: subtotal >= 100
    };
  }

  updateCartBadge() {
    const badge = document.getElementById('cart-count-badge');
    if (!badge) return;
    const count = this.getCount();
    badge.textContent = count;
    badge.classList.remove('badge-pulse');
    void badge.offsetWidth; // Trigger reflow
    badge.classList.add('badge-pulse');
  }

  renderCartDrawer() {
    const container = document.getElementById('cart-items-container');
    const footer = document.getElementById('cart-drawer-footer');
    if (!container) return;

    if (this.items.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 3rem 1rem;">
          <div class="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Explore our trending catalog and add items you love.</p>
          <button class="btn-primary" onclick="cartManager.toggleCartDrawer(false)">Start Shopping</button>
        </div>
      `;
      if (footer) footer.style.display = 'none';
      return;
    }

    if (footer) footer.style.display = 'block';

    container.innerHTML = this.items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}" class="cart-item-img" />
        <div class="cart-item-details">
          <div class="cart-item-title" title="${item.title}">${item.title}</div>
          <div class="cart-item-price">$${Number(item.price).toFixed(2)}</div>
          <div class="cart-item-controls">
            <div class="qty-control">
              <button class="qty-btn" onclick="cartManager.updateQuantity('${item.id}', -1)">−</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" onclick="cartManager.updateQuantity('${item.id}', 1)">+</button>
            </div>
            <button class="btn-remove" title="Remove Item" onclick="cartManager.removeItem('${item.id}')">🗑️</button>
          </div>
        </div>
      </div>
    `).join('');

    const calc = this.getCalculations();
    const summaryContainer = document.getElementById('cart-drawer-summary');
    if (summaryContainer) {
      summaryContainer.innerHTML = `
        ${calc.isFreeShipping ? `
          <div class="free-shipping-bar">🎉 You unlocked FREE Shipping!</div>
        ` : `
          <div class="free-shipping-bar" style="background: #eff6ff; border-color: #bfdbfe; color: #1e40af;">
            Add $${(100 - calc.subtotal).toFixed(2)} more for FREE standard shipping!
          </div>
        `}
        <div class="cart-summary-row">
          <span>Subtotal</span>
          <span>$${calc.subtotal.toFixed(2)}</span>
        </div>
        ${calc.discount > 0 ? `
          <div class="cart-summary-row" style="color: var(--success); font-weight: 600;">
            <span>Discount (${this.coupon})</span>
            <span>-$${calc.discount.toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="cart-summary-row">
          <span>Estimated Tax (8%)</span>
          <span>$${calc.tax.toFixed(2)}</span>
        </div>
        <div class="cart-summary-row">
          <span>Shipping</span>
          <span>${calc.shipping === 0 ? '<strong style="color: var(--success);">FREE</strong>' : `$${calc.shipping.toFixed(2)}`}</span>
        </div>
        <div class="cart-summary-row total">
          <span>Estimated Total</span>
          <span>$${calc.total.toFixed(2)}</span>
        </div>
      `;
    }
  }

  toggleCartDrawer(open) {
    const backdrop = document.getElementById('cart-drawer-backdrop');
    if (!backdrop) return;
    if (open === undefined) {
      const willOpen = !backdrop.classList.contains('open');
      if (willOpen) this.renderCartDrawer();
      backdrop.classList.toggle('open');
    } else if (open) {
      this.renderCartDrawer();
      backdrop.classList.add('open');
    } else {
      backdrop.classList.remove('open');
    }
  }
}

// Global Cart Instance (accessible as window.cartManager and cartManager)
var cartManager = window.cartManager = new CartManager();
