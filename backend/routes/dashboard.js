// backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const exportController = require('../controllers/exportController');
const { authenticateToken } = require('../middleware/auth');

// Semua route dashboard harus login
router.use(authenticateToken);

// GET /api/dashboard/stats - Statistik untuk charts
router.get('/stats', dashboardController.getStats);

// GET /api/dashboard/export - Export CSV semua transaksi
router.get('/export', exportController.exportTransactions);

// GET /api/dashboard/export-summary - Export CSV summary
router.get('/export-summary', exportController.exportSummary);

module.exports = router;