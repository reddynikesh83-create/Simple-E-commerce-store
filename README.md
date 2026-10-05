@@ -1,162 +1 @@
# 💎 Zovira — Next-Gen 3D Interactive E-Commerce Store

**CodeAlpha Full Stack Development Internship — Task 1**

A fully functional e-commerce web application with a 3D interactive product viewer, real-time shopping cart, user authentication, order processing, and a JSON-file database backend.

---

## 🚀 Quick Start (Windows)

### Option A — Double-click (Easiest)
1. Double-click **`START_SERVER.bat`**
2. It will automatically:
   - Check if Node.js is installed
   - Run `npm install` (if first time)
   - Start the server on `http://localhost:5000`
3. Open your browser to **http://localhost:5000**

### Option B — Manual (Command Prompt / Terminal)
```bash
cd "c:/codoAlpha simple E- commerce store"
npm install
node server.js
```

> **Prerequisite:** [Node.js LTS](https://nodejs.org) must be installed on your computer.

---

## 🌐 URLs After Server Starts

| URL | Description |
|-----|-------------|
| `http://localhost:5000` | 🛒 Main Storefront |
| `http://localhost:5000/api/products` | 📦 Products REST API |
| `http://localhost:5000/api/products/categories` | 🏷️ Categories API |
| `http://localhost:5000/api/auth/register` | 👤 Register API |
| `http://localhost:5000/api/auth/login` | 🔑 Login API |
| `http://localhost:5000/api/orders` | 📋 Orders API |
| `http://localhost:5000/api/health` | 💚 Health Check |

---

## ✨ Features

### 🛍️ Shopping Cart
- Add/remove products with quantity controls
- Real-time price calculation (subtotal, tax 8%, shipping)
- Free shipping on orders over \$100
- Promo codes: `ZOVIRA10` (10% off), `ALPHA10` (10% off), `CODEALPHA` (\$15 off)
- Persistent cart (saved to localStorage across sessions)

### 📦 Product Catalog
- **50 curated products** across 5 categories: Electronics, Fashion, Home & Living, Sports & Fitness, Beauty & Wellness
- Search, sort, filter by category, and pagination
- **Interactive 3D WebGL viewer** (Three.js) — drag to orbit 360°, scroll to zoom
- Product details modal with specs, reviews, and "Add to Cart" / "Buy Now"

### 🔐 User Authentication
- Register & login with email/password
- PBKDF2 password hashing (no plain-text passwords stored)
- JWT token-based sessions (custom HMAC-SHA256 implementation)
- Profile editing (name, phone, shipping address)
- Demo account: `alex.morgan@zovira.store` / `password123`

### 🧾 Order Processing
- Full checkout form (shipping details + payment method)
- Real backend order creation with stock deduction
- Order confirmation receipt modal with order ID
- Order history in "My Orders" (merged from backend + local storage)

### 🗃️ Database (JSON Files)
| File | Contents |
|------|----------|
| `data/products.json` | 50 products catalog (auto-seeded on first run) |
| `data/users.json` | Registered users with hashed passwords |
| `data/orders.json` | All placed orders |

> The `data/` directory is auto-created on first server start.

---

## 🏗️ Project Structure

```
📦 codoAlpha simple E- commerce store/
├── 📄 server.js              — Express.js server entrypoint
├── 📄 package.json           — npm dependencies
├── 📄 START_SERVER.bat       — One-click Windows startup script
│
├── 📁 backend/               — Backend modules
│   ├── 📄 db.js              — JSON file database engine (CRUD for products/users/orders)
│   ├── 📄 auth.js            — Password hashing, JWT token generation & verification
│   └── 📁 routes/
│       ├── 📄 products.js    — GET /api/products, /categories, /:id, POST /:id/reviews
│       ├── 📄 auth.js        — POST /api/auth/register, /login, GET /me, PUT /profile
│       └── 📄 orders.js      — POST /api/orders (create), GET /api/orders (my orders)
│
├── 📁 data/                  — Auto-created database files (JSON)
│   ├── 📄 products.json      — 50 products catalog
│   ├── 📄 users.json         — Registered users
│   └── 📄 orders.json        — Placed orders
│
└── 📁 public/                — Frontend (served as static files)
    ├── 📄 index.html         — Main store page
    ├── 📁 css/
    │   └── 📄 style.css      — Complete store stylesheet
    └── 📁 js/
        ├── 📄 products-data.js — Client-side 50 products catalog (offline fallback)
        ├── 📄 api.js           — API client (fetches from backend OR falls back offline)
        ├── 📄 auth.js          — Authentication modal & user session management
        ├── 📄 cart.js          — Shopping cart logic & drawer UI
        ├── 📄 products.js      — Product catalog rendering & product details modal
        ├── 📄 checkout.js      — Checkout form & order submission
        ├── 📄 three3d.js       — Three.js 3D WebGL viewer
        └── 📄 app.js           — App initializer & toast notifications
```

---

## 🔧 Promo Codes

| Code | Discount |
|------|----------|
| `ZOVIRA10` | 10% off entire order |
| `ALPHA10` | 10% off entire order |
| `CODEALPHA` | \$15 flat discount |

---

## 💡 Offline / Standalone Mode

If the backend server is NOT running, the frontend automatically switches to **Standalone Demo Mode**:
- Products loaded from `products-data.js` (client-side)
- Login/Register creates local demo sessions  
- Orders saved to browser `localStorage`
- All features remain functional for demonstration

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla JavaScript (ES6+), HTML5, CSS3 |
| 3D Graphics | Three.js (WebGL) |
| Backend | Node.js + Express.js |
| Database | JSON file store (zero dependencies) |
| Auth | PBKDF2 password hashing + custom HMAC-SHA256 JWT |
| Deployment | localhost:5000 (can be deployed to any Node.js host) |

---

## 📝 Notes

- The server runs on **port 5000** by default. Set `PORT` environment variable to change it.
- Products data is seeded automatically from `backend/db.js` on first launch.
- The demo user (`alex.morgan@zovira.store` / `password123`) is auto-created on first run.

---

*© 2026 Zovira — CodeAlpha Internship Project Task 1*
