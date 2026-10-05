/**
 * CodeAlpha Simple E-Commerce Store - Product Catalog & Details Management
 */

class ProductManager {
  constructor() {
    this.currentCategory = 'All';
    this.searchQuery = '';
    this.currentSort = 'default';
    this.allProducts = [];
    this.currentModalProduct = null;
    this.currentPage = 1;
    this.limit = 12;
    this.totalCount = 0;
    this.totalPages = 1;
  }

  async init() {
    await this.loadCategories();
    await this.loadProducts();
    this.bindEvents();
  }

  bindEvents() {
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.searchQuery = e.target.value.trim();
          this.currentPage = 1;
          this.loadProducts();
        }, 300);
      });
    }

    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.currentPage = 1;
        this.loadProducts();
      });
    }
  }

  async loadCategories() {
    try {
      const res = await window.api.getCategories();
      if (res && res.categories) {
        this.renderCategoryPills(res.categories);
      }
    } catch (err) {
      console.warn('Could not load categories', err);
    }
  }

  renderCategoryPills(categories) {
    const container = document.getElementById('category-pills');
    if (!container) return;

    container.innerHTML = categories.map(cat => `
      <button 
        class="category-pill ${cat.name === this.currentCategory ? 'active' : ''}" 
        onclick="productManager.setCategory('${cat.name}')"
      >
        ${cat.name} ${cat.count !== undefined ? `<span style="opacity: 0.75; font-size: 0.8em;">(${cat.count})</span>` : ''}
      </button>
    `).join('');
  }

  setCategory(category) {
    this.currentCategory = category;
    this.currentPage = 1;
    const pills = document.querySelectorAll('.category-pill');
    pills.forEach(pill => {
      if (pill.textContent.includes(category)) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
    this.loadProducts();
  }

  async loadProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <div style="font-size: 2rem; margin-bottom: 0.5rem; animation: spin 1s infinite linear;">⏳</div>
        <p>Loading items from catalog...</p>
      </div>
    `;

    try {
      const res = await window.api.getProducts({
        category: this.currentCategory,
        search: this.searchQuery,
        sort: this.currentSort,
        page: this.currentPage,
        limit: this.limit
      });

      this.allProducts = res.products || [];
      this.totalCount = res.total !== undefined ? res.total : this.allProducts.length;
      this.totalPages = res.totalPages !== undefined ? res.totalPages : 1;

      this.renderProducts(this.allProducts);
      this.renderPagination();
    } catch (err) {
      console.error('Error fetching products', err);
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⚠️</div>
          <h3>Failed to load products</h3>
          <p>${err.message || 'Please check if the backend server is running.'}</p>
          <button class="btn-primary" onclick="productManager.loadProducts()">Try Again</button>
        </div>
      `;
    }
  }

  renderProducts(products) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No products found</h3>
          <p>We couldn't find any products matching your criteria.</p>
          <button class="btn-primary" onclick="productManager.resetFilters()">Clear Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map(p => {
      const discount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
      return `
        <div class="product-card" id="card-${p.id}">
          <div class="product-image-wrap" onclick="productManager.openProductModal('${p.id}')" style="cursor: pointer;">
            <img src="${p.image}" alt="${p.title}" loading="lazy" />
            <div class="product-badge-group">
              <span class="tag-badge tag-3d">🕶️ 3D</span>
              ${p.tags && p.tags.includes('bestseller') ? '<span class="tag-badge tag-bestseller">Bestseller</span>' : ''}
              ${p.tags && p.tags.includes('new') ? '<span class="tag-badge tag-new">New</span>' : ''}
              ${discount > 0 ? `<span class="tag-badge tag-sale">Save ${discount}%</span>` : ''}
            </div>
          </div>
          <div class="product-info">
            <div class="product-meta">
              <span class="product-category">${p.category}</span>
              <span class="product-rating">⭐ ${p.rating} <span style="color: var(--text-light); font-weight: normal;">(${p.reviewCount})</span></span>
            </div>
            <h3 class="product-title" onclick="productManager.openProductModal('${p.id}')" title="${p.title}">${p.title}</h3>
            <p class="product-desc">${p.description}</p>
            <div class="product-footer">
              <div class="price-wrap">
                <span class="price-current">$${p.price.toFixed(2)}</span>
                ${p.originalPrice ? `<span class="price-original">$${p.originalPrice.toFixed(2)}</span>` : ''}
              </div>
              <div class="product-actions">
                <button class="btn-card-view" title="Quick View & 3D Model" onclick="productManager.openProductModal('${p.id}', '3d')">👁️ 3D</button>
                <button class="btn-card-cart" onclick="productManager.handleAddToCart('${p.id}')">
                  🛒 Add
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  resetFilters() {
    this.currentCategory = 'All';
    this.searchQuery = '';
    this.currentSort = 'default';
    this.currentPage = 1;

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.value = 'default';

    this.loadCategories();
    this.loadProducts();
  }

  handleAddToCart(productId) {
    const product = (this.allProducts && this.allProducts.find(p => String(p.id) === String(productId)))
      || (window.ZOVIRA_PRODUCTS_50 && window.ZOVIRA_PRODUCTS_50.find(p => String(p.id) === String(productId)))
      || (window.api && window.api.getProductFromCatalog && window.api.getProductFromCatalog(productId));

    if (!product) {
      if (window.showToast) {
        window.showToast('Could not add this item. Please try again.', 'error');
      }
      return;
    }
    window.cartManager.addItem(product, 1);
    // Immediately open cart drawer so shopper sees added product
    window.cartManager.toggleCartDrawer(true);
  }

  renderPagination() {
    let paginationContainer = document.getElementById('catalog-pagination');
    if (!paginationContainer) {
      paginationContainer = document.createElement('div');
      paginationContainer.id = 'catalog-pagination';
      paginationContainer.className = 'catalog-pagination';
      const main = document.querySelector('.main-container');
      if (main) main.appendChild(paginationContainer);
    }

    if (this.totalPages <= 1) {
      paginationContainer.innerHTML = `
        <div class="pagination-info">Showing all <strong>${this.totalCount}</strong> products</div>
        <div class="pagination-limit-wrap">
          <label style="font-size: 0.82rem; color: var(--text-muted);">Per Page:</label>
          <select class="select-control" style="padding: 0.35rem 0.65rem; font-size: 0.82rem;" onchange="productManager.setLimit(this.value)">
            <option value="12" ${this.limit === 12 ? 'selected' : ''}>12</option>
            <option value="24" ${this.limit === 24 ? 'selected' : ''}>24</option>
            <option value="50" ${this.limit === 50 ? 'selected' : ''}>All 50</option>
          </select>
        </div>
      `;
      return;
    }

    const startItem = (this.currentPage - 1) * this.limit + 1;
    const endItem = Math.min(this.currentPage * this.limit, this.totalCount);

    let pagesHtml = '';
    for (let i = 1; i <= this.totalPages; i++) {
      pagesHtml += `
        <button class="btn-page ${i === this.currentPage ? 'active' : ''}" onclick="productManager.goToPage(${i})">
          ${i}
        </button>
      `;
    }

    paginationContainer.innerHTML = `
      <div class="pagination-info">
        Showing <strong>${startItem}–${endItem}</strong> of <strong>${this.totalCount}</strong> products
      </div>
      <div class="pagination-buttons">
        <button class="btn-page-nav" ${this.currentPage <= 1 ? 'disabled' : ''} onclick="productManager.goToPage(${this.currentPage - 1})">
          ← Prev
        </button>
        ${pagesHtml}
        <button class="btn-page-nav" ${this.currentPage >= this.totalPages ? 'disabled' : ''} onclick="productManager.goToPage(${this.currentPage + 1})">
          Next →
        </button>
      </div>
      <div class="pagination-limit-wrap">
        <label style="font-size: 0.82rem; color: var(--text-muted);">Per Page:</label>
        <select class="select-control" style="padding: 0.35rem 0.65rem; font-size: 0.82rem;" onchange="productManager.setLimit(this.value)">
          <option value="12" ${this.limit === 12 ? 'selected' : ''}>12</option>
          <option value="24" ${this.limit === 24 ? 'selected' : ''}>24</option>
          <option value="50" ${this.limit === 50 ? 'selected' : ''}>All 50</option>
        </select>
      </div>
    `;
  }

  goToPage(pageNum) {
    if (pageNum < 1 || pageNum > this.totalPages) return;
    this.currentPage = pageNum;
    this.loadProducts();
    const toolbar = document.querySelector('.store-toolbar');
    if (toolbar) toolbar.scrollIntoView({ behavior: 'smooth' });
  }

  setLimit(newLimit) {
    this.limit = parseInt(newLimit, 10) || 12;
    this.currentPage = 1;
    this.loadProducts();
  }

  // ==========================================
  // Product Details Modal
  // ==========================================

  async openProductModal(productId, initialTab = 'photo') {
    const modalBackdrop = document.getElementById('product-modal-backdrop');
    const modalBody = document.getElementById('product-modal-body');
    if (!modalBackdrop || !modalBody) return;

    // Fast in-memory lookup first: 0ms instant display without waiting for network
    let p = (this.allProducts && this.allProducts.find(item => String(item.id) === String(productId)))
      || (window.ZOVIRA_PRODUCTS_50 && window.ZOVIRA_PRODUCTS_50.find(item => String(item.id) === String(productId)))
      || (window.api && window.api.getProductFromCatalog && window.api.getProductFromCatalog(productId));

    if (!p) {
      modalBody.innerHTML = `
        <div style="padding: 4rem 2rem; text-align: center; color: var(--text-muted);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem; animation: spin 1s infinite linear;">⏳</div>
          <p>Loading product details...</p>
        </div>
      `;
      modalBackdrop.classList.add('open');

      try {
        const res = await window.api.getProduct(productId);
        p = res && res.product;
      } catch (err) {
        console.warn('API getProduct error', err);
      }
    }

    if (!p && window.ZOVIRA_PRODUCTS_50 && window.ZOVIRA_PRODUCTS_50.length > 0) {
      p = window.ZOVIRA_PRODUCTS_50[0];
    }

    if (!p) {
      modalBody.innerHTML = `
        <div class="empty-state">
          <h3>Failed to load product</h3>
          <p>Product could not be found.</p>
        </div>
      `;
      modalBackdrop.classList.add('open');
      return;
    }

    this.currentModalProduct = p;

    const price = Number(p.price) || 0;
    const originalPrice = Number(p.originalPrice) || 0;
    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
    const specsHtml = p.specs ? Object.entries(p.specs).map(([key, val]) => `
      <tr>
        <td>${key}</td>
        <td>${val}</td>
      </tr>
    `).join('') : '';

    const reviews = Array.isArray(p.reviews) ? p.reviews : [];
    const reviewsHtml = reviews.length > 0 ? reviews.map(r => {
      const starCount = Math.max(1, Math.min(5, Math.round(Number(r.rating) || 5)));
      return `
        <div class="review-item">
          <div class="review-top">
            <span class="review-author">${r.user || 'Verified Buyer'}</span>
            <span style="color: var(--warning); font-weight: 700;">${'★'.repeat(starCount)}${'☆'.repeat(5 - starCount)}</span>
          </div>
          <p class="review-comment">"${r.comment || ''}"</p>
          <div style="font-size: 0.72rem; color: var(--text-light); margin-top: 0.25rem;">${r.date || 'Recent'}</div>
        </div>
      `;
    }).join('') : '<p style="color: var(--text-muted); font-size: 0.88rem;">No reviews yet. Be the first to share your thoughts!</p>';

    modalBody.innerHTML = `
      <div class="product-detail-layout">
        <div class="modal-media-column">
          <div class="modal-media-tabs">
            <button class="modal-media-tab active" id="tab-modal-photo" onclick="productManager.switchModalMedia('photo')">
              📷 2D Photo
            </button>
            <button class="modal-media-tab" id="tab-modal-3d" onclick="productManager.switchModalMedia('3d')">
              🕶️ Interactive 3D Model
            </button>
          </div>
          <div id="modal-photo-wrap">
            <img src="${p.image || ''}" alt="${p.title || 'Product'}" class="product-detail-img" />
          </div>
          <div id="modal-3d-wrap" class="modal-3d-stage" style="display: none;">
            <div class="modal-3d-controls-hint">
              <span>🖱️ Click & Drag to Orbit 360°</span> • <span>🔍 Scroll to Zoom</span>
            </div>
          </div>
        </div>
        <div class="detail-info">
          <div class="detail-badge-row">
            <span class="product-category">${p.category || 'Product'}</span>
            <span class="product-rating">⭐ ${Number(p.rating || 4.8).toFixed(1)} (${p.reviewCount || reviews.length} reviews)</span>
            ${(p.stock !== undefined && p.stock > 0) ? `<span style="font-size: 0.8rem; color: var(--success); font-weight: 600;">✓ In Stock (${p.stock})</span>` : `<span style="font-size: 0.8rem; color: var(--success); font-weight: 600;">✓ In Stock</span>`}
          </div>

          <h2 class="detail-title">${p.title || 'Exclusive Product'}</h2>

          <div class="detail-price-row">
            <span class="detail-price">$${price.toFixed(2)}</span>
            ${originalPrice > price ? `<span class="detail-original-price">$${originalPrice.toFixed(2)}</span>` : ''}
            ${discount > 0 ? `<span class="tag-badge tag-sale">Save ${discount}%</span>` : ''}
          </div>

          <p class="detail-desc">${p.detailedDescription || p.description || ''}</p>

          ${specsHtml ? `
            <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem;">Specifications</h4>
            <table class="specs-table">
              <tbody>${specsHtml}</tbody>
            </table>
          ` : ''}

          <div class="detail-cta-row">
            <div class="qty-control" style="height: 42px;">
              <button class="qty-btn" style="width: 38px;" onclick="productManager.adjustDetailQty(-1)">−</button>
              <span class="qty-val" id="detail-qty" style="min-width: 36px;">1</span>
              <button class="qty-btn" style="width: 38px;" onclick="productManager.adjustDetailQty(1)">+</button>
            </div>
            <button class="btn-primary" style="flex: 1; height: 42px;" onclick="productManager.addDetailToCart()">
              🛒 Add to Cart
            </button>
            <button class="btn-secondary" style="height: 42px;" onclick="productManager.buyNow()">
              ⚡ Buy Now
            </button>
          </div>
        </div>
      </div>

      <!-- Customer Reviews Section -->
      <div class="product-reviews-section">
        <div class="reviews-header">
          <h3 style="font-size: 1.15rem; font-weight: 700;">Customer Reviews (${p.reviewCount || reviews.length})</h3>
          <span style="font-size: 0.9rem; font-weight: 600; color: var(--warning);">Overall: ⭐ ${Number(p.rating || 4.8).toFixed(1)} / 5.0</span>
        </div>

        <div class="reviews-list">
          ${reviewsHtml}
        </div>

        <!-- Add Review Form -->
        <form class="review-form" onsubmit="productManager.submitReview(event, '${p.id}')">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem;">Write a Review</h4>
          <div class="review-form-row">
            <div style="flex: 1;">
              <label class="form-label">Your Name</label>
              <input type="text" id="review-user" class="form-input" placeholder="e.g. John Doe" required value="${window.authManager && window.authManager.currentUser ? window.authManager.currentUser.name : ''}" />
            </div>
            <div style="width: 140px;">
              <label class="form-label">Rating</label>
              <select id="review-rating" class="form-input">
                <option value="5">⭐⭐⭐⭐⭐ 5/5</option>
                <option value="4">⭐⭐⭐⭐ 4/5</option>
                <option value="3">⭐⭐⭐ 3/5</option>
                <option value="2">⭐⭐ 2/5</option>
                <option value="1">⭐ 1/5</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Review Comment</label>
            <textarea id="review-comment" class="form-input" rows="2" placeholder="Tell other shoppers what you loved about this product..." required></textarea>
          </div>
          <button type="submit" class="btn-primary" style="padding: 0.5rem 1.25rem; font-size: 0.88rem;">
            Submit Review
          </button>
        </form>
      </div>
    `;

    modalBackdrop.classList.add('open');

    if (initialTab === '3d') {
      setTimeout(() => this.switchModalMedia('3d'), 50);
    }
  }

  adjustDetailQty(delta) {
    const qtySpan = document.getElementById('detail-qty');
    if (!qtySpan) return;
    let qty = parseInt(qtySpan.textContent, 10) || 1;
    qty = Math.max(1, qty + delta);
    qtySpan.textContent = qty;
  }

  addDetailToCart() {
    if (!this.currentModalProduct) return;
    const qtySpan = document.getElementById('detail-qty');
    const qty = qtySpan ? parseInt(qtySpan.textContent, 10) || 1 : 1;
    window.cartManager.addItem(this.currentModalProduct, qty);
    this.closeProductModal();
    window.cartManager.toggleCartDrawer(true);
  }

  buyNow() {
    if (!this.currentModalProduct) return;
    const qtySpan = document.getElementById('detail-qty');
    const qty = qtySpan ? parseInt(qtySpan.textContent, 10) || 1 : 1;
    window.cartManager.addItem(this.currentModalProduct, qty);
    this.closeProductModal();
    window.checkoutManager.openCheckoutModal();
  }

  switchModalMedia(type) {
    const photoTab = document.getElementById('tab-modal-photo');
    const threeDTab = document.getElementById('tab-modal-3d');
    const photoWrap = document.getElementById('modal-photo-wrap');
    const threeDWrap = document.getElementById('modal-3d-wrap');

    if (!photoTab || !threeDTab || !photoWrap || !threeDWrap) return;

    if (type === 'photo') {
      photoTab.classList.add('active');
      threeDTab.classList.remove('active');
      photoWrap.style.display = 'block';
      threeDWrap.style.display = 'none';
    } else {
      photoTab.classList.remove('active');
      threeDTab.classList.add('active');
      photoWrap.style.display = 'none';
      threeDWrap.style.display = 'block';

      if (window.zovira3D && this.currentModalProduct) {
        window.zovira3D.mountModal3DViewer(threeDWrap, this.currentModalProduct);
      }
    }
  }

  closeProductModal() {
    const modalBackdrop = document.getElementById('product-modal-backdrop');
    if (modalBackdrop) modalBackdrop.classList.remove('open');
  }

  async submitReview(e, productId) {
    e.preventDefault();
    const userInput = document.getElementById('review-user');
    const ratingSelect = document.getElementById('review-rating');
    const commentInput = document.getElementById('review-comment');

    if (!commentInput.value.trim()) return;

    try {
      const res = await window.api.submitReview(productId, {
        user: userInput ? userInput.value.trim() : 'Verified Buyer',
        rating: Number(ratingSelect.value),
        comment: commentInput.value.trim()
      });

      if (window.showToast) {
        window.showToast('Thank you! Your review was submitted.', 'success');
      }

      // Re-open modal to refresh review list
      await this.openProductModal(productId);
    } catch (err) {
      if (window.showToast) {
        window.showToast(err.message || 'Failed to submit review', 'error');
      }
    }
  }
}

// Global Products Instance (accessible as window.productManager and productManager)
var productManager = window.productManager = new ProductManager();
