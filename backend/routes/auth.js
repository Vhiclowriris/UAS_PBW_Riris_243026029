// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/register (opsional, development only)
// router.post('/register', authController.register);

// GET /api/auth/profile (protected)
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;