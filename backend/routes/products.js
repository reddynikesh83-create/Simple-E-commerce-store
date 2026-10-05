const express = require('express');
const router = express.Router();
const db = require('../db');
const { optionalAuthMiddleware } = require('../auth');

/**
 * GET /api/products
 * Fetch products with optional filtering, search, and sorting
 */
router.get('/', (req, res) => {
  try {
    let products = db.getProducts();
    const { category, search, sort, tag, minPrice, maxPrice } = req.query;

    // Filter by category
    if (category && category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by tag (e.g. bestseller, sale, new)
    if (tag) {
      products = products.filter(p => p.tags && p.tags.includes(tag.toLowerCase()));
    }

    // Filter by price range
    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Search by title or description
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sort) {
      switch (sort) {
        case 'price-asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'name-asc':
          products.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          break;
      }
    }

    const total = products.length;
    const pageNum = req.query.page ? parseInt(req.query.page, 10) : 1;
    const limitNum = req.query.limit ? parseInt(req.query.limit, 10) : 0;

    let paginatedProducts = products;
    let totalPages = 1;

    if (limitNum > 0) {
      totalPages = Math.ceil(total / limitNum);
      const startIndex = (pageNum - 1) * limitNum;
      paginatedProducts = products.slice(startIndex, startIndex + limitNum);
    }

    res.json({
      success: true,
      count: paginatedProducts.length,
      total,
      page: pageNum,
      totalPages,
      products: paginatedProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
  }
});

/**
 * GET /api/products/categories
 * Get list of available categories with product counts
 */
router.get('/categories', (req, res) => {
  try {
    const products = db.getProducts();
    const categoryCounts = {};

    products.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    const categories = Object.keys(categoryCounts).map(name => ({
      name,
      count: categoryCounts[name]
    }));

    res.json({
      success: true,
      categories: [{ name: 'All', count: products.length }, ...categories]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
  }
});

/**
 * GET /api/products/:id
 * Get single product details
 */
router.get('/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Suggest related products in the same category
    const allProducts = db.getProducts();
    const related = allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3);

    res.json({
      success: true,
      product,
      related
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product details', error: error.message });
  }
});

/**
 * POST /api/products/:id/reviews
 * Add a customer review to a product
 */
router.post('/:id/reviews', optionalAuthMiddleware, (req, res) => {
  try {
    const { rating, comment, user } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    const products = db.getProducts();
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const reviewerName = req.user ? req.user.name : (user || 'Verified Buyer');
    const newReview = {
      user: reviewerName,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    if (!products[index].reviews) {
      products[index].reviews = [];
    }

    products[index].reviews.unshift(newReview);

    // Recalculate average rating
    const totalRating = products[index].reviews.reduce((sum, r) => sum + r.rating, 0);
    products[index].rating = Number((totalRating / products[index].reviews.length).toFixed(1));
    products[index].reviewCount = products[index].reviews.length;

    db.saveProducts(products);

    res.status(201).json({
      success: true,
      message: 'Review added successfully!',
      review: newReview,
      rating: products[index].rating,
      reviewCount: products[index].reviewCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add review', error: error.message });
  }
});

module.exports = router;
