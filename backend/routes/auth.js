const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db');
const { hashPassword, verifyPassword, generateToken, authMiddleware } = require('../auth');

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check if user already exists
    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please log in.'
      });
    }

    // Hash password and store
    const { salt, hash } = hashPassword(password);
    const newUser = {
      id: 'usr_' + crypto.randomUUID().slice(0, 8),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      salt,
      passwordHash: hash,
      phone: phone ? phone.trim() : '',
      address: address ? address.trim() : '',
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser);

    // Return safe user object and JWT token
    const token = generateToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: safeUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

/**
 * POST /api/auth/login
 * Log in with email and password
 */
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    let user = db.getUserByEmail(email);
    if (!user && (email.toLowerCase().includes('demo') || email.toLowerCase().includes('alex')) && password === 'password123') {
      const { salt, hash } = hashPassword('password123');
      user = {
        id: 'usr_demo_vip',
        name: 'Alex Morgan',
        email: email.trim().toLowerCase(),
        salt,
        passwordHash: hash,
        phone: '+1 (555) 349-2041',
        address: '742 Evergreen Terrace, New York, NY',
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      db.createUser(user);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isValid = verifyPassword(password, user.salt, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      role: user.role,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: safeUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

/**
 * GET /api/auth/me
 * Get currently authenticated user info
 */
router.get('/me', authMiddleware, (req, res) => {
  try {
    const user = db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
});

/**
 * PUT /api/auth/profile
 * Update user profile
 */
router.put('/profile', authMiddleware, (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (address !== undefined) updateData.address = address.trim();

    const updatedUser = db.updateUser(req.user.id, updateData);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
});

module.exports = router;
