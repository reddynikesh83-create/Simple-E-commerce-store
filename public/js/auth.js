/**
 * CodeAlpha Simple E-Commerce Store - Authentication & User Account
 */

class AuthManager {
  constructor() {
    this.currentUser = this.loadUser();
  }

  loadUser() {
    try {
      const stored = localStorage.getItem('zovira_user') || localStorage.getItem('codealpha_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  saveUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('zovira_user', JSON.stringify(user));
      localStorage.setItem('codealpha_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('zovira_user');
      localStorage.removeItem('codealpha_user');
    }
    this.updateNavAuthUI();
  }

  async init() {
    this.updateNavAuthUI();
    // Validate token with backend if exists
    if (window.api.getToken()) {
      try {
        const res = await window.api.getMe();
        if (res && res.user) {
          this.saveUser(res.user);
        }
      } catch (err) {
        // Token expired or invalid
        console.warn('Session verification failed, logging out', err);
        this.logout(false);
      }
    }
  }

  updateNavAuthUI() {
    const authContainer = document.getElementById('nav-auth-container');
    if (!authContainer) return;

    if (this.currentUser) {
      authContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <button class="btn-icon" onclick="authManager.openOrdersModal()" title="View your past orders">
            📦 <span class="hide-mobile">Orders</span>
          </button>
          <button class="btn-icon" onclick="authManager.openProfileModal()" title="Account Profile">
            👤 <span class="hide-mobile">${(this.currentUser.name || this.currentUser.email || 'Account').toString().split(' ')[0]}</span>
          </button>
          <button class="btn-secondary" style="padding: 0.45rem 0.75rem; font-size: 0.82rem;" onclick="authManager.logout()">
            Logout
          </button>
        </div>
      `;
    } else {
      authContainer.innerHTML = `
        <button class="btn-primary" onclick="authManager.openAuthModal()">
          Sign In
        </button>
      `;
    }
  }

  openAuthModal(tab = 'login') {
    const modalBackdrop = document.getElementById('auth-modal-backdrop');
    if (!modalBackdrop) return;
    this.switchTab(tab);
    modalBackdrop.classList.add('open');
  }

  closeAuthModal() {
    const modalBackdrop = document.getElementById('auth-modal-backdrop');
    if (modalBackdrop) modalBackdrop.classList.remove('open');
  }

  switchTab(tab) {
    const loginTab = document.getElementById('tab-btn-login');
    const registerTab = document.getElementById('tab-btn-register');
    const loginForm = document.getElementById('auth-login-form');
    const registerForm = document.getElementById('auth-register-form');

    if (tab === 'login') {
      if (loginTab) loginTab.classList.add('active');
      if (registerTab) registerTab.classList.remove('active');
      if (loginForm) loginForm.style.display = 'block';
      if (registerForm) registerForm.style.display = 'none';
    } else {
      if (loginTab) loginTab.classList.remove('active');
      if (registerTab) registerTab.classList.add('active');
      if (loginForm) loginForm.style.display = 'none';
      if (registerForm) registerForm.style.display = 'block';
    }
  }

  fillDemoCredentials() {
    this.switchTab('login');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    if (emailInput && passwordInput) {
      emailInput.value = 'alex.morgan@zovira.store';
      passwordInput.value = 'password123';
      emailInput.focus();
    }
  }

  async loginWithDemo() {
    this.fillDemoCredentials();
    const fakeEvent = { preventDefault() {} };
    await this.handleLogin(fakeEvent);
  }

  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    const submitBtn = e.target ? e.target.querySelector('button[type="submit"]') : null;
    if (errorEl) errorEl.textContent = '';

    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in…';
    }

    try {
      if (!email || !password) {
        throw new Error('Please enter your email and password.');
      }

      const res = await window.api.login({ email, password });

      if (!res || !res.user) {
        throw new Error(res && res.message ? res.message : 'Login failed. Please check your credentials and try again.');
      }

      this.saveUser(res.user);
      this.closeAuthModal();
      if (window.showToast) {
        window.showToast(`Welcome back, ${res.user.name || 'friend'}! 🎉`, 'success');
      }
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials and try again.';
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
      }
      if (window.showToast) {
        window.showToast(msg, 'error');
      }
    } finally {
      // Restore button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In to Zovira ➔';
      }
    }
  }

  async handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const phone = document.getElementById('register-phone').value.trim();
    const address = document.getElementById('register-address').value.trim();
    const errorEl = document.getElementById('register-error');
    const submitBtn = e.target ? e.target.querySelector('button[type="submit"]') : null;
    if (errorEl) errorEl.textContent = '';

    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating account…';
    }

    try {
      if (!name || !email || !password) {
        throw new Error('Please fill in all required fields.');
      }

      const res = await window.api.register({ name, email, password, phone, address });

      if (!res || !res.user) {
        throw new Error(res && res.message ? res.message : 'Registration failed. Please try again.');
      }

      this.saveUser(res.user);
      this.closeAuthModal();
      if (window.showToast) {
        window.showToast(`Account created! Welcome, ${res.user.name}! 🎉`, 'success');
      }
    } catch (err) {
      const msg = err.message || 'Registration failed. Please try again.';
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
      }
      if (window.showToast) {
        window.showToast(msg, 'error');
      }
    } finally {
      // Restore button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Zovira Account ➔';
      }
    }
  }

  logout(notify = true) {
    window.api.logout();
    this.saveUser(null);
    if (notify && window.showToast) {
      window.showToast('You have been logged out.', 'info');
    }
  }

  // ==========================================
  // My Orders Modal
  // ==========================================

  async openOrdersModal() {
    const modalBackdrop = document.getElementById('orders-modal-backdrop');
    const listContainer = document.getElementById('orders-list-container');
    if (!modalBackdrop || !listContainer) return;

    modalBackdrop.classList.add('open');
    listContainer.innerHTML = `
      <div style="text-align:center;padding:3rem 1rem;color:var(--text-muted);">
        <div style="font-size:2rem;margin-bottom:0.5rem;">⏳</div>
        <p>Loading your orders...</p>
      </div>
    `;

    try {
      const res = await window.api.getMyOrders();
      const orders = Array.isArray(res.orders) ? res.orders : [];

      if (orders.length === 0) {
        listContainer.innerHTML = `
          <div class="empty-state" style="padding:2.5rem 1rem;">
            <div class="empty-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Once you complete a purchase, your full order history appears here.</p>
            <button class="btn-primary" onclick="authManager.closeOrdersModal()">Browse Catalog</button>
          </div>
        `;
        return;
      }

      listContainer.innerHTML = orders.map(order => {
        const items     = Array.isArray(order.items) ? order.items : [];
        const total     = Number(order.total);
        const totalLbl  = Number.isFinite(total) ? `$${total.toFixed(2)}` : '—';
        const date      = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
        const addr      = order.shippingAddress;
        const addrStr   = addr ? [addr.street, addr.city, addr.state, addr.zipCode].filter(Boolean).join(', ') : '';

        const statusColor = {
          'Confirmed':  '#16a34a',
          'Processing': '#d97706',
          'Shipped':    '#2563eb',
          'Delivered':  '#7c3aed',
          'Cancelled':  '#dc2626'
        }[order.orderStatus] || 'var(--primary)';

        return `
          <div class="order-card" style="margin-bottom:1rem;">
            <div class="order-card-header">
              <div>
                <strong style="font-size:0.95rem;">${order.id || 'Order'}</strong>
                ${date ? `<div style="color:var(--text-muted);font-size:0.78rem;margin-top:0.15rem;">📅 ${date}</div>` : ''}
              </div>
              <span class="order-status-badge" style="background:${statusColor}20;color:${statusColor};border:1px solid ${statusColor}40;">
                ${order.orderStatus || 'Confirmed'}
              </span>
            </div>

            <div style="font-size:0.85rem;margin-bottom:0.65rem;">
              ${items.map(item => {
                const lineTotal = Number(item.itemTotal != null ? item.itemTotal : (Number(item.price) || 0) * (item.quantity || 1));
                return `
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:0.2rem 0;border-bottom:1px solid var(--bg-subtle);">
                    <span style="color:var(--text);">
                      <strong>${item.quantity || 1}×</strong> ${item.title || 'Item'}
                    </span>
                    <strong style="white-space:nowrap;margin-left:0.5rem;">$${Number.isFinite(lineTotal) ? lineTotal.toFixed(2) : '0.00'}</strong>
                  </div>
                `;
              }).join('')}
            </div>

            ${addrStr ? `
              <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.5rem;">
                📍 ${addrStr}
              </div>
            ` : ''}

            ${order.estimatedDelivery ? `
              <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.5rem;">
                🚚 Est. Delivery: <strong>${order.estimatedDelivery}</strong>
              </div>
            ` : ''}

            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px dashed var(--border);padding-top:0.5rem;margin-top:0.25rem;">
              <span style="font-size:0.82rem;color:var(--text-muted);">
                💳 ${order.paymentMethod || 'Card'} • ${order.paymentStatus || 'Paid'}
              </span>
              <strong style="color:var(--primary);font-size:1rem;">${totalLbl}</strong>
            </div>
          </div>
        `;
      }).join('');

    } catch (err) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⚠️</div>
          <h3>Could not load orders</h3>
          <p>${err.message || 'Please try again.'}</p>
          <button class="btn-primary" onclick="authManager.openOrdersModal()">Retry</button>
        </div>
      `;
    }
  }

  closeOrdersModal() {
    const modalBackdrop = document.getElementById('orders-modal-backdrop');
    if (modalBackdrop) modalBackdrop.classList.remove('open');
  }

  // ==========================================
  // Profile Modal
  // ==========================================

  openProfileModal() {
    if (!this.currentUser) return;
    const modalBackdrop = document.getElementById('profile-modal-backdrop');
    if (!modalBackdrop) return;

    document.getElementById('profile-name').value = this.currentUser.name || '';
    document.getElementById('profile-email').value = this.currentUser.email || '';
    document.getElementById('profile-phone').value = this.currentUser.phone || '';
    document.getElementById('profile-address').value = this.currentUser.address || '';

    modalBackdrop.classList.add('open');
  }

  closeProfileModal() {
    const modalBackdrop = document.getElementById('profile-modal-backdrop');
    if (modalBackdrop) modalBackdrop.classList.remove('open');
  }

  async handleProfileUpdate(e) {
    e.preventDefault();
    const name = document.getElementById('profile-name').value.trim();
    const phone = document.getElementById('profile-phone').value.trim();
    const address = document.getElementById('profile-address').value.trim();

    try {
      const res = await window.api.updateProfile({ name, phone, address });
      this.saveUser(res.user);
      this.closeProfileModal();
      if (window.showToast) {
        window.showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      if (window.showToast) {
        window.showToast(err.message || 'Failed to update profile', 'error');
      }
    }
  }
}

// Global Auth Instance (accessible as window.authManager and authManager)
var authManager = window.authManager = new AuthManager();
