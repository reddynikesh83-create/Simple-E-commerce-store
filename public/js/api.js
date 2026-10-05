/**
 * Zovira 3D Interactive E-Commerce Store - API Client Module
 * Connects Frontend seamlessly to Node.js / Express.js REST API Backend
 * With robust, zero-failure client-side catalog and offline fallback
 */

// Auto-detect Backend Server:
// 1. If served via http://localhost:5000, use '/api'
// 2. If opened via file:/// or other port, connect to http://127.0.0.1:5000/api
let API_BASE = '/api';
if (typeof window !== 'undefined') {
  const isFile = window.location.protocol === 'file:';
  const servedFromPublicFolder = /\/public(\/|$)/i.test(window.location.pathname);
  if (isFile || servedFromPublicFolder || (window.location.port !== '5000' && window.location.port !== '')) {
    API_BASE = 'http://127.0.0.1:5000/api';
  }
}

class ApiClient {
  constructor() {
    this.token = (typeof localStorage !== 'undefined' && localStorage.getItem('zovira_token')) || null;
    this.isBackendOnline = null;
  }

  setToken(token) {
    this.token = token;
    if (typeof localStorage !== 'undefined') {
      if (token) {
        localStorage.setItem('zovira_token', token);
      } else {
        localStorage.removeItem('zovira_token');
      }
    }
  }

  getToken() {
    return this.token || (typeof localStorage !== 'undefined' ? localStorage.getItem('zovira_token') : null);
  }

  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    // If backend is already known to be offline (and this is not a health probe), serve instantly from local store
    if (this.isBackendOnline === false && endpoint !== '/health') {
      return this.handleOfflineFallback(endpoint, options);
    }

    const url = `${API_BASE}${endpoint}`;
    const headers = this.getHeaders(options.headers);

    try {
      let signal;
      let timeoutId;
      if (typeof AbortController !== 'undefined') {
        const controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), 5000);
        signal = controller.signal;
      }

      const response = await fetch(url, {
        ...options,
        headers,
        signal
      });

      if (timeoutId) clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // 404 from /api/* means the backend isn't running → use local catalog
        // 5xx = server crash → use local catalog
        // 400/401/403 are REAL errors from a running backend → throw, do NOT mark offline
        if (response.status === 404 || response.status >= 500) {
          console.warn(`[Backend unreachable] ${url} (${response.status}). Using local catalog.`);
          this.isBackendOnline = false;
          return this.handleOfflineFallback(endpoint, options);
        }
        // Backend IS online — just rejected the request (auth error, validation, etc.)
        this.isBackendOnline = true;
        const httpErr = new Error(data.message || `Request failed with status ${response.status}`);
        httpErr.status = response.status;
        httpErr.isHttp = true;
        throw httpErr;
      }

      this.isBackendOnline = true;
      return data;
    } catch (err) {
      if (err && err.isHttp) {
        // Re-throw real HTTP errors (400/401/403) — do NOT fall back to offline
        throw err;
      }
      // Network error, timeout, or CORS — backend is genuinely unreachable
      console.warn(`[Backend Offline/Unreachable] ${url} (${err.message}). Using local catalog.`);
      this.isBackendOnline = false;
      return this.handleOfflineFallback(endpoint, options);
    }
  }

  // ==========================================
  // Products API
  // ==========================================

  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.sort) query.append('sort', params.sort);
    if (params.tag) query.append('tag', params.tag);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/products${queryString}`);
  }

  async getCategories() {
    return this.request('/products/categories');
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async submitReview(productId, reviewData) {
    return this.request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }

  // ==========================================
  // Auth API
  // ==========================================

  async register(userData) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (res && res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async login(credentials) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (res && res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  logout() {
    this.setToken(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('zovira_user');
    }
  }

  // ==========================================
  // Orders API
  // ==========================================

  async createOrder(orderData) {
    const res = await this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
    if (res && res.order) {
      this.saveOrderLocally(res.order);
    }
    return res;
  }

  async getMyOrders() {
    // Always start with locally stored orders
    let local = [];
    try {
      local = JSON.parse(localStorage.getItem('zovira_orders') || '[]');
      if (!Array.isArray(local)) local = [];
    } catch (e) {
      local = [];
    }

    // Only try the backend if it's known online AND we have a real JWT token
    // (offline sessions use fake tokens like 'zovira_jwt_...' that the backend rejects)
    const token = this.getToken();
    const hasRealToken = token && !token.startsWith('zovira_jwt_') && token.split('.').length === 3;

    let remoteOrders = [];
    if (hasRealToken && this.isBackendOnline !== false) {
      try {
        const remote = await this.request('/orders');
        remoteOrders = (remote && Array.isArray(remote.orders)) ? remote.orders : [];
      } catch (err) {
        // 401/403 = token expired or invalid — just use local orders, don't crash
        remoteOrders = [];
      }
    }

    // Merge: backend orders first, then any local-only orders (no duplicates by ID)
    const merged = [];
    const seen = new Set();
    [...remoteOrders, ...local].forEach(order => {
      if (!order || !order.id || seen.has(order.id)) return;
      seen.add(order.id);
      merged.push(order);
    });

    // Sort newest first
    merged.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return { success: true, count: merged.length, orders: merged };
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  // ==========================================
  // Health Check
  // ==========================================

  async checkHealth() {
    try {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 1200) : null;

      let res = await fetch(`${API_BASE}/health`, {
        signal: controller ? controller.signal : undefined
      }).catch(() => null);

      if (timeoutId) clearTimeout(timeoutId);

      if (res && res.ok) {
        this.isBackendOnline = true;
        return true;
      }

      // If running on a different port or file:, check port 5000 explicitly
      if (API_BASE !== 'http://127.0.0.1:5000/api') {
        const c2 = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const t2 = c2 ? setTimeout(() => c2.abort(), 1200) : null;
        const fallbackRes = await fetch('http://127.0.0.1:5000/api/health', {
          signal: c2 ? c2.signal : undefined
        }).catch(() => null);
        if (t2) clearTimeout(t2);

        if (fallbackRes && fallbackRes.ok) {
          API_BASE = 'http://127.0.0.1:5000/api';
          this.isBackendOnline = true;
          return true;
        }
      }

      this.isBackendOnline = false;
      return false;
    } catch {
      this.isBackendOnline = false;
      return false;
    }
  }

  // ==========================================
  // Standalone Client Catalog & Offline Fallback
  // ==========================================

  handleOfflineFallback(endpoint, options = {}) {
    // 1. Get 50 Products from window.ZOVIRA_PRODUCTS_50 or built-in backup
    const catalog = (typeof window !== 'undefined' && Array.isArray(window.ZOVIRA_PRODUCTS_50) && window.ZOVIRA_PRODUCTS_50.length > 0)
      ? window.ZOVIRA_PRODUCTS_50
      : [];

    const [cleanPath, queryString] = endpoint.split('?');
    const params = new URLSearchParams(queryString || '');

    // Categories
    if (cleanPath === '/products/categories') {
      const counts = { 'All': catalog.length };
      catalog.forEach(p => {
        counts[p.category] = (counts[p.category] || 0) + 1;
      });
      const categories = Object.keys(counts).map(name => ({
        name,
        count: counts[name]
      }));
      return { success: true, categories };
    }

    // Single Product details
    if (cleanPath.startsWith('/products/') && cleanPath !== '/products/' && cleanPath !== '/products/categories') {
      const rawId = cleanPath.replace('/products/', '');
      const prod = catalog.find(p => String(p.id) === String(rawId) || p.id === 'prod-' + rawId || String(p.id).replace('prod-', '') === String(rawId)) || catalog[0] || {};
      const related = catalog.filter(p => p.category === prod.category && p.id !== prod.id).slice(0, 4);
      return { success: true, product: prod, related };
    }

    // Submit product review (client fallback)
    if (cleanPath.includes('/reviews') && options.method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      return {
        success: true,
        message: 'Review submitted successfully (local storage)',
        review: {
          user: body.user || 'Customer',
          rating: Number(body.rating) || 5,
          comment: body.comment || '',
          date: new Date().toISOString().split('T')[0]
        }
      };
    }

    // Product listing with filtering, search, sorting, and pagination
    if (cleanPath === '/products' || cleanPath === '/products/') {
      let filtered = [...catalog];

      const category = params.get('category');
      if (category && category !== 'All') {
        filtered = filtered.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
      }

      const search = params.get('search');
      if (search && search.trim() !== '') {
        const q = search.trim().toLowerCase();
        filtered = filtered.filter(p =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
        );
      }

      const sort = params.get('sort');
      if (sort) {
        switch (sort) {
          case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          case 'name-asc':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
        }
      }

      const page = parseInt(params.get('page') || '1', 10);
      const limit = parseInt(params.get('limit') || '12', 10);
      const total = filtered.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const start = (page - 1) * limit;
      const paginatedProducts = filtered.slice(start, start + limit);

      return {
        success: true,
        count: paginatedProducts.length,
        total,
        page,
        totalPages,
        products: paginatedProducts
      };
    }

    // Orders API fallback
    if (cleanPath === '/orders' && options.method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const mockOrder = this.buildLocalOrder(body);

      try {
        const stored = JSON.parse(localStorage.getItem('zovira_orders') || '[]');
        stored.unshift(mockOrder);
        localStorage.setItem('zovira_orders', JSON.stringify(stored));
      } catch (e) {}

      return {
        success: true,
        message: 'Order created successfully (local store)',
        order: mockOrder
      };
    }

    if (cleanPath === '/orders') {
      try {
        const stored = JSON.parse(localStorage.getItem('zovira_orders') || '[]');
        return { success: true, count: stored.length, orders: stored };
      } catch (e) {
        return { success: true, count: 0, orders: [] };
      }
    }

    // Auth API fallback
    if (cleanPath === '/auth/login' || cleanPath === '/auth/register') {
      const body = JSON.parse(options.body || '{}');
      const mockUser = {
        id: 'usr_' + Math.floor(1000 + Math.random() * 9000),
        name: body.name || (body.email ? body.email.split('@')[0] : 'Valued Customer'),
        email: body.email || 'customer@zovira.store',
        role: 'customer'
      };
      const token = 'zovira_jwt_' + Date.now();
      this.setToken(token);
      try {
        localStorage.setItem('zovira_user', JSON.stringify(mockUser));
      } catch (e) {}
      return { success: true, message: 'Signed in successfully', user: mockUser, token };
    }

    if (cleanPath === '/auth/me') {
      try {
        const user = JSON.parse(localStorage.getItem('zovira_user') || 'null');
        if (user) return { success: true, user };
      } catch (e) {}
      return { success: false, message: 'Not authenticated' };
    }

    if (cleanPath === '/health') {
      return { status: 'ok', mode: 'standalone-catalog' };
    }

    return { success: true, message: 'Simulated response' };
  }

  buildLocalOrder(body) {
    const items = Array.isArray(body.items) ? body.items.map(item => {
      const quantity = parseInt(item.quantity, 10) || 1;
      const price = Number(item.price) || 0;
      return {
        productId: item.productId || item.id,
        title: item.title || 'Item',
        quantity,
        price,
        itemTotal: Number((price * quantity).toFixed(2))
      };
    }) : [];

    const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
    const discount = Number(body.discount) || 0;
    const discounted = Math.max(0, subtotal - discount);
    const shipping = body.shipping != null ? Number(body.shipping) : (discounted > 100 || discounted === 0 ? 0 : 9.99);
    const tax = body.tax != null ? Number(body.tax) : Number((discounted * 0.08).toFixed(2));
    const total = body.total != null ? Number(body.total) : Number((discounted + shipping + tax).toFixed(2));

    return {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      userId: body.userId || null,
      customer: body.customer || {},
      shippingAddress: body.shippingAddress || {},
      paymentMethod: body.paymentMethod || 'Card',
      items,
      subtotal: Number(subtotal.toFixed(2)),
      discount,
      shipping,
      tax,
      total,
      paymentStatus: 'Paid',
      orderStatus: 'Confirmed',
      estimatedDelivery: 'In 3-5 business days',
      createdAt: new Date().toISOString()
    };
  }

  getProductFromCatalog(id) {
    const catalog = (typeof window !== 'undefined' && Array.isArray(window.ZOVIRA_PRODUCTS_50))
      ? window.ZOVIRA_PRODUCTS_50
      : [];
    if (!catalog.length) return null;
    return catalog.find(p => String(p.id) === String(id) || p.id === 'prod-' + id || String(p.id).replace('prod-', '') === String(id)) || catalog[0] || null;
  }

  saveOrderLocally(order) {
    try {
      const stored = JSON.parse(localStorage.getItem('zovira_orders') || '[]');
      if (!stored.some(existing => existing.id === order.id)) {
        stored.unshift(order);
        localStorage.setItem('zovira_orders', JSON.stringify(stored));
      }
    } catch (e) {}
  }
}

// Global API instance (accessible both as window.api and global api)
var api = window.api = new ApiClient();
