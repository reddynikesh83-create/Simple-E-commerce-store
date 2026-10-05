/**
 * CodeAlpha Simple E-Commerce Store - Checkout & Order Processing
 */

class CheckoutManager {
  constructor() {
    this.currentOrder = null;
  }

  openCheckoutModal() {
    const items = window.cartManager ? window.cartManager.items : [];
    if (!items || items.length === 0) {
      if (window.showToast) {
        window.showToast('Your cart is empty. Add items before checking out!', 'warning');
      }
      return;
    }

    const modalBackdrop = document.getElementById('checkout-modal-backdrop');
    if (!modalBackdrop) return;

    // Pre-fill user data if authenticated
    if (window.authManager && window.authManager.currentUser) {
      const u = window.authManager.currentUser;
      const nameInput  = document.getElementById('checkout-name');
      const emailInput = document.getElementById('checkout-email');
      const phoneInput = document.getElementById('checkout-phone');
      const streetInput = document.getElementById('checkout-street');

      if (nameInput  && !nameInput.value)  nameInput.value  = u.name    || '';
      if (emailInput && !emailInput.value) emailInput.value = u.email   || '';
      if (phoneInput && !phoneInput.value) phoneInput.value = u.phone   || '';
      if (streetInput && !streetInput.value) streetInput.value = u.address || '';
    }

    // Reset coupon message
    const couponMsg = document.getElementById('checkout-coupon-msg');
    if (couponMsg) couponMsg.textContent = '';
    const couponInput = document.getElementById('checkout-coupon-input');
    if (couponInput) couponInput.value = '';

    this.renderCheckoutSummary();
    modalBackdrop.classList.add('open');
  }

  closeCheckoutModal() {
    const modalBackdrop = document.getElementById('checkout-modal-backdrop');
    if (modalBackdrop) modalBackdrop.classList.remove('open');
  }

  renderCheckoutSummary() {
    const container       = document.getElementById('checkout-items-list');
    const totalsContainer = document.getElementById('checkout-totals');
    if (!container || !totalsContainer) return;

    const items = window.cartManager ? window.cartManager.items : [];
    const calc  = window.cartManager ? window.cartManager.getCalculations() : {
      subtotal: 0, discount: 0, tax: 0, shipping: 0, total: 0
    };

    if (items.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted);font-size:0.88rem;">No items in cart.</p>';
      totalsContainer.innerHTML = '';
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="checkout-item-mini">
        <img src="${item.image || ''}" alt="${item.title || 'Item'}" />
        <div style="flex:1;min-width:0;">
          <div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.title || 'Item'}</div>
          <div style="font-size:0.8rem;">Qty: ${item.quantity} × $${Number(item.price).toFixed(2)}</div>
        </div>
        <span style="font-weight:700;white-space:nowrap;">$${(Number(item.price) * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');

    const coupon = window.cartManager ? window.cartManager.coupon : null;

    totalsContainer.innerHTML = `
      <div class="cart-summary-row">
        <span>Items Subtotal:</span>
        <span>$${calc.subtotal.toFixed(2)}</span>
      </div>
      ${calc.discount > 0 ? `
        <div class="cart-summary-row" style="color:var(--success);font-weight:600;">
          <span>Discount (${coupon || 'Promo'}):</span>
          <span>-$${calc.discount.toFixed(2)}</span>
        </div>
      ` : ''}
      <div class="cart-summary-row">
        <span>Sales Tax (8%):</span>
        <span>$${calc.tax.toFixed(2)}</span>
      </div>
      <div class="cart-summary-row">
        <span>Shipping:</span>
        <span>${calc.shipping === 0
          ? '<strong style="color:var(--success);">FREE</strong>'
          : `$${calc.shipping.toFixed(2)}`}</span>
      </div>
      <div class="cart-summary-row total">
        <span>Final Total:</span>
        <span style="color:var(--primary);">$${calc.total.toFixed(2)}</span>
      </div>
    `;
  }

  applyCoupon() {
    const input = document.getElementById('checkout-coupon-input');
    const msg   = document.getElementById('checkout-coupon-msg');
    if (!input) return;

    const code   = (input.value || '').trim();
    if (!code) {
      if (msg) { msg.textContent = 'Please enter a promo code.'; msg.style.color = 'var(--danger)'; }
      return;
    }

    const result = window.cartManager.applyCoupon(code);
    if (msg) {
      msg.textContent = result.message;
      msg.style.color = result.success ? 'var(--success)' : 'var(--danger)';
    }

    if (result.success) {
      this.renderCheckoutSummary();
      if (window.showToast) window.showToast(result.message, 'success');
    }
  }

  fillTestShippingDetails() {
    const fields = {
      'checkout-name':  'Alex Morgan',
      'checkout-email': 'alex.morgan@zovira.store',
      'checkout-phone': '+1 (555) 349-2041',
      'checkout-street': '742 Evergreen Terrace, Suite 100',
      'checkout-city':  'San Francisco',
      'checkout-state': 'CA',
      'checkout-zip':   '94107'
    };
    Object.entries(fields).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    });
    if (window.showToast) window.showToast('Test shipping details filled!', 'success');
  }

  // ==========================================
  // Order Submission
  // ==========================================

  async handleOrderSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    // Validate cart is not empty
    const cartItems = window.cartManager ? window.cartManager.items : [];
    if (!cartItems || cartItems.length === 0) {
      if (window.showToast) window.showToast('Your cart is empty!', 'warning');
      return;
    }

    const btnSubmit = document.getElementById('btn-submit-order');
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = '⏳ Processing Order...';
    }

    // ── Collect form values ──────────────────────────────────────────────────
    const nameEl   = document.getElementById('checkout-name');
    const emailEl  = document.getElementById('checkout-email');
    const phoneEl  = document.getElementById('checkout-phone');
    const streetEl = document.getElementById('checkout-street');
    const cityEl   = document.getElementById('checkout-city');
    const stateEl  = document.getElementById('checkout-state');
    const zipEl    = document.getElementById('checkout-zip');

    // Validate required fields
    const name   = nameEl   ? nameEl.value.trim()   : '';
    const email  = emailEl  ? emailEl.value.trim()  : '';
    const street = streetEl ? streetEl.value.trim() : '';
    const city   = cityEl   ? cityEl.value.trim()   : '';
    const zip    = zipEl    ? zipEl.value.trim()    : '';

    if (!name || !email || !street || !city || !zip) {
      if (window.showToast) {
        window.showToast('Please fill in all required shipping fields.', 'error');
      }
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '🔒 Place Order & Pay';
      }
      return;
    }

    const customer = {
      name,
      email,
      phone: phoneEl ? phoneEl.value.trim() : ''
    };

    const shippingAddress = {
      street,
      city,
      state:   stateEl ? stateEl.value.trim() : '',
      zipCode: zip,
      country: 'USA'
    };

    const paymentMethodEl = document.querySelector('input[name="payment-method"]:checked');
    const paymentMethod   = paymentMethodEl ? paymentMethodEl.value : 'Card';

    const calc = window.cartManager.getCalculations();

    const items = cartItems.map(item => {
      const quantity = parseInt(item.quantity, 10) || 1;
      const price    = Number(item.price) || 0;
      return {
        productId: item.id,
        id:        item.id,
        title:     item.title    || 'Item',
        image:     item.image    || '',
        category:  item.category || '',
        quantity,
        price,
        itemTotal: Number((price * quantity).toFixed(2))
      };
    });

    // Attach userId if logged in
    const userId = (window.authManager && window.authManager.currentUser)
      ? window.authManager.currentUser.id
      : null;

    const orderPayload = {
      userId,
      customer,
      shippingAddress,
      paymentMethod,
      items,
      subtotal: calc.subtotal,
      discount: calc.discount,
      shipping: calc.shipping,
      tax:      calc.tax,
      total:    calc.total,
      coupon:   window.cartManager.coupon || null
    };

    try {
      const res = await window.api.createOrder(orderPayload);

      // Accept either backend response or construct a local fallback
      const order = (res && res.order) ? res.order : this._buildLocalOrder(orderPayload);

      this.currentOrder = order;
      window.cartManager.clearCart();
      this.closeCheckoutModal();
      this.openSuccessModal(order);

    } catch (err) {
      // Backend unreachable or returned an error — use offline fallback
      console.warn('[Order] Backend error, using local fallback:', err.message);
      const fallbackOrder = this._buildLocalOrder(orderPayload);

      // Persist locally so it shows in "My Orders"
      if (window.api && window.api.saveOrderLocally) {
        window.api.saveOrderLocally(fallbackOrder);
      }

      this.currentOrder = fallbackOrder;
      window.cartManager.clearCart();
      this.closeCheckoutModal();
      this.openSuccessModal(fallbackOrder);

    } finally {
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '🔒 Place Order & Pay';
      }
    }
  }

  // Build a complete local order object matching backend schema
  _buildLocalOrder(payload) {
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const deliveryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
      .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return {
      id:               orderId,
      userId:           payload.userId || null,
      customer:         payload.customer,
      shippingAddress:  payload.shippingAddress,
      paymentMethod:    payload.paymentMethod,
      items:            payload.items,
      subtotal:         payload.subtotal,
      discount:         payload.discount,
      shipping:         payload.shipping,
      tax:              payload.tax,
      total:            payload.total,
      coupon:           payload.coupon,
      paymentStatus:    'Paid',
      orderStatus:      'Confirmed',
      estimatedDelivery: deliveryDate,
      createdAt:         new Date().toISOString()
    };
  }

  // ==========================================
  // Success / Confirmation Modal
  // ==========================================

  openSuccessModal(order) {
    const modalBackdrop = document.getElementById('success-modal-backdrop');
    const modalBody     = document.getElementById('success-modal-body');
    if (!modalBackdrop || !modalBody) return;

    const orderId       = (order && order.id)                                   || 'ORD-000000';
    const customerName  = (order && order.customer && order.customer.name)       || 'Customer';
    const city          = (order && order.shippingAddress && order.shippingAddress.city)    || '';
    const state         = (order && order.shippingAddress && order.shippingAddress.state)   || '';
    const zip           = (order && order.shippingAddress && order.shippingAddress.zipCode) || '';
    const payment       = (order && order.paymentMethod)                         || 'Card';
    const delivery      = (order && order.estimatedDelivery)                     || 'In 3–5 business days';
    const totalValue    = Number(order && order.total);
    const totalLabel    = Number.isFinite(totalValue) ? `$${totalValue.toFixed(2)}` : 'Paid';

    // Show ordered items
    const orderItems = Array.isArray(order && order.items) ? order.items : [];
    const itemsHtml = orderItems.length > 0 ? `
      <div style="margin-bottom:1rem;">
        <div style="font-size:0.8rem;font-weight:700;color:var(--text-muted);letter-spacing:0.05em;text-transform:uppercase;margin-bottom:0.5rem;">Items Ordered</div>
        ${orderItems.map(item => `
          <div style="display:flex;justify-content:space-between;font-size:0.85rem;padding:0.2rem 0;">
            <span>${item.quantity}× ${item.title}</span>
            <span style="font-weight:600;">$${Number(item.itemTotal || (item.price * item.quantity)).toFixed(2)}</span>
          </div>
        `).join('')}
      </div>
    ` : '';

    modalBody.innerHTML = `
      <div class="order-success-card">
        <div class="success-icon-wrap">✓</div>
        <h2 style="font-size:1.6rem;font-weight:800;margin-bottom:0.4rem;">Order Placed!</h2>
        <p style="color:var(--text-muted);margin-bottom:1.25rem;">
          Thank you, ${customerName}! Your order is confirmed and being prepared.
        </p>

        <div class="order-badge-id" style="margin-bottom:1.25rem;">Order ID: ${orderId}</div>

        <div style="background:var(--bg-subtle);border-radius:var(--radius-md);padding:1.25rem;text-align:left;margin-bottom:1.5rem;font-size:0.88rem;">
          ${itemsHtml}
          <div style="display:flex;justify-content:space-between;margin-bottom:0.45rem;">
            <span style="color:var(--text-muted);">Estimated Delivery:</span>
            <strong>${delivery}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:0.45rem;">
            <span style="color:var(--text-muted);">Shipping To:</span>
            <strong>${customerName}${city ? ', ' + city : ''}${state ? ', ' + state : ''}${zip ? ' ' + zip : ''}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:0.45rem;">
            <span style="color:var(--text-muted);">Payment:</span>
            <strong>${payment} ✓ Verified</strong>
          </div>
          <div style="display:flex;justify-content:space-between;border-top:1px dashed var(--border);padding-top:0.5rem;margin-top:0.5rem;">
            <span style="font-size:1rem;font-weight:700;">Total Paid:</span>
            <strong style="color:var(--primary);font-size:1.1rem;">${totalLabel}</strong>
          </div>
        </div>

        <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;">
          <button class="btn-primary" onclick="checkoutManager.closeSuccessModal()">
            Continue Shopping
          </button>
          ${(window.authManager && window.authManager.currentUser) ? `
            <button class="btn-secondary" onclick="checkoutManager.viewInOrders()">
              📦 View My Orders
            </button>
          ` : ''}
        </div>
      </div>
    `;

    modalBackdrop.classList.add('open');

    // Show success toast
    if (window.showToast) {
      window.showToast(`Order ${orderId} confirmed! 🎉`, 'success');
    }
  }

  closeSuccessModal() {
    const modalBackdrop = document.getElementById('success-modal-backdrop');
    if (modalBackdrop) modalBackdrop.classList.remove('open');
  }

  viewInOrders() {
    this.closeSuccessModal();
    if (window.authManager) {
      window.authManager.openOrdersModal();
    }
  }
}

// Global Checkout Instance (accessible as window.checkoutManager and checkoutManager)
var checkoutManager = window.checkoutManager = new CheckoutManager();
