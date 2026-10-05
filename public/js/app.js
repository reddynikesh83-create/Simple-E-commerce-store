/**
 * CodeAlpha Simple E-Commerce Store - Application Orchestrator
 */

// Toast Notifications System
window.showToast = function(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${icons[type] || 'ℹ️'}</span>
    <span style="flex: 1;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Global Keyboard and Overlay Click Handlers
function setupGlobalEvents() {
  // ESC key closes any open modal or drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open, .drawer-backdrop.open').forEach(el => {
        el.classList.remove('open');
      });
    }
  });

  // Clicking backdrop (outside modal box) closes the modal
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('open');
      }
    });
  });

  // Cart drawer backdrop click to close
  const drawerBackdrop = document.getElementById('cart-drawer-backdrop');
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) {
        drawerBackdrop.classList.remove('open');
      }
    });
  }

  // Show/hide card fields based on payment method selection
  document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const cardDetails = document.getElementById('card-fields');
      if (cardDetails) {
        cardDetails.style.display = e.target.value === 'Card' ? 'block' : 'none';
      }
    });
  });
}

// App Initialization on DOM Ready
async function initZoviraApp() {
  setupGlobalEvents();

  // Initialize cart badge immediately
  if (window.cartManager) {
    window.cartManager.updateCartBadge();
  }

  // Initialize product catalog first so 50 products render instantly
  if (window.productManager) {
    try {
      await window.productManager.init();
    } catch (err) {
      console.warn('ProductManager initialization error', err);
    }
  }

  // Initialize 3D Engine (Hero 3D stage and card 3D tilt effects)
  if (window.zovira3D) {
    try {
      window.zovira3D.init();
    } catch (e) {
      console.warn('3D initialization notice:', e);
    }
  }

  // Initialize auth & session
  if (window.authManager) {
    try {
      await window.authManager.init();
    } catch (err) {
      console.warn('AuthManager initialization notice:', err);
    }
  }

  console.log('Zovira 3D E-Commerce Store initialized successfully.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initZoviraApp);
} else {
  initZoviraApp();
}
