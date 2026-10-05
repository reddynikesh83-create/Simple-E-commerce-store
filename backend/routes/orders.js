const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db');
const { optionalAuthMiddleware, authMiddleware } = require('../auth');

/**
 * POST /api/orders
 * Create and process a new order
 */
router.post('/', optionalAuthMiddleware, (req, res) => {
  try {
    const { items, customer, shippingAddress, paymentMethod, notes } = req.body;

    // Validate request
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
    }

    if (!customer || !customer.name || !customer.email) {
      return res.status(400).json({ success: false, message: 'Customer name and email are required.' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.zipCode) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required.' });
    }

    // Verify items, prices, and stock
    const products = db.getProducts();
    const processedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = products.find(p => p.id === item.productId || String(p.id) === String(item.productId) || String(p.id) === String(item.id));
      const qty = parseInt(item.quantity, 10) || 1;
      const price = product ? product.price : Number(item.price) || 0;
      const title = product ? product.title : (item.title || 'Item');

      if (product && product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.title}". Only ${product.stock} available.`
        });
      }

      const itemTotal = Number((price * qty).toFixed(2));
      subtotal += itemTotal;

      processedItems.push({
        productId: product ? product.id : (item.productId || item.id),
        title,
        price,
        image: product ? product.image : item.image,
        category: product ? product.category : item.category,
        quantity: qty,
        itemTotal
      });
    }

    // Calculations
    subtotal = Number(subtotal.toFixed(2));
    const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping above $100
    const taxRate = 0.08; // 8% sales tax
    const tax = Number((subtotal * taxRate).toFixed(2));
    const total = Number((subtotal + shipping + tax).toFixed(2));

    // Deduct stock for catalog items that exist
    for (const item of processedItems) {
      if (item.productId) {
        db.updateProductStock(item.productId, item.quantity);
      }
    }

    // Create unique order ID (e.g. ORD-2026-AB12)
    const orderCode = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder = {
      id: orderCode,
      userId: req.user ? req.user.id : null,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone || ''
      },
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state || '',
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country || 'USA'
      },
      items: processedItems,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod: paymentMethod || 'Card',
      paymentStatus: 'Paid',
      orderStatus: 'Confirmed',
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    db.createOrder(newOrder);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process order', error: error.message });
  }
});

/**
 * GET /api/orders
 * Fetch orders for the logged-in user
 */
router.get('/', authMiddleware, (req, res) => {
  try {
    const allOrders = db.getOrders();
    const userEmail = (req.user.email || '').toLowerCase();
    const orders = allOrders.filter(o =>
      o.userId === req.user.id ||
      (o.customer && o.customer.email && String(o.customer.email).toLowerCase() === userEmail)
    );
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
});

/**
 * GET /api/orders/:id
 * Fetch single order by ID (for receipt or tracking)
 */
router.get('/:id', optionalAuthMiddleware, (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // If order belongs to a user, ensure requester is authorized or guest owner
    if (order.userId && req.user && req.user.id !== order.userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order', error: error.message });
  }
});

module.exports = router;
