// backend/routes/transactions.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');

// Semua route harus login
router.use(authenticateToken);

// GET /api/transactions - Get semua transaksi
router.get('/', transactionController.getAllTransactions);

// POST /api/transactions - Create transaksi baru
router.post('/', transactionController.createTransaction);

// GET /api/transactions/products - Get semua produk
router.get('/products', transactionController.getProducts);

// GET /api/transactions/outlets - Get semua outlet
router.get('/outlets', transactionController.getOutlets);

// GET /api/transactions/cashiers - Get semua kasir
router.get('/cashiers', transactionController.getCashiers);

module.exports = router;